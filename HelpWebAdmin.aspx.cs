using MGL.DomainModel;
using MGL.Web.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GHSP.WebAdmin {
    public partial class HelpWebAdmin : MGLBasePage {

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "Analysis";
            IsSecurePage = false;
            RequireRedirectOnSessionEnd = false;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }


        protected void Page_Load(object sender, EventArgs e) {

        }
    }
}