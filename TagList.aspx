<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="TagList.aspx.cs" Inherits="GHSP.WebAdmin.TagList"
     ClientIDMode="Static" %>

<%@ Register Src="~/Code/UserControls/CtlInfoSplash.ascx" TagPrefix="DN" TagName="CtlInfoSplash" %>

<asp:Content ID="HC1" runat="server" ContentPlaceHolderID="HC">
    <asp:PlaceHolder ID="JS" EnableViewState="false" runat="server" />
    <script type="text/javascript">
        //--
        function DoSubmit(doValidation) {
            ShowLockButtonsModal();
            document.forms[0].submit();
        }
    </script>
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">

        <DN:CtlInfoSplash runat="server" ID="ctlInfoSplash" />

    <div class="BodyInfoTextHeader HeaderBar"><h2>Manage tags</h2></div>
    <br />

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/Default" id="GoBack" class="btn btn-primary btn-lg HeaderBtn" runat="server">&laquo; Home</a>
            </p>
        </div>
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="Search.aspx" class="btn btn-primary btn-lg HeaderBtn">Search &raquo;</a>
            </p>
        </div>      
    </div>
    <br />              

    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Quick guidance</div>

    <br />
    <p>All content, including standards, resources, news articles and training opportunities can be tagged with keywords.
        These tags are used to support the search and also to generate linkages between different documents.
        For standards and resources, specific tags can be applied to individual chapters.  
        For news articles and training opportunities, tags can be applied to the whole article.</p>

    <p>To add tags, first check that the tag you wish to add is not included in the list below.  If you are sure that the
         tag is not listed, then use the tool to add the tag below.
         Remember to double check for capitalisation and spaces after the end of the name.
    </p>
    <br />

    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Tag list</div>
    <br />
             <p>The list of tags currently used in the system are as follows:</p>
                
                <div id="TagFullList" runat="server"></div>
                
    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Add tag</div>
    <br />
     <p>
         Tag name:&nbsp;&nbsp;&nbsp;<input id="TBTag" type="text" class="TB" value="" runat="server" />
         &nbsp;&nbsp;&nbsp;&nbsp;<a href="javaScript: DoSubmit( true );" id="LinkAdd" class="btn btn-primary btn-lg HeaderBtn" runat="server">Add tag &raquo;</a>
         
      </p>

               


                <br /><br />
                <br /><br />

    <script type="text/javascript">
        $(document).ready(function($) {
            $("#TBTag").focus(function (event) {
                HideInfoSplash(1000);
            });
        });
    </script>
    
    <input id="DoDelete" type="hidden" value="" runat="server" />

</asp:Content>
