using MGL.DomainModel;
using MGL.Web.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
namespace GHSP.WebAdmin {
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------
    public partial class Search : MGLBasePage {

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "ViewData";
            IsSecurePage = true;
            RequireRedirectOnSessionEnd = true;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Page_Load(object sender, EventArgs e) {

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

    }
}