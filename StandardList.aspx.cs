using DataNirvana.Config;
using DataNirvana.Document;
using DataNirvana.DomainModel.Document;
using MGL.DomainModel;
using MGL.Web.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
namespace GHSP.WebAdmin {
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    public partial class StandardList : MGLBasePage {

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {
            Functionality = "ViewData";
            IsSecurePage = true;
            RequireRedirectOnSessionEnd = true;
            MgPageType = MGPageType.ASPX;

            // 31-Dec-2015 - Always call the basePage before doing custom init activities so that we can verify that the session is still live before doing custom stuff
            base.OnInit(e);
        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Page_Load(object sender, EventArgs e) {

            // Set the tokens for the news articles versus training opportunities ...
            //string contentName = WebDocType.Standard.ToString();
            //ContentName1.InnerText = contentName;


        }


    }
}