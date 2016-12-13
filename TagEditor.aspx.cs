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
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
namespace GHSP.WebAdmin {
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    public partial class TagEditor : MGLBasePage {

        int wdID = 0;

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected override void OnInit(EventArgs e) {

            Functionality = "EditData";
            IsSecurePage = true;
            RequireRedirectOnSessionEnd = true;
            MgPageType = MGPageType.ASPX;

            base.OnInit(e);

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void Page_Load(object sender, EventArgs e) {

            // Get the ID and the Language and extract the working title from the database
            string wdIDStr = Request.Params.Get("DocID");
            int.TryParse(wdIDStr, out wdID);

            WebDocProcessing wdp = new WebDocProcessing(MGLSessionInterface.Instance().Config);
            WebDoc wd = new WebDoc(wdID);
            wdp.GetWebDoc(wd);
            wdp.GetWebDocChapters(wd);

            wdp.GetWebDocTagXRefs(wd);

            WDSelectedID.InnerHtml = wd.ID.ToString();
            WDWorkingTitle.InnerHtml = wd.DescriptionInternal;

            // OK - lets now standardise the metadata we store in the page for the TagEditor with the BlogEditor and DocumentEditor...
            DocID.Value = wd.ID.ToString();
            DocType.Value = ((int)wd.DocumentType).ToString();


            // OK - so now we want to build a dynamic listing of the chapters
            BuildChapterTagWidget(wd);


        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected void BuildChapterTagWidget(WebDoc wd) {

            /*  This is the kind of thing we are trying to recreate
            <div class="row BB">
                <div class="col-md-3">
                    <div class="Marg">
                        <b>a.2</b> - Choose languages:
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="TBRowPadding">
                        <asp:listbox id="TBLanguage" data-placeholder="Choose languages" CssClass="chosen-select TBDDL" SelectionMode="Multiple" runat="server"></asp:listbox>
                        <select size="4" name="E$MC$DocumentEditor$TBLanguage" multiple="multiple" id="TBLanguage" class="chosen-select TBDDL" data-placeholder="Choose languages">
                    </div>
                </div>      
            </div>      
            */

            List<int> chapterIDs = new List<int>();

            HtmlGenericControl container = new HtmlGenericControl("div");

            if ( wd.DocumentChapters == null || wd.DocumentChapters.Count == 0) {

                // Show a generic warning message ...
                container.InnerHtml = 
                    "<span class='InfoFailure'>There are currently no chapters saved for this document.</span>  "
                    +"To create the list of chapters, go back to the edit document page and choose <i>add content</i> for one of the document language versions(preferably the English version).  "
                    +"Once this has been successfully achieved, return to this page and the full list of chapters will be displayed.  You can then add the relevant tags to each chapter.";

                ctlInfoSplash.SetupInfoSplash(false, "There are currently no chapters saved for this document!", false);

            } else {

                foreach (WebDocChapter wdc in wd.DocumentChapters) {
                    string altCSS = (wdc.ChapterNumber % 2 == 0) ? "BA" : "BB";

                    chapterIDs.Add(wdc.ID);

                    HtmlGenericControl row = new HtmlGenericControl("div");
                    row.Attributes.Add("class", "row " + altCSS);

                    HtmlGenericControl cell1 = new HtmlGenericControl("div");
                    cell1.Attributes.Add("class", "col-md-6");
                    cell1.InnerHtml = "<b>" + wdc.ChapterNumber + ".</b> " + wdc.ChapterTitle;
                    row.Controls.Add(cell1);

                    HtmlGenericControl cell2 = new HtmlGenericControl("div");
                    cell2.Attributes.Add("class", "col-md-5 TBRowPadding");

                    HtmlSelect select = new HtmlSelect();
                    //ListBox lb = new ListBox();
                    // Ok 7-Nov-16 - change of heart here - we are going to use the ChapterNumber (1,2,3 etc) instead of the ID (4,000,000) etc as this makes it easier to build the BlogEditor page
                    // dynamically, which is the only other place where the tags are referenced (currently)
                    // client side stuff then just needs to use the incremental numbers instead...
                    select.ID = "TB_ChapTags_" + wdc.ChapterNumber;
                    select.Size = 4;
                    select.Attributes.Add("class", "chosen-select TBDDL");
                    select.Attributes.Add("data-placeholder", "Choose languages");
                    select.Attributes.Add("multiple", "multiple");

                    List<ListItem> list = new List<ListItem>();
                    //lis.Add(new ListItem("Please choose", ""));

                    foreach (WebDocTag wdtGlobal in KeyInfo.Tags) {
                        ListItem li = new ListItem(wdtGlobal.Name, wdtGlobal.ID.ToString());
                        list.Add(li);
                    }

                    select.DataSource = list;
                    select.DataTextField = "Text";
                    select.DataValueField = "Value";
                    select.DataBind();

                    // Now see if they are selected or not ...
                    foreach (WebDocTag wdtInDoc in wd.DocumentTags) {
                        if (wdtInDoc.ChapterID == wdc.ID) {
                            ListItem selectedLi = select.Items.FindByValue(wdtInDoc.ID.ToString());
                            selectedLi.Selected = true;
                        }
                    }


                    cell2.Controls.Add(select);
                    row.Controls.Add(cell2);

                    container.Controls.Add(row);
                }
            }

            // And lastly, lets add the list of chapter IDs as the JS array - we will need this when saving the content
            //container.Controls.Add(new LiteralControl("<script type='text/javascript'>var webDocID="+wd.ID+"; var webDocType="
            //+((int)wd.DocumentType)+"; var chapterIDList=["+DataUtilities.GetCSVList(chapterIDs)+ "];</script>"));

            container.Controls.Add(new LiteralControl("<script type='text/javascript'>var chapterIDList=[" + DataUtilities.GetCSVList(chapterIDs) + "];</script>"));

            WDChapterTagWidget.InnerHtml = HTMLUtilities.RenderControlToHtml(container);
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
 