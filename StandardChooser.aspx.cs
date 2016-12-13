using GHSP.WebAdmin.Code.UserControls;
using MGL.DomainModel;
using MGL.Web.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

//------------------------------------------------------------------------------------------------------------------------------------------------------------
namespace GHSP.WebAdmin {
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    public partial class StandardChooser : MGLBasePage {

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "EditData";
            IsSecurePage = true;
            RequireRedirectOnSessionEnd = true;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }

        //------------------------------------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        ///     This looks a little clunky as all the hard work is done in the user control, but it is necessary as the User Controls are not yet able to be async!
        /// </summary>
        protected void Page_Load(object sender, EventArgs e) {
//            RegisterAsyncTask(new PageAsyncTask(BuildDropboxDocumentList));
//            RegisterAsyncTask(new PageAsyncTask(BuildDropboxFigureList));
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------------
//        public async Task BuildDropboxDocumentList() {
//            await documentChooser.BuildDropboxDocumentList();
//        }
        //------------------------------------------------------------------------------------------------------------------------------------------------------
//        public async Task BuildDropboxFigureList() {
//            await documentChooser.BuildDropboxFigureList();
//        }
    }
}