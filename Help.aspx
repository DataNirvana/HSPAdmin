<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Help.aspx.cs" Inherits="GHSP.WebAdmin.Help" %>

<%@ Register Src="~/Code/UserControls/CtlMGLLink.ascx" TagPrefix="MGL" TagName="CtlLink" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HC" runat="server">
     <asp:placeholder ID="jsStuff" EnableViewState="false" runat="server"></asp:placeholder>
</asp:Content>
<asp:Content ID="BC1" runat="server" ContentPlaceHolderID="MC">
    <br />
    <div class="BodyInfoTextHeader HeaderBar"><h2>Help</h2></div>
    <br />

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/Default" class="btn btn-primary btn-lg HeaderBtn">&laquo; Go home</a>
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

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;a. Overview - How to use this website?</div>
    <br />  
            <p class="BodyInfoTextHelp">
                Welcome!  We're trying to make the functionality in this site as easy as possible to use.
                It's worth having a quick read of the key steps with how to use the <i>administration</i> functions in this website. 
                There are links below to quick guidance on the administration of data, users, organisations and the website itself.
                <br /><br />
                Otherwise, if you're still stuck after you have read the descriptions of the user and data administration below,
                please email your queries to <a href="mailto:datanirvanalimited@gmail.com">datanirvanalimited@gmail.com</a>.
            </p>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;b. What about information security?</div>
    <br />
            <p class="BodyInfoTextHelp">
                The information stored in this system is encrypted at rest and in transit.
                At rest, the information is stored in a secure database and the transfer of information between your computer and the server is encrypted.
                <br /><br />
                In addition, the system supports the following user access levels:
                <br />
            </p>
            <ul class="BodyInfoTextHelp">
                <li><b>Data viewers</b> - useful for those users requiring an overarching view of the system, but will not be directly editing data.</li>
                <li><b>Data entry operators</b> - can add and edit information and see <i>only</i> those documents and content that their organisation is responsible for.
                Managers within partner organisation teams are also responsible for approving documents before they are made live.</li>
                <li><b>Global data administrators</b> - as the previous group but can view and edit <i>all</i> documents and content.</li>
                <li><b>User administrators</b> - responsible for adding, updating and removing users in the system.</li>
                <li><b>Web administrators</b> - responsible for reviewing any bug reports that arise as the mobile app and website are used.</li>
            </ul>
            <p class="BodyInfoTextHelp">
                When you request access to the system you will be granted one or more of the above roles.  Please discuss which roles are appropriate with your team leader and the GHSP team.
            </p>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;c. More detailed information?</div>
    <br />
    
    <p class="BodyInfoTextHelp">
        For more detailed guidance on the data, web, user and organisation administration follow one of the following links:
    </p>

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/HelpDataAdmin" class="btn btn-primary btn-lg HeaderBtn">Data help &raquo;</a>
            </p>
        </div>
        <div class="col-md-6">
            <p>
               Help managing the data content in the system 
            </p>
        </div>      
    </div>

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/HelpStyles" class="btn btn-primary btn-lg HeaderBtn">Stylesheet help &raquo;</a>
            </p>
        </div>
        <div class="col-md-6">
            <p>
                Understand how to use the styles in the system
            </p>
        </div>      
    </div>

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/HelpWebAdmin" class="btn btn-primary btn-lg HeaderBtn">Admin help &raquo;</a>
            </p>
        </div>
        <div class="col-md-6">
            <p>
               Website administration, user administration and organisational administration ...
            </p>
        </div>      
    </div>


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
