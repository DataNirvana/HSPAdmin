<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="GHSP.WebAdmin._Default" %>

<%@ Register Src="~/Code/UserControls/CtlInfoSplash.ascx" TagPrefix="DN" TagName="CtlInfoSplash" %>

<asp:Content ID="HC1" runat="server" ContentPlaceHolderID="HC">
    <asp:placeholder ID="jsStuff" EnableViewState="false" runat="server"></asp:placeholder>
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MC" runat="server">

    <DN:CtlInfoSplash id="ctlInfoSplash" runat="server"></DN:CtlInfoSplash>

    <div class="jumbotron">
        <h1>HUMANITARIAN STANDARDS PARTNERSHIP APP</h1>
        <p class="lead">Welcome to the Humanitarian Standards Partnership App administration tool.  
            Here you can administer the Humanitarian Charter, Protection Principles, CHS and technical standards as well as guidance, tools and news.</p>
        <p><a id="MainLoginButton" href="/code/security/login.aspx" class="btn btn-primary btn-lg" runat="server">Log in &raquo;</a></p>
    </div>

    <div id="Testing" runat="server"></div>

    <div class="row">
        <div class="col-md-4">
            <h2>Standards</h2>
            <p>
                Add, edit and delete humanitarian standards documents.
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="StandardList.aspx">Manage standards &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Resources</h2>
            <p>
                Add, edit and delete resources, such as case studies, guidance documents and tools.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="ResourceList.aspx">Manage resources &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Tags</h2>
            <p>
                Tag content with keywords to create linkages between sections of documents.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="TagList.aspx">Manage tags &raquo;</a>
            </p>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <h2>News articles</h2>
            <p>
                Add, edit or delete news articles from each partner organisation.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="NewsList.aspx">Manage news &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Training opportunities</h2>
            <p>
                Add, edit or delete upcoming global and regional training opportunities.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="TrainingList.aspx">Manage training &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Surveys and feedback</h2>
            <p>
                Add a survey link to gain insights and feedback from app users.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="SurveyManager.aspx">Manage surveys &raquo;</a>
            </p>
        </div>

    </div>

    <div class="row">
        <div class="col-md-4">
            <h2>Statistics</h2>
            <p>
                View summary statistics of the website and mobile application usage.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="Statistics.aspx">View statistics &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Portal access</h2>
            <p>
                Manage users and organisations using this administration portal.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="Code/Security/UserAdmin.aspx">Administer portal &raquo;</a>
            </p>
        </div>
        <div class="col-md-4">
            <h2>Help</h2>
            <p>
                Browse guidance on the administration of data, users and organisations in the website.
            </p>
            <p>
                <a class="btn btn-default HeaderBtn" href="Help.aspx">View help &raquo;</a>
            </p>
        </div>

    </div>
    <br /><br /><br />
</asp:Content>
