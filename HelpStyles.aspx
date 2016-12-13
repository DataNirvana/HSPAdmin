<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="HelpStyles.aspx.cs" Inherits="GHSP.WebAdmin.HelpStyles" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HC" runat="server">
     <asp:placeholder ID="jsStuff" EnableViewState="false" runat="server"></asp:placeholder>
</asp:Content>
<asp:Content ID="BC1" runat="server" ContentPlaceHolderID="MC">

        <br />
    <div class="BodyInfoTextHeader HeaderBar"><h2>Help with stylesheets for data administrators</h2></div>
    <br />

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/Help" class="btn btn-primary btn-lg HeaderBtn">&laquo; Go back</a>
            </p>
        </div>
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/HelpDataAdmin" class="btn btn-primary btn-lg HeaderBtn">Data help &raquo;</a>
            </p>
        </div>      
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/HelpWebAdmin" class="btn btn-primary btn-lg HeaderBtn">Admin help &raquo;</a>
            </p>
        </div>
    </div>

    <%-- Overview --%>
    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Overview</div>
    <br />
    
    <p class="BodyInfoTextHelp">
        The document transfer approach is for the content to be created and edited offline in Word documents.  
        When creating or updating standards and resources, data administrators can choose to update the content of these documents.
        To do this, the latest version of the document should be uploaded to the relevant folder in the <i>GHSP Live Documents</i> Dropbox folder.
        Once your Dropbox has successfully syncronised, proceed to the add or update content page and choose the document you have edited.
    </p>
    <p class="BodyInfoTextHelp">
        The document conversion process will then run on the server.  This is achieved using the styles in the Word document to create the
        document hierarchy.  The <a href="/HelpStyles">full list of styles</a> are described on the next page.
    </p>
    <p class="BodyInfoTextHelp">
        A list of all the styles that are used in the conversion process are presented below, together with a brief description of each.
    </p>

    <%-- Style list --%>
    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;List of styles</div>
    <br />

    <div id="StyleList" runat="server"></div>


     <%-- More information --%>
    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Didn't find the answers you needed?</div>
    <br />
    
    <p class="BodyInfoTextHelp">
        If you're still stuck, please email your queries to <a href="mailto:datanirvanalimited@gmail.com">datanirvanalimited@gmail.com</a>.
        We'll get back to you as quickly as we can.
    </p>
    
    <br /><br /><br />
    <br /><br /><br /><br />




</asp:Content>