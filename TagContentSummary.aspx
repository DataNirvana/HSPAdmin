<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="TagContentSummary.aspx.cs" Inherits="GHSP.WebAdmin.TagContentSummary" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HC" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MC" runat="server">

    <br />
    <div class="BodyInfoTextHeader HeaderBar"><h2>Browse content by tag for <span id="tagName" runat="server"></span></h2></div>
    <br />

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/TagList" class="btn btn-primary btn-lg HeaderBtn">&laquo; Go back</a>
            </p>
        </div>
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a id="SearchDocuments" href="Search.aspx" class="btn btn-primary btn-lg HeaderBtn" runat="server">Search &raquo;</a>
            </p>
        </div>      
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="TagList.aspx" class="btn btn-primary btn-lg HeaderBtn">Add tag &raquo;</a>
            </p>
        </div>
    </div>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Quick guidance</div>

    <br />
    <p>Choose a tag and then review the list of content sections currently related to each tag.</p>
    <br />

    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Tag list</div>
    <br />
    
    <p>The list of content sections related to this tag are as follows:</p>


    <div id="TagSummary" runat="server"></div>


    <br /><br />

</asp:Content>
