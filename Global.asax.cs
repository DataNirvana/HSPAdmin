using MGL.Data.DataUtilities;
using MGL.Security;
using MGL.Web.WebUtilities;
using System;
using System.Security;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using DataNirvana.Database;
using MGL.Security.Email;
using System.Web.Configuration;
using System.Reflection;
using GHSP.WebAdmin;
using System.Text;
using MGL.DomainModel;
using DataNirvana.DomainModel.Database;
using DataNirvana.Config;
using DataNirvana.Document;

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
namespace GHSP.WebAdmin
{
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    public class Global : HttpApplication
    {
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        void Application_Start(object sender, EventArgs e)
        {
            //long nullTicks = DateTimeInformation.NullDate.Ticks;

            // How to configure some webscripts from loading
            // http://jupaol.blogspot.co.za/2012/09/enabling-unobtrusive-validation-from.html
            // https://blogs.msdn.microsoft.com/pranav_rastogi/2012/09/21/asp-net-4-5-scriptmanager-improvements-in-webforms/

            // Code that runs on application startup
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            LoadAppDefaults();
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Session_Start(Object sender, EventArgs e) {

            //_____ Add the Config Info to the address seshion interface
            MGL.Web.WebUtilities.MGLSessionInterface.Instance().Config = MGL.Web.WebUtilities.MGLApplicationInterface.Instance().ConfigDefault;

            //____ Generate a new Unique SessionID ...  Use for logging specific sessions ...
            MGLSessionInterface.Instance().GenerateNewSessionID();
            // 8-Jan-2015 - Code that runs when a new session is started - this stops the following error from occurring intermittently:
            // "Session state has created a session id, but cannot save it because the response was already flushed by the application"
            string sessionId = Session.SessionID;

            //_____ Update the number of users in the database ...
            bool success = DataNirvanaWebProcessing.LogNewSiteVisitor(MGLSessionInterface.Instance().Config);

            MGLSessionInterface.Instance().NumberOfUsers = DataNirvanaWebProcessing.GetNumberOfVisitors(MGLSessionInterface.Instance().Config);

            //_____ LEGACY - Increment the number of users ....
            MGLApplicationInterface.Instance().NumberOfUsers++;

            //_____ Set the Users Host Address at the startup of the session ...
            // 27-Nov-2015 - Converted to use this v4IPAddress method.
            //MGLSessionSecurityInterface.Instance().UserIPAddress = Request.UserHostAddress;
            MGLSessionSecurityInterface.Instance().UserIPAddress = IPAddressHelper.GetIP4OrAnyAddressFromHTTPRequest();

            // 7-Dec-2015 - set the default session timeout in minutes in the case locker object.
            //            if (CaseLocker.SessionTimeoutMins == 0) {
            //                CaseLocker.SessionTimeoutMins = Session.Timeout;
            //            }

            // 17-Dec-2015 - align the session UseHTTPS variable with the global variable and always set the session requires HTTPS if HTTPS is true
            MGLSessionInterface.Instance().UseHTTPS = MGLApplicationSecurityInterface.Instance().AppLoginConfig.UseHTTPS;
            if (MGLSessionInterface.Instance().UseHTTPS == true) {
                MGLSessionInterface.Instance().SetSessionRequiresHTTPs(Request.Cookies["AnonID"], sessionId, HttpContext.Current.Request.IsLocal);
            }
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Application_BeginRequest(Object sender, EventArgs e) {

            //-----a----- Ensure that ALL requests are redirected to HTTPS if this is required ...
            // In other sites (e.g. explore.rahapakistan.org) we also check the other way round and switch the pages back to HTTP, but for this site, it is 100% secured
            // 17-Dec-2015 - added CheckSessionRequiresHTTPs so that HTTPS can be used in specific sessions for admin or user administration functions ...
            // 21-Apr-2016 - Potential security exploit thwarted - the Request.ServerVariables["HTTP_HOST"] is actually pulled from the client which means that
            // it could have been edited maliciously and changed to someone elses website.  Better to use our own WebProjectPath which is set on the server
            if (MGLApplicationSecurityInterface.Instance().AppLoginConfig.UseHTTPS == true
                || MGLApplicationInterface.Instance().CheckSessionRequiresHTTPs(Request.Cookies["AnonID"], HttpContext.Current.Request.IsLocal) == true) {

                if (HttpContext.Current.Request.IsSecureConnection == false && HttpContext.Current.Request.IsLocal == false) {
                    Response.Redirect("https://" + MGLApplicationInterface.Instance().ConfigDefault.WebProjectPath(false) + HttpContext.Current.Request.RawUrl);
                }
            }

        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Application_EndRequest(Object sender, EventArgs e) {

            // add an application counter in here - flag if more than 1000, 2000, 5000 etc in an hour
            // reset on the first request of that hour
            MGLApplicationInterface.Instance().AppMonitor.Increment();

            bool doEmail = false;
            string usageLevel = "";

            if (MGLApplicationInterface.Instance().AppMonitor.TotalPageRequests % 1000 == 0) {

                // 22-Apr-2016 - As the PNA tool is being nicely hammered, lets only report when we reach 2000 hits in an hour
                if (MGLApplicationInterface.Instance().AppMonitor.TotalPageRequests >= 2000) {
                    doEmail = true;
                    usageLevel = "High usage - " + MGLApplicationInterface.Instance().AppMonitor.TotalPageRequests.ToString("N0");
                }
            }

            if (doEmail == true) {

                // get a list of all the admin users
                List<SecureString> aUserEmails = MGLApplicationSecurityInterface.Instance().GetEmailsInGroup("Admin");

                string httpPrefix = (MGLApplicationSecurityInterface.Instance().AppLoginConfig.UseHTTPS == true) ? "https" : "http";
                string aLink = "<b><a href='" + httpPrefix + "://" + Authorisation.ApplicationURL + "'>" + Authorisation.ApplicationURL + "</a></b>";

                int tzOffsetVal = 0;
                LocaliseTime.GetTimezoneOffset(MGLApplicationInterface.Instance().ConfigDefault, 2, 0, out tzOffsetVal);
                string prettyDateFrom = LocaliseTime.Localise(tzOffsetVal, MGLApplicationInterface.Instance().AppMonitor.TimeStamp);
                string prettyDateTo = LocaliseTime.Localise(tzOffsetVal, DateTime.Now);

                // cycle through and send these emails!
                foreach (SecureString aUserEmail in aUserEmails) {
                    MGLSecureEmailer.SendEmail(
                        SecureStringWrapper.Decrypt(aUserEmail),
                        SecureStringWrapper.Decrypt(aUserEmail),
                        MGLApplicationInterface.Instance().ApplicationName + " - " + usageLevel,
                        "<p style='font-family: Trebuchet MS;'>"
                        + "Hello<br />High usage of " + MGLApplicationInterface.Instance().AppMonitor.TotalPageRequests.ToString("N0")
                        + " page requests reported from " + aLink + " in the last hour between "
                        + prettyDateFrom //DateTimeInformation.PrettyDateTimeFormat(MGLApplicationInterface.Instance().AppMonitor.TimeStamp, 0)
                        + " and " + prettyDateTo //  DateTimeInformation.PrettyDateTimeFormat(DateTime.Now, 0)
                        + "<br />Please keep an eye on it"
                        + "<br /><br /></p>",
                        "", null, null, null, null, 0, MGLSecureEmailer.EnableSSL);
                }
            }
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Application_AuthenticateRequest(Object sender, EventArgs e) {

        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Application_Error(Object sender, EventArgs e) {

            // 19-Jul-2015 - Get the error details when pages crash etc ...
            HttpException lastErrorWrapper = Server.GetLastError() as HttpException;

            if (lastErrorWrapper != null) {

                Exception lastError = lastErrorWrapper;
                if (lastErrorWrapper.InnerException != null) {
                    lastError = lastErrorWrapper.InnerException;
                }

                string lastErrorTypeName = lastError.GetType().ToString();
                string lastErrorMessage = lastError.Message;
                string lastErrorStackTrace = lastError.StackTrace;

                string currentPageOrResource = HttpContext.Current.Request.Url.ToString();

                // 5-Feb-2016 - getting a few errors with "This is an invalid webresource request".
                // According to this dude - http://www.telerik.com/blogs/debugging-asp-net-2-0-web-resources-decrypting-the-url-and-getting-the-resource-name
                // this could be due to dodgy requests and you can decrypte the d attribute to find out the specific resource
                string decryptedResource = "";
                try {
                    if (currentPageOrResource != null && currentPageOrResource.Contains("WebResource.axd") == true) {

                        string dVal = currentPageOrResource.Split(new string[] { "WebResource.axd?d=" }, StringSplitOptions.None)[1];
                        dVal = dVal.Split(new string[] { "&" }, StringSplitOptions.None)[0];

                        byte[] encryptedData = HttpServerUtility.UrlTokenDecode(dVal);

                        Type machineKeySection = typeof(MachineKeySection);
                        Type[] paramTypes = new Type[] { typeof(bool), typeof(byte[]), typeof(byte[]), typeof(int), typeof(int) };
                        MethodInfo encryptOrDecryptData = machineKeySection.GetMethod("EncryptOrDecryptData", BindingFlags.Static | BindingFlags.NonPublic, null, paramTypes, null);

                        byte[] decryptedData = (byte[])encryptOrDecryptData.Invoke(null, new object[] { false, encryptedData, null, 0, encryptedData.Length });
                        decryptedResource = "(" + Encoding.UTF8.GetString(decryptedData) + ")";
                    }
                } catch (Exception exWebResource) {
                    // FUCK it ...
                    decryptedResource = "(Couldn't decrypt the provided URL: " + exWebResource.ToString() + ")";
                }

                string errorString = "Server response crashed: " + lastErrorTypeName
                    + "\n\nPage or resource:" + currentPageOrResource
                    + decryptedResource
                    + "\n\nDetails:" + lastErrorMessage
                    + "\n\nStackTrace:" + lastErrorStackTrace;

                Logger.LogError(6, errorString);
                MGLApplicationInterface.Instance().LastError = errorString.Replace("\n\n", "<br /><br />");
            }
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Session_End(Object sender, EventArgs e) {

            // 3-Jun-15 - lets try to keep the Key Info objects in memory as clean as possible ...
            if (Session != null && Session.SessionID != null) {
                ExportFilesInfo.RemoveProcessingState(Session.SessionID);

                // A bit irrelevant in this site as it is 100% secure, but lets keep on top of it, otherwise it wont work properly (as the anonID cookie will persist, but the session ID does not)
                MGLApplicationInterface.Instance().RemoveSessionRequiringHTTPS(Session.SessionID);
            }

            // 7-Dec-2015 - Call UnlockCase just in case this user was editing cases before their session expired.
            // 7-Dec-2015 - if the case was locked by this user, then UNLOCK it
            // 11-Mar-2016 - Only use the user ID and unlock all cases that this user was involved with ... as they could have been editing more than one case at the same time ...
            int userID = 0;
            object uObj = Session["MGL_Current_User"];
            if (uObj != null) {

                int.TryParse(uObj.ToString(), out userID);

                if (userID > 0) {
                    CaseLocker.UnlockAllCasesForUser(userID);
                    // and lastly lets clean up the session before it disappers forever ...
                    Session["MGL_Current_User"] = null;
                }
            }

            /*
             *      16-Mar-2016 - Further optimisation of the page upload and download sizes to minimise the data transfer as much as we can
             *      To do this we are storing the viewstate on the server for specific pages (e.g. CaseSearch, CaseUpdate and IndividualUpdate)
             *      The viewstate is managed by this intermediate page wrapper.  And rather than have tons of files to clean up periodically
             *      Lets make an attempt to clear them up at the end of each Session and also at the end of the Application too
            */
            if (Session != null && Session.SessionID != null) {
                PagePersistViewStateToFileSystem.ClearAllViewStateFilesInSession(Session.SessionID);
            }
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Application_End(Object sender, EventArgs e) {

            /*
             *      16-Mar-2016 - Further optimisation of the page upload and download sizes to minimise the data transfer as much as we can
             *      To do this we are storing the viewstate on the server for specific pages (e.g. CaseSearch, CaseUpdate and IndividualUpdate)
             *      The viewstate is managed by this intermediate page wrapper.  And rather than have tons of files to clean up periodically
             *      Lets make an attempt to clear them up at the end of each Session and also at the end of the Application too
            */
            PagePersistViewStateToFileSystem.ClearAllViewStateFiles();

            // 10-Feb-2016 - As the application recycles periodically, lets write the log when the application ends (if there is anything at all to include)
            Logger.LogInfo("Application ended");
            Logger.Write(100);

            Application.RemoveAll();
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        private void LoadAppDefaults() {

            TimeSpan t1 = new TimeSpan(DateTime.Now.Ticks);

            //_____1_____ Set the Application Defaults
            {
                MGLApplicationInterface.Instance().ApplicationName = WebConfigurationManager.AppSettings["ApplicationName"];
                MGLApplicationInterface.Instance().ApplicationShortName = WebConfigurationManager.AppSettings["ApplicationShortName"];
                MGLApplicationInterface.Instance().ApplicationURL = WebConfigurationManager.AppSettings["ApplicationURL"];
                // Note that this is reset internally, but good to leave the ref here as a reminder that this deepest darkest code exists ...
                Authorisation.ApplicationName = MGLApplicationInterface.Instance().ApplicationName;

                double tempDouble = 0;
                double.TryParse(WebConfigurationManager.AppSettings["ApplicationVersion"], out tempDouble);
                KeyInfoExtended.SoftwareVersion = tempDouble;

                // 16-Mar-2016 - set the PersistentViewState subdirectory
                PagePersistViewStateToFileSystem.AppendSiteShortNameToFolderName(MGLApplicationInterface.Instance().ApplicationShortName);

                // 18-Mar-2016 - Get the JS Version ...
                MGLApplicationInterface.Instance().JSVersion = WebConfigurationManager.AppSettings["JSVersion"];


                // 22-Mar-2016 - extract the static resource settings.  These are used in HTMLUtilities.BuildStaticResourcesHTML to generate the resource references for static libraries like scripts and styles
                // Firstly, are the resources stored locally or pulled accross from another domain?
                MGLApplicationInterface.Instance().StaticResourcePath = WebConfigurationManager.AppSettings["StaticResourcePath"];
                // Secondly, is the Javascript in these resources minified
                bool tempBool = false;
                bool.TryParse(WebConfigurationManager.AppSettings["StaticJavascriptMinified"], out tempBool);
                MGLApplicationInterface.Instance().StaticJavascriptIsMinified = tempBool;


                // 29-Mar-2016 - explicitly turn on or off the removal of leading and trailing whitespace during the page rendering (this saves about 25% of the download size)
                bool.TryParse(WebConfigurationManager.AppSettings["RemoveWhitespaceFromAllPages"], out tempBool);
                MGLApplicationInterface.Instance().RemoveWhitespaceFromAllPages = tempBool;
            }

            //_____2_____ Start the Logging Activities
            Logger.StartLog(MGLApplicationInterface.Instance().ApplicationShortName, "c:/logs", false, true, true);


            //_____3a_____ Load the Configuration Information
            MglWebConfigurationInfo mwci = MglWebConfigurationInfo.GetConfig();
            MglWebConfigurationInfoParamsCollection mwcipc = mwci.ConfigInfoList;

            ConfigurationInfo ci = new ConfigurationInfo();
            bool success = ci.LoadConfigurationInfoFromWebConfig();

            // 30-Sep-2015 - Get the username and password from the XML config file ...
            {
                SecureString key = null;
                SecureString auth = null;
                if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "DatabaseLogin", out key, out auth) == true) {
                    DatabaseConnectionInfo dbConInfo = ci.DbConInfo;
                    dbConInfo.USER = key;
                    dbConInfo.PASSWORD = auth;
                    ci.DbConInfo = dbConInfo;
                }
            }
            // 30-Sep-2015 - Get the SSL Certificate and Password from the XML config file ...
            {
                SecureString key = null;
                SecureString auth = null;
                if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "DatabaseCertificate", out key, out auth) == true) {
                    DatabaseConnectionInfo dbConInfo = ci.DbConInfo;
                    dbConInfo.SSLCertificatePath = key;
                    dbConInfo.SSLCertificatePassword = auth;
                    ci.DbConInfo = dbConInfo;
                }
            }

            MGL.Web.WebUtilities.MGLApplicationInterface.Instance().ConfigDefault = ci;
            // Test the database connection string ....
            DatabaseWrapper dbInfo = new DatabaseWrapper(ci);
            dbInfo.Connect();

            //_____ 1-Dec-2015 - Get the GeoLocation database XML config file settings ...
            {
                // The clone method works, we just need to be aware that really robust passwords with special characters don't work fantastically with the mySQL connector
                ConfigurationInfo ciGeoLocation = ci.Clone();
                DatabaseConnectionInfo dbConInfo = ciGeoLocation.DbConInfo;

                SecureString key = null;
                SecureString auth = null;
                if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "DatabaseLoginGeoLocation", out key, out auth) == true) {
                    dbConInfo.USER = key;
                    dbConInfo.PASSWORD = auth;
                    dbConInfo.NAME = "DataNirvana_GeoLocation";
                }

                ciGeoLocation.DbConInfo = dbConInfo;
                MGLApplicationInterface.Instance().GeoLocationConfig = ciGeoLocation;
            }


            //_____3b_____ Set up the physical application path ONCE ....
            if (MGLApplicationInterface.Instance().ConfigDefault != null
                && MGLApplicationInterface.Instance().PhysicalPathToApplicationRoot == null) {

                // 14-Oct-2013 - Changed this to use app domain - that seems to be a better usage of the process and it also means that we can put it in the global.asax
                string physicalPath = AppDomain.CurrentDomain.BaseDirectory.ToString();
                physicalPath = physicalPath.Replace("\\", "/");

                MGLApplicationInterface.Instance().PhysicalPathToApplicationRoot = physicalPath;
            }


            //_____4a_____ Setup the default email settings ...
            SetupDefaultEmail();

            //_____4b_____ Setup the default cryptography stuff ...
            // The temporary application encryption key (e.g. for the search tables ...)
            {
                MGLApplicationInterface.Instance().EncryptionAppKey = MGLEncryption.GenerateKey();
            }

            // 5-Jul-15 - Set the MGLEncryption Key from the web config ...
            {
                SecureString key = null;
                SecureString auth = null;
                if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "EncryptKeyDefault", out key, out auth) == true) {
                    MGLEncryption.SetCryptKey = key;
                }
            }


            //_____5a_____ Application Specific Setup - Setup all the countries, application variables for Organisations, Indicators and Sectors
            DataNirvanaWebProcessing wpHA = new DataNirvanaWebProcessing(MGLApplicationInterface.Instance().ConfigDefault);
            // Uncomment when the database is setup ....
            //            success = success & wp.SetAllIndicators();
            //            success = success & wp.SetAllSectors();
            success = success & wpHA.SetAllOrganisations(true);
            //            success = success & wp.SetAllActivityStates();
            //            success = success & wp.SetAllCountries();
            //            success = success & wp.SetSpatialReferenceDefault();

            WebDocProcessing wdp = new WebDocProcessing(MGLApplicationInterface.Instance().ConfigDefault);
            KeyInfo.Tags = wdp.GetAllWebDocTags();


            //_____5b_____ Application Specific Setup - Set the ProGres Application key ...

            // 5-Jul-15 - Set the ProgresTokens (Public and Private)
            //{
            //    SecureString key = null;
            //    SecureString auth = null;
            //    if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "EncryptKeyProGresPrivate", out key, out auth) == true) {
            //        PNAApplicationInterface.Instance().ProGresEncryptionTokenPrivate = key;
            //    }
            //}
            //{
            //    SecureString key = null;
            //    SecureString auth = null;
            //    if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "EncryptKeyProGresPublic", out key, out auth) == true) {
            //        PNAApplicationInterface.Instance().ProGresEncryptionTokenPublic = key;
            //    }
            //}


            //_____5c_____ Application Specific Setup -  Setup all the lookup lists
            //PNACaseWebProcessing pnaCaseWP = new PNACaseWebProcessing(MGLApplicationInterface.Instance().ConfigDefault);

            bool tempSuccess = false;

            // ListOfPNACaseStatuses
            //PNAApplicationInterface.Instance().ListOfPNACaseStatuses = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfPNACaseStatuses, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfPNAIndividualStatuses
            //PNAApplicationInterface.Instance().ListOfPNAIndividualStatuses = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfPNAIndividualStatuses, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfPNAPriorities - added -15-Dec-2015
            //PNAApplicationInterface.Instance().ListOfPNAPriorities = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfPNAPriorities, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfUNHCROffices
            //PNAApplicationInterface.Instance().ListOfUNHCROffices = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfUNHCROffices, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfAlreadyRegistered
            //PNAApplicationInterface.Instance().ListOfAlreadyRegistered = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfAlreadyRegistered, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfTravelledBefore
            //PNAApplicationInterface.Instance().ListOfTravelledBefore = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfTravelledBefore, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfHasPoRCard
            //PNAApplicationInterface.Instance().ListOfHasPoRCard = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfHasPoRCard, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfReligion
            //PNAApplicationInterface.Instance().ListOfReligion = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfReligion, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfLanguage
            //PNAApplicationInterface.Instance().ListOfLanguage = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfLanguage, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfEthnicity
            //PNAApplicationInterface.Instance().ListOfEthnicity = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfEthnicity, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfDocumentaryProof
            //PNAApplicationInterface.Instance().ListOfDocumentaryProof = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfDocumentaryProof, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfCountries
            //PNAApplicationInterface.Instance().ListOfCountries = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfCountries, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfCoACountries - a rather shortened affair ...
            //PNAApplicationInterface.Instance().ListOfCoACountries = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfCoACountries, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfNationalities
            //PNAApplicationInterface.Instance().ListOfNationalities = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfNationalities, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfYesNo
            //PNAApplicationInterface.Instance().ListYesNo = pnaCaseWP.SetupListGeneric(KeyInfo.ListYesNo, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfSex
            //PNAApplicationInterface.Instance().ListOfSex = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfSex, out tempSuccess, true);
            success = success & tempSuccess;

            // ListOfMaritalStatusesPNA
            //PNAApplicationInterface.Instance().ListMaritalStatus = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfMaritalStatusesPNA, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfRelationshipToHoH
            //PNAApplicationInterface.Instance().ListOfRelationshipToHoH = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfRelationshipToHoH, out tempSuccess, true);
            success = success & tempSuccess;

            // ListOfEducationLevels
            //PNAApplicationInterface.Instance().ListOfEducationLevels = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfEducationLevels, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfEducationDegreeTypes
            //PNAApplicationInterface.Instance().ListOfEducationDegreeTypes = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfEducationQualificationTypes, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfOccupations
            //PNAApplicationInterface.Instance().ListOfOccupations = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfOccupations, out tempSuccess, true);
            success = success & tempSuccess;

            // ListOfWillingToReturn
            //PNAApplicationInterface.Instance().ListOfWillingToReturn = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfWillingToReturn, out tempSuccess, true);
            success = success & tempSuccess;

            // ListOfAddressLocationTypes
            //PNAApplicationInterface.Instance().ListOfAddressLocationTypes = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfAddressLocationTypes, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfAddressTypes
            //PNAApplicationInterface.Instance().ListOfAddressTypes = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfAddressTypes, out tempSuccess, true);
            success = success & tempSuccess;

            // ListOfPNAReferralRecommendations - added 16-Dec-2015
            //PNAApplicationInterface.Instance().ListOfPNAReferralRecommendations = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfPNAReferralRecommendations, out tempSuccess, true);
            success = success & tempSuccess;
            // ListOfPNANonReferralReasons - added 16-Dec-2015
            //PNAApplicationInterface.Instance().ListOfPNANonReferralReasons = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfPNANonReferralReasons, out tempSuccess, true);
            success = success & tempSuccess;



            //_____ Set up the Geographies
            // For the PNA tool, we cannot use the lists of geographies that EVERYONE ELSE IN THE ENTIRE WORLD USES, so we need to use the old ones from ProGres to be consistent
            // In this ancient list from ProGres, FATA and KP are equivalent to NWFP!!!!

            // CoO Province
            //PNAApplicationInterface.Instance().ListOfCoOProvinces = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfCoOProvinces, out tempSuccess, true);
            success = success & tempSuccess;
            // CoO District
            //PNAApplicationInterface.Instance().ListOfCoODistricts = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfCoODistricts, out tempSuccess, true);
            success = success & tempSuccess;
            // CoA Province
            //PNAApplicationInterface.Instance().ListOfCoAProvinces = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfCoAProvinces, out tempSuccess, true);
            success = success & tempSuccess;
            // CoA District
            //PNAApplicationInterface.Instance().ListOfCoADistricts = pnaCaseWP.SetupListGeneric(KeyInfo.ListOfCoADistricts, out tempSuccess, true);
            success = success & tempSuccess;



            //_____6_____ Configure the Security ...
            MGL.Security.SecuritySetup.Configure(true, MGLApplicationInterface.Instance().ApplicationName, MGLApplicationInterface.Instance().ApplicationURL, ci.Clone());
            // 25-Jan-2015 - also store the list of Users in the KeyInfo static class so that they are accessible to other threads that cannot access application variables
            // Also wipe the passwords from the objects as these are irrelevant (and weak security) ....
            // note that wiping the passwords in this way (essentially by the linked "by reference" objects" means that the passwords are wiped from both the online repositories ...
            KeyInfo.AllUsers = new Dictionary<int, MGUser>();
            foreach (int key in MGLApplicationSecurityInterface.Instance().Users.Keys) {

                MGUser u;
                MGLApplicationSecurityInterface.Instance().Users.TryGetValue(key, out u);
                u.Password = null;
                KeyInfo.AllUsers.Add(key, u);
            }
            // now reset the original application interface with the users without passwords ...
            MGLApplicationSecurityInterface.Instance().Users = KeyInfo.AllUsers;



            //_____7_____ Application Specific Setup -

            // Make the default root an absolute path so that if links are called in e.g. Ajax pages then they will work ...
            HTMLUtilities.DefaultPath = ((MGLApplicationSecurityInterface.Instance().AppLoginConfig.UseHTTPS) ? "https://" : "http://") + ci.WebProjectPath();
            HTMLUtilities.ImageRootDirectory = "Images/";

            // 23-Dec-2015 - allows applications to use the https independently in a specific session, even if it is turned off in the global applications settings (sourced from the web.config)
            MGLApplicationInterface.Instance().UseHttpsSessionsIndependently = true;


            //_____8_____ Log the application start in the db ....

            // Check whether the connection to the db is using SSL
            DatabaseWrapper dbInfo2 = new DatabaseWrapper(ci);
            string sslCipher, sslStartDate, sslEndDate, sslProtocol;
            bool isSSLConn = dbInfo2.IsSSLConnection(out sslCipher, out sslStartDate, out sslEndDate, out sslProtocol);

            // Calculate how long the start up took
            TimeSpan t2 = new TimeSpan(DateTime.Now.Ticks);
            TimeSpan diff = t2.Subtract(t1);

            // build the "url" with all the params ...
            string logURL = "Application_Start?AppIsSSL=" + MGLApplicationSecurityInterface.Instance().AppLoginConfig.UseHTTPS
                + "&DBIsSSL=" + isSSLConn + "&Protocol=" + sslProtocol + "&SSLCipher=" + sslCipher
                + "&SSLStart=" + sslStartDate + "&SSLEnd=" + sslEndDate;

            // 14-Jan-2016 - Get the IP Address
            // 31-Jan-2016 - But this doesn't work unfortunately in the context of the applcation start - produces an error "Request not available in this context"
            string srcIPAddress = "0.0.0.0";

            // Log the application start using a special user ID
            LoggerDB.LogPageRequestInDatabase(ci, MGLApplicationInterface.Instance().ApplicationName,
                "Application_Start", "Application_Start", logURL,
                DateTime.Now, diff.TotalMilliseconds, 1010101, srcIPAddress);

            // And send an email with that the application has started ...
            //            MGLSecureEmailer.SendEmail("scrase@unhcr.org", "Eddie", "Application Started - " + MGLApplicationInterface.Instance().ApplicationName,
            //                "Application " + MGLApplicationInterface.Instance().ApplicationName + " started at " + DateTime.Now.ToString(),
            //                "", null, null, null, null, 0, true);

        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        ///     9-Sep-2015 - Updated the Emails to use the signed emails that are generated in the MGLSecureEmail class.
        /// </summary>
        private void SetupDefaultEmail() {

            // 30-Sep-2015 - Get the email username and password from the XML config file ...
            {
                SecureString key = null;
                SecureString auth = null;
                if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "EmailLogin", out key, out auth) == true) {
                    MGLSecureEmailer.SMTPUsername = key;
                    MGLSecureEmailer.FromMailAddress = key;
                    MGLSecureEmailer.SMTPPassword = auth;
                }
            }

            // 30-Sep-2015 - Get the email from name and the digital certificate path ...
            {
                SecureString key = null;
                SecureString auth = null;
                if (MGLXMLReader.GetInfo(MGLApplicationInterface.Instance().ApplicationShortName, "EmailCertificate", out key, out auth) == true) {
                    MGLSecureEmailer.FromMailAddressName = key;
                    MGLSecureEmailer.DigitalSignatureFile = auth;
                }
            }

            MGLSecureEmailer.SMTPHost = WebConfigurationManager.AppSettings["SMTPHost"]; //"smtp.gmail.com";

            string smtpPortStr = WebConfigurationManager.AppSettings["SMTPPort"]; //  587 is TLS; // 465 is SSL (OOOOOLDDD);
            string enableSSLStr = WebConfigurationManager.AppSettings["EnableSSL"]; //  true / false
            string bodyIsHTMLStr = WebConfigurationManager.AppSettings["BodyIsHTML"]; //  true / false
            string ignoreIncorrectLoginsStr = WebConfigurationManager.AppSettings["IgnoreIncorrectLogins"]; //  true / false

            int tempInt = 0;
            bool tempBool = false;

            int.TryParse(smtpPortStr, out tempInt);
            MGLSecureEmailer.SMTPPort = tempInt;

            bool.TryParse(enableSSLStr, out tempBool);
            MGLSecureEmailer.EnableSSL = tempBool;

            bool.TryParse(bodyIsHTMLStr, out tempBool);
            MGLSecureEmailer.BodyIsHTML = tempBool;

            bool.TryParse(ignoreIncorrectLoginsStr, out tempBool);
            MGUser.IgnoreIncorrectLogins = false;

        }

    }
}
