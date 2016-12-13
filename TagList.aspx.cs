using DataNirvana.Config;
using DataNirvana.Document;
using DataNirvana.DomainModel.Document;
using MGL.Data.DataUtilities;
using MGL.DomainModel;
using MGL.Web.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GHSP.WebAdmin {
    public partial class TagList : MGLBasePage {

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "Administration";
            IsSecurePage = true;
            RequireRedirectOnSessionEnd = true;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Page_Load(object sender, EventArgs e) {
            // To avoid the problem of the same file being uploaded twice .... (with minor changes)...
            Response.Cache.SetCacheability(HttpCacheability.NoCache);

            if (Page.IsPostBack == false) {
                // Eaaaaasy
            } else {
                //_____ Lets try to get the add or delete the tag
                string errorMessage = "";
                bool success = false;

                if (string.IsNullOrEmpty(DoDelete.Value) == true) {
                    success = AddTag(TBTag.Value, out errorMessage);
                } else {
                    //_____ Delete the organisation
                    int tagToDelete = 0;
                    int.TryParse(DoDelete.Value, out tagToDelete);
                    success = DeleteTag(tagToDelete, out errorMessage);
                }

                ctlInfoSplash.SetupInfoSplash(success, errorMessage, false);
            }

            //_____ Always display all the organisations and refresh it even on postback to show the new organisation ...
            // 5-Oct-2015 - refactored to just use a KeyValuePair with the ID and name of each organisation for simplicity ...
            StringBuilder str = new StringBuilder();
            //str.Append("<ul>");
            str.Append("<table class=\"B0 BP\">");
            //foreach (Organisation org in KeyInfo.AllOrganisations) {
            int counter = 0;


            foreach (WebDocTag tag in KeyInfo.Tags) {

                string css = (counter++ % 2 == 0) ? "B1" : "B2";
                //str.Append("<li>" + org.OrganisationName + "</li>");
                //str.Append("<li>" + tag.Value + "</li>");
                str.Append("<tr class=\""+css+ "\"><td class=\"BPC1\"><h4>" + tag.Name + "</h4></td><td><a href=\"/TagContentSummary?TagID=" + tag.ID 
                    + "\" class=\"btn btn-default\">Show content &raquo;</a></td>");
                // primary btn-lg

                // 4-Dec-16 - Add the delete buttons ...
                str.Append("<td><a href=\"javascript:DoTagDeleteStart(" + tag.ID + ", " + DataUtilities.Quote(tag.Name) + ");"
                    + "\" class=\"btn btn-default HeaderBtnWarningNarrow\" style=\"color:#ffffff;\">Delete &raquo;</a></td>");
                
                str.Append("</tr>");

            }
            //str.Append("</ul>");
            str.Append("</table>");

            // now set the inner html of the list div ...
            TagFullList.InnerHtml = str.ToString();


        }


        //---------------------------------------------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        ///     Bind the search results object after all the sorting etc has taken place ...
        /// </summary>
        protected void Page_PreRender(object sender, EventArgs e) {

            StringBuilder jsStr = new StringBuilder();

            //_____ 22-Mar-2016 - Append the list of static resources
            jsStr.Append(HTMLUtilities.BuildStaticResourcesHTML(this.Page, new string[] { "Scripts/DataManipulation.js" }));

            JS.Controls.Add(new LiteralControl(jsStr.ToString()));

        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------
        protected bool AddTag(string tagName, out string errorMessage) {

            bool success = false;
            errorMessage = "";

            string tagTN = WebDocProcessing.dbTNWebDocTag;

            try {

                //___ Check it is not shit
                if (tagName == null || tagName == "" || tagName.Trim() == "") {
                    errorMessage = "No new tag was provided - please try again.";
                } else {

                    // clean it up a bit
                    tagName = tagName.Trim();
                    tagName = tagName.Replace("  ", " ");
                    tagName = tagName.Replace("  ", " ");
                    tagName = tagName.Replace("  ", " ");
                    tagName = tagName.Replace("  ", " ");
                    tagName = tagName.Replace("  ", " ");
                    tagName = tagName.Replace("  ", " ");
                    tagName = tagName.Replace("  ", " ");

                    //_____ See if it exists already
                    bool alreadyExists = false;
                    foreach( WebDocTag wdt in KeyInfo.Tags) {
                        if ( wdt.Name.Equals( tagName, StringComparison.CurrentCultureIgnoreCase) == true) {
                            alreadyExists = true;
                            break;
                        }
                    }

                    if (alreadyExists == true) {
                        errorMessage = "The tag name '" + tagName + "' already exists!  Please check the name and try again.";
                    } else {

                        // OK here lets setup the processing obj
                        WebDocProcessing wdp = new WebDocProcessing(MGLSessionInterface.Instance().Config);

                        //_____ So now then lets try to insert it ...
                        success = wdp.InsertWebDocTag(tagName);

                        //_____ Lastly, if added then we need to reset the global organisation variables ....
                        if (success == false) {
                            errorMessage = "Could not insert the new tag name '" + tagName + "'.  This should not normally happen - please inform a website administrator and provide them with a screenshot.";
                        } else {
                            int b4Count = KeyInfo.Tags.Count;

                            // then lastly - if this is successful - we need to refresh the global list of tags ...
                            lock (KeyInfo.Tags) {
                                KeyInfo.Tags = wdp.GetAllWebDocTags();
                            }

                            // Success is that the number of tags increments by one
                            success = ((b4Count + 1) == KeyInfo.Tags.Count);
                            if (success == false) {
                                errorMessage = "Could not update the website global variables after adding new tag '" + tagName
                                    + "'. This should not normally happen - please inform a website administrator and provide them with a screenshot.";
                            } else {
                                errorMessage = "The new tag '" + tagName + "' has been added successfully.";
                                //TBTag.Value = tagName;
                                TBTag.Value = "";
                                DoDelete.Value = "";
                            }
                        }
                    }
                }

            } catch (Exception ex) {

                ctlInfoSplash.SetupInfoSplash(false, "General error trying to add the tag.  Please try again.", false);
                Logger.LogError(7, "Error adding a new tag: " + ex.ToString());

            }


            return success;
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------
        protected bool DeleteTag(int tagID, out string errorMessage) {

            bool success = false;
            errorMessage = "";

            try {

                //___ Check it is not shit
                if (tagID <= 0) {
                    errorMessage = "No tag was selected.  Please try again.";
                } else {

                    string tagName = "";
                    foreach (WebDocTag wdt in KeyInfo.Tags) {
                        if (wdt.ID == tagID) {
                            tagName = wdt.Name;
                            break;
                        }
                    }
                    
                    // OK here lets setup the processing obj
                    WebDocProcessing wdp = new WebDocProcessing(MGLSessionInterface.Instance().Config);

                    //_____ So now then lets try to delete it ... and all the associated XRefs ...
                    success = wdp.DeleteWebDocTag(tagID);
                    
                    //_____ Lastly, if added then we need to reset the global organisation variables ....
                    if (success == false) {
                        errorMessage = "Could not delete the tag with ID " + tagID + ".  This should not normally happen - please inform a website administrator and provide them with a screenshot.";
                    } else {
                        int b4Count = KeyInfo.Tags.Count;

                        // then lastly - if this is successful - we need to refresh the global list of tags ...
                        lock (KeyInfo.Tags) {
                            KeyInfo.Tags = wdp.GetAllWebDocTags();
                        }

                        // Success is that the number of tags increments by one
                        success = ((b4Count - 1) == KeyInfo.Tags.Count);
                        if (success == false) {
                            errorMessage = "Could not update the website global variables after deleting the tag with ID " + tagID
                                + ". This should not normally happen - please inform a website administrator and provide them with a screenshot.";
                        } else {
                            errorMessage = "The tag '" + tagName + "' and all corresponding cross-references have been successfully deleted.";
                            TBTag.Value = "";
                            DoDelete.Value = "";
                        }


                    }
                }

            } catch (Exception ex) {

                ctlInfoSplash.SetupInfoSplash(false, "General error trying to delete the organisation.  Please try again.", false);
                Logger.LogError(7, "Error deleting the organisation: " + ex.ToString());

            }

            return success;
        }


    }
}