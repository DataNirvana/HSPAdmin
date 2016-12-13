using DataNirvana.Document;
using MGL.DomainModel;
using MGL.Security;
using MGL.Web.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GHSP.WebAdmin {
    public partial class _Default : MGLBasePage {

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "Base";
            IsSecurePage = false;
            RequireRedirectOnSessionEnd = false;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Page_Load(object sender, EventArgs e) {
            Testing.Visible = true;

            // Hide the main login button once the user has logged in, otherwise this might get a little confusing ...
            bool isLoggedIn = Authorisation.DoIsLoggedIn();
            if (isLoggedIn) {
                MainLoginButton.Visible = false;
            }

            //WebDocConversion.Test(MGLSessionInterface.Instance().Config);

            StringBuilder str = new StringBuilder();
            str.Append("<script type='text/javascript'>");

            // 18-Mar-2016 - Get the JS Version ...
            string jsVersionConfig = MGLApplicationInterface.Instance().JSVersion;
            str.Append("var jsVersionConfig=" + jsVersionConfig + ";");

            //-----a----- Display any warnings or confirmation messages to the user
            // Session timeout warning is the default (and most common) ...
            // 20-Apr-2016 - show a logout confirmation ...
            string showLogoutStr = Request.Params.Get("ShowLogout");
            if (string.IsNullOrEmpty(showLogoutStr) == false && showLogoutStr == "1") {
                ctlInfoSplash.SetupInfoSplash(true, "You have successfully logged out.", false);
                str.Append("window.setTimeout( 'HideInfoSplash();', 3000 );");
            } else {

                // 21-Apr-2016 - show a password reset message if any ...
                string showPasswordReset = Request.Params.Get("FromPasswordReset");
                if (string.IsNullOrEmpty(showPasswordReset) == false && showPasswordReset == "1") {
                    ctlInfoSplash.SetupInfoSplash(true, "Password reset successfully - You are now logged in.", false);
                    str.Append("window.setTimeout( 'HideInfoSplash();', 3000 );");

                } else if (MGLSessionInterface.Instance().SessionExpired == true) {
                    // Show the session expiry warning ...
                    // can we do something in here with the duration?

                    ctlInfoSplash.SetupInfoSplash(false, "Session expired - please log in again.", true);
                    str.Append("window.setTimeout( 'HideInfoSplash();', 3000 );");
                    MGLSessionInterface.Instance().SessionExpired = false;


                }
            }
            

            str.Append("</script>");
            jsStuff.Controls.Add(new LiteralControl(str.ToString()));



        }
    }
}