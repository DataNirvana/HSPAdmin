using DataNirvana.Config;
using DataNirvana.DomainModel.Document;
using MGL.DomainModel;
using MGL.Web.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
namespace GHSP.WebAdmin {
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    public partial class HelpStyles : MGLBasePage {

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "Analysis";
            IsSecurePage = false;
            RequireRedirectOnSessionEnd = false;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Page_Load(object sender, EventArgs e) {

            // Make this sexier ............. using HTML Rendering ....
            StyleList.InnerHtml = BuildStyleList();

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------
        protected string BuildStyleList() {

            HtmlGenericControl divContainer = new HtmlGenericControl("div");

            // The header row ...
            divContainer.Controls.Add(BuildStyleRow(true, "BCHeader", "Style name", "Importance", "Creates new section?", "Description"));

            // Then all the sub rows ...
            int counter = 0;
            foreach (WebDocStyle wds in KeyInfo.WebDocStyles) {

                string altClass = (counter++ % 2 == 0) ? "BCA" : "BCB";

                divContainer.Controls.Add(
                    BuildStyleRow(false, altClass, 
                        wds.Name, 
                        wds.Weight.ToString(), 
                        (wds.CreatesNewSection==true)?"Yes":"No",
                        wds.Description));

            }

            return HTMLUtilities.RenderControlToHtml(divContainer);
        }


        //-------------------------------------------------------------------------------------------------------------------------------------------------------
        protected HtmlGenericControl BuildStyleRow(bool isHeaderRow, string additionalRowStyle, string cell1Content, string cell2Content, string cell3Content, string cell4Content) {

            // row is needed for the bootstrap stuff to fire
            string rowStyle = "row";
            if ( string.IsNullOrEmpty(additionalRowStyle) == false) {
                rowStyle = rowStyle + " " + additionalRowStyle;
            }

            HtmlGenericControl divRow = new HtmlGenericControl("div");
            divRow.Attributes.Add("class", rowStyle);

            HtmlGenericControl divCell1 = new HtmlGenericControl("div");
            divCell1.Attributes.Add("class", "col-md-2");
            if ( isHeaderRow == false) {
                HtmlGenericControl divCell1Content = new HtmlGenericControl("h4");
                divCell1Content.InnerHtml = cell1Content;
                divCell1.Controls.Add(divCell1Content);
            } else {
                divCell1.InnerHtml = cell1Content;
            }
            divRow.Controls.Add(divCell1);

            HtmlGenericControl divCell2 = new HtmlGenericControl("div");
            divCell2.Attributes.Add("class", "col-md-1");
            divCell2.InnerHtml = cell2Content;
            divRow.Controls.Add(divCell2);

            HtmlGenericControl divCell3 = new HtmlGenericControl("div");
            divCell3.Attributes.Add("class", "col-md-2");
            divCell3.InnerHtml = cell3Content;
            divRow.Controls.Add(divCell3);

            HtmlGenericControl divCell4 = new HtmlGenericControl("div");
            divCell4.Attributes.Add("class", "col-md-7");
            divCell4.InnerHtml = cell4Content;
            divRow.Controls.Add(divCell4);

            return divRow;
        }

    }
}