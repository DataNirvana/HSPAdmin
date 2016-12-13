<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" 
    CodeBehind="TagEditor.aspx.cs" Inherits="GHSP.WebAdmin.TagEditor" ClientIDMode="Static" %>

<%@ Register Src="~/Code/UserControls/CtlInfoSplash.ascx" TagPrefix="DN" TagName="CtlInfoSplash" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">    
    <asp:PlaceHolder ID="JS" EnableViewState="false" runat="server" />    
    <script src="/Content/Chosen/chosen.jquery.min.js"></script>
    <link rel="stylesheet" href="/Content/Chosen/chosen.css">
    <script type="text/javascript">
        DataContext = "DE";
        DoUnloadCheck = 0; // Start from the premise of there being no changes ...
        DoSaveDraft = true;

        //--
        $(document).ready(function () {
            AnimateTagFields();
        });
    </script>


    <DN:CtlInfoSplash runat="server" ID="ctlInfoSplash" />

    <div class="BodyInfoTextHeader HeaderBar"><h2>Edit tags for document <span id="WDSelectedID" runat="server"></span>
        - <span id="WDWorkingTitle" runat="server"></span></h2></div>
    <br />

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="javascript:NavigateToAnotherPageStart('Editor');" id="GoBack" class="btn btn-primary btn-lg HeaderBtn" runat="server">&laquo; Go back</a>
            </p>
        </div>
        <div class="col-md-4">
            &nbsp;
        </div>      
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a id="Submit1" href="javascript:DoTagSave(false);" class="btn btn-primary btn-lg HeaderBtn">Save tags &raquo;</a>
            </p>
        </div>
    </div>


        <%-- Quick Guidance --%>
        <br />
        <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Quick guidance</div>
        <br />

        <p>All content, including standards, resources, news articles and training opportunities can be tagged with keywords.
            These tags are used to support the search and also to generate linkages between different documents.
            For standards and resources, specific tags can be applied to individual chapters.</p>
        <p>For each of the chapters listed below for this document, simply choose the relevant tags from the list next to it.  Once complete, click on <i>Save tags</i>.
            Note that you can save the current state of what you have created at any time.
        </p>
                <p>More detailed guidance is available in the <a href="/Help">help pages</a>.</p>


        <%-- 1. Tag list by chapter --%>
        <br />
        <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Manage tags for each chapter</div>
        <br />

        <div id="WDChapterTagWidget" runat="server"></div>
        <br />

        <div class="row">
            <div class="col-md-4">
                <p class="HeaderBtnWrapper">
                    <a id="Submit2" href="javascript:DoTagSave(false);" class="btn btn-primary btn-lg HeaderBtn">Save tags &raquo;</a>
                </p>
            </div>
        </div>


    <script type="text/javascript">
        var config = {
          '.chosen-select'           : {}
        }
        $(document).ready(function () {
            for (var selector in config) {
                $(selector).chosen(config[selector]);
            }
        });
    </script>

    <input id="DocID" type="hidden" value="0" runat="server" />
    <input id="DocType" type="hidden" value="0" runat="server" />

</asp:Content>
