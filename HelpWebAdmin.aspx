<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="HelpWebAdmin.aspx.cs" Inherits="GHSP.WebAdmin.HelpWebAdmin" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HC" runat="server">
     <asp:placeholder ID="jsStuff" EnableViewState="false" runat="server"></asp:placeholder>
</asp:Content>
<asp:Content ID="BC1" runat="server" ContentPlaceHolderID="MC">

    <br />
    <div class="BodyInfoTextHeader HeaderBar"><h2>Help for user and web administrators</h2></div>
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
    </div>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;a. Overview</div>
    <br />

    <p class="BodyInfoTextHelp">
        On this page, there is more information on how to manage surveys and user feedback, 
        check on the website performance and the statistics being generated from the app usage.
        There is also a quick summary of how to add, update and delete users and organisations from the system.
    </p>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;b. How to manage surveys and user feedback?</div>
    <br />

    <p class="BodyInfoTextHelp">

        Follow these steps:
    </p>
    <ol class="BodyInfoTextHelp">
        <li>To Do...</li>
    </ol>
    <br />


    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;c. How to check if the website is performing ok and browse app usage statistics?</div>
    <br />

    <p class="BodyInfoTextHelp">
        Follow these steps:
    </p>
    <ol class="BodyInfoText">
        <li>Go to the data administration page.</li>
        <li>Choose the 'view webpage performance' option.</li>
        <li>The page counts and average response times will be shown for the last 30 days.  Keep an eye on this for pages that are frequently requested but are heavy to run.</li>
    </ol>
    <br />


    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;d. How to add new users?</div>
    <br />

    <p class="BodyInfoTextHelp">
        Follow these steps:
    </p>
    <ol class="BodyInfoText">
        <li>Go to the user administration page</li>
        <li>Download the latest list of users</li>
        <li>Modify the spreadsheet as required with new users or updates to current users.</li>
        <li>Using the import tool on the user administration page, import this list of users back into the system.</li>
        <li>A confirmation of the success of the import will be displayed at the top of the page.
            In case of any issues, you can download a spreadsheet with a list of the specific errors associated with each user
            (e.g. The username already exists, the password is not secure, basic biodata has not been entered correctly etc.)</li>
        <li>Go through each of these issues, make the necessary changes and for these users you can then have another go at re-importing them into the system.</li>
        <li>Note that when updating a users permissions, add 'Yes' to the relevant columns.
        Most correspond directly to the roles listed in point b above.  Two that require further clarification;
        'Secure users' are the Global data entry operators and 'Professional users' are the Reviewing officers.</li>
    </ol>
    <br />

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;e. How to add new organisations?</div>
    <br />
    
    <p class="BodyInfoTextHelp">
        Follow these steps:
    </p>
    <ol class="BodyInfoText">
        <li>All users have to belong to an organisation that exists in the system, so this step should be started before adding or modifying users.</li>
        <li>Go to the user administration page.</li>
        <li>Select the 'add organisation' link.</li>
        <li>Review the current list of organisations and only add the organisation if you are sure it does not already exist.</li>
        <li>Once you have double-checked the spelling of your new organisation, click 'add organisation'.</li>
        <li>You will receive a confirmation at the top of the page that the organisations has been successfully added.</li>
    </ol>
    <br />

    

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