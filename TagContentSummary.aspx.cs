using DataNirvana.Config;
using DataNirvana.Document;
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

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
namespace GHSP.WebAdmin {
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    public partial class TagContentSummary : MGLBasePage {

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "ViewData";
            IsSecurePage = true;
            RequireRedirectOnSessionEnd = true;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }


        //--------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Page_Load(object sender, EventArgs e) {

            string tagIDStr = Request.Params.Get("TagID");
            int tagID = 0;
            int.TryParse(tagIDStr, out tagID);

            TagSummary.InnerHtml = BuildTagSummary(tagID);

        }

        //--------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected string BuildTagSummary(int tagID) {

            KeyValuePair<int, string> kvp = KeyInfo.FindValue(WebDocTag.ConvertToKeyValuePair(KeyInfo.Tags), tagID);
            tagName.InnerHtml = kvp.Value;


            WebDocProcessing wdp = new WebDocProcessing(MGLSessionInterface.Instance().Config);
            // ok this is gonna be a custom query!!
            List<string[]> data = wdp.ContentLinkedToTag(tagID);
            
            HtmlGenericControl container = new HtmlGenericControl("div");

            if ( data == null || data.Count == 0) {
                container.InnerHtml = "No content is currently associated with the '"+kvp.Value+"' tag.";
            } else {
                int counter = 0;

                // The header row
                {
                    HtmlGenericControl hDivRow = new HtmlGenericControl("div");
                    hDivRow.Attributes.Add("class", "row");

                    HtmlGenericControl hCell1 = new HtmlGenericControl("div");
                    hCell1.Attributes.Add("class", "col-md-2");
                    hCell1.InnerHtml = "<h4>Document type</h4>";
                    hDivRow.Controls.Add(hCell1);

                    // Document ID
                    HtmlGenericControl hCell2 = new HtmlGenericControl("div");
                    hCell2.Attributes.Add("class", "col-md-2");
                    hCell2.InnerHtml = "<h4>Document ID</h4>";
                    hDivRow.Controls.Add(hCell2);

                    // Description
                    HtmlGenericControl hCell3 = new HtmlGenericControl("div");
                    hCell3.Attributes.Add("class", "col-md-4");
                    hCell3.InnerHtml = "<h4>Document description</h4>";
                    hDivRow.Controls.Add(hCell3);

                    // Chapter
                    HtmlGenericControl hCell4 = new HtmlGenericControl("div");
                    hCell4.Attributes.Add("class", "col-md-4");
                    hCell4.InnerHtml = "<h4>Chapter name</h4>";
                    hDivRow.Controls.Add(hCell4);

                    container.Controls.Add(hDivRow);
                }


                // a.ID, a.DocumentType, a.GeneralDescription, b.ChapterNumber, b.ChapterTitle
                foreach ( string[] row in data) {
                    string altCSS = (counter++ % 2 == 0) ? "BA" : "BB";

                    HtmlGenericControl divRow = new HtmlGenericControl("div");
                    divRow.Attributes.Add("class", "row " + altCSS);

                    // Document type
                    WebDocType webDocType = (WebDocType)Enum.Parse(typeof(WebDocType), row[1]);
                    HtmlGenericControl cell1 = new HtmlGenericControl("div");
                    cell1.Attributes.Add("class", "col-md-2");
                    cell1.InnerHtml = webDocType.ToString();
                    divRow.Controls.Add(cell1);

                    // Document ID
                    HtmlGenericControl cell2 = new HtmlGenericControl("div");
                    cell2.Attributes.Add("class", "col-md-2");
                    HtmlAnchor link = new HtmlAnchor();
                    link.InnerHtml = row[0];
                    link.HRef = "/"+ webDocType.ToString() + "Editor?DocID=" + row[0];
                    cell2.Controls.Add(link);
                    divRow.Controls.Add(cell2);

                    // Description
                    HtmlGenericControl cell3 = new HtmlGenericControl("div");
                    cell3.Attributes.Add("class", "col-md-4");
                    cell3.InnerHtml = row[2];
                    divRow.Controls.Add(cell3);

                    // Chapter
                    HtmlGenericControl cell4 = new HtmlGenericControl("div");
                    cell4.Attributes.Add("class", "col-md-4");
                    cell4.InnerHtml = "<b>" + row[3] + ".</b> " + row[4];
                    divRow.Controls.Add(cell4);

                    container.Controls.Add(divRow);
                }
            }
            
            string html = HTMLUtilities.RenderControlToHtml(container);
            return html;
        }

    }
}