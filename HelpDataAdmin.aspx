<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="HelpDataAdmin.aspx.cs" Inherits="GHSP.WebAdmin.HelpDataAdmin" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HC" runat="server">
     <asp:placeholder ID="jsStuff" EnableViewState="false" runat="server"></asp:placeholder>
</asp:Content>
<asp:Content ID="BC1" runat="server" ContentPlaceHolderID="MC">

    <br />
    <div class="BodyInfoTextHeader HeaderBar"><h2>Help for data administrators</h2></div>
    <br />

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/Help" class="btn btn-primary btn-lg HeaderBtn">&laquo; Go back</a>
            </p>
        </div>
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/HelpStyles" class="btn btn-primary btn-lg HeaderBtn">Stylesheet help &raquo;</a>
            </p>
        </div>      
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/HelpWebAdmin" class="btn btn-primary btn-lg HeaderBtn">Admin help &raquo;</a>
            </p>
        </div>
    </div>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;a. Overview - What data should be administered?</div>
    <br />
  
    <div class="row">
          <div class="col-md-4">
                <h4>Standards</h4>
        </div>
        <div class="col-md-6">
            <p class="BodyInfoTextHelp">
                Blah blah blah
            </p>
        </div>      
    </div>
    <div class="row">
          <div class="col-md-4">
                <h4>Resources</h4>
        </div>
        <div class="col-md-6">
            <p class="BodyInfoTextHelp">
                Blah blah blah
            </p>
        </div>      
    </div>
    <div class="row">
          <div class="col-md-4">
                <h4>News articles</h4>
        </div>
        <div class="col-md-6">
            <p class="BodyInfoTextHelp">
                Blah blah blah
            </p>
        </div>      
    </div>
    <div class="row">
          <div class="col-md-4">
                <h4>Training opportunities</h4>
        </div>
        <div class="col-md-6">
            <p class="BodyInfoTextHelp">
                Blah blah blah
            </p>
        </div>      
    </div>
    <div class="row">
          <div class="col-md-4">
                <h4>Tags</h4>
        </div>
        <div class="col-md-6">
            <p class="BodyInfoTextHelp">
                Blah blah blah
            </p>
        </div>      
    </div>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;b. How to add standards and resources?</div>
    <br />

    <p class="BodyInfoTextHelp">

        Follow these steps:
    </p>
    <ol class="BodyInfoTextHelp">
        <li>To Do...</li>
    </ol>
    <br />


    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;c. How to add news articles and training opportunities?</div>
    <br />

    <p class="BodyInfoTextHelp">

        Follow these steps:
    </p>
    <ol class="BodyInfoTextHelp">
        <li>To Do...</li>
    </ol>
    <br />


    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;c. How to add tags?</div>
    <br />

    <p class="BodyInfoTextHelp">

        Follow these steps:
    </p>
    <ol class="BodyInfoTextHelp">
        <li>To Do...</li>
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