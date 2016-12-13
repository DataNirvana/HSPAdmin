using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.AspNet.Identity;
using MGL.DomainModel;
using MGL.Security;
using MGL.Data.DataUtilities;
using MGL.Web.WebUtilities;

namespace GHSP.WebAdmin
{
    public partial class SiteMaster : MasterPage
    {
        //private const string AntiXsrfTokenKey = "__AntiXsrfToken";
        //private const string AntiXsrfUserNameKey = "__AntiXsrfUserName";
        //private string _antiXsrfTokenValue;

        protected void Page_Init(object sender, EventArgs e)
        {
            //-----a----- 16-Mar-2016 - By default the ID of the master page is ctl00 and it is prefixed to all sub controls.  Shortening this id
            // therefore saves a few bytes downloaded on the larger pages ...
            ID = "E";

            //-----b----- Do the basepage oninit as soon as possible
            //base.OnInit(e);

            //-----d----- Use the MapPath widget to get the PhysicalPathOfTheApplication ONCE ....
            if (MGLApplicationInterface.Instance().ConfigDefault != null
                && MGLApplicationInterface.Instance().PhysicalPathToApplicationRoot == null) {

                string physicalPath = Request.PhysicalApplicationPath.Replace("\\", "/");

                MGLApplicationInterface.Instance().PhysicalPathToApplicationRoot = physicalPath;
            }

            //-----e----- Update the Login Panel
            UpdateLoginPanel();


            // The code below helps to protect against XSRF attacks
            //var requestCookie = Request.Cookies[AntiXsrfTokenKey];
            //Guid requestCookieGuidValue;
            //if (requestCookie != null && Guid.TryParse(requestCookie.Value, out requestCookieGuidValue))
            //{
            //    // Use the Anti-XSRF token from the cookie
            //    _antiXsrfTokenValue = requestCookie.Value;
            //    Page.ViewStateUserKey = _antiXsrfTokenValue;
            //}
            //else
            //{
            //    // Generate a new Anti-XSRF token and save to the cookie
            //    _antiXsrfTokenValue = Guid.NewGuid().ToString("N");
            //    Page.ViewStateUserKey = _antiXsrfTokenValue;

            //    var responseCookie = new HttpCookie(AntiXsrfTokenKey)
            //    {
            //        HttpOnly = true,
            //        Value = _antiXsrfTokenValue
            //    };
            //    if (FormsAuthentication.RequireSSL && Request.IsSecureConnection)
            //    {
            //        responseCookie.Secure = true;
            //    }
            //    Response.Cookies.Set(responseCookie);
            //}

            Page.PreLoad += master_Page_PreLoad;
        }

        protected void master_Page_PreLoad(object sender, EventArgs e)
        {
            //if (!IsPostBack)
            //{
            //    // Set Anti-XSRF token
            //    ViewState[AntiXsrfTokenKey] = Page.ViewStateUserKey;
            //    ViewState[AntiXsrfUserNameKey] = Context.User.Identity.Name ?? String.Empty;
            //}
            //else
            //{
            //    // Validate the Anti-XSRF token
            //    if ((string)ViewState[AntiXsrfTokenKey] != _antiXsrfTokenValue
            //        || (string)ViewState[AntiXsrfUserNameKey] != (Context.User.Identity.Name ?? String.Empty))
            //    {
            //        throw new InvalidOperationException("Validation of Anti-XSRF token failed.");
            //    }
            //}

        }

        protected void Page_Load(object sender, EventArgs e)
        {

            //     <asp:placeholder ID="JS" EnableViewState="false" runat="server"></asp:placeholder>
            //            string jsStr = "<script type=\"text/javascript\">InfoSplashWrapperID='';</script>";
            //            JS.Controls.Add(new LiteralControl(jsStr));


        }




        protected void Unnamed_LoggingOut(object sender, LoginCancelEventArgs e)
        {
            Context.GetOwinContext().Authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void UpdateLoginPanel() {

            bool isLoggedIn = Authorisation.DoIsLoggedIn();

            if (isLoggedIn) {

                MGUser currentUser = Authorisation.CurrentUser;
                // 22-Mar-2016 - The ResolveClientURL is now actioned in the preRender event in the MGLink itself, so no need to replicate here ...
                // We are now using relative links to make everything a bit shorter ...
                HL.HRef = "~/Code/Security/UserSplashPage.aspx";
                HL.InnerText = SecureStringWrapper.Decrypt(currentUser.Username).ToString();
                HL.Title = "Update my details";

                //HLT.InnerHtml = "<a href='" + Page.ResolveClientUrl("~/Code/Security/Logout.aspx") + "' title='Logout of the site'>Logout</a>";
                HLT.HRef = "~/Code/Security/Logout.aspx";
                HLT.InnerText = "Log out";
                HLT.Title = "Log out of the site";

            } else {

                HL.HRef = "~/Code/Security/Login.aspx";
                HL.InnerText = "Login";

                HLT.InnerHtml = "";
                HLT.Visible = false;
            }
        }


    }

}