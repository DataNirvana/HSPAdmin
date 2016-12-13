<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Search.aspx.cs" Inherits="GHSP.WebAdmin.Search" %>

<%@ Register Src="~/Code/UserControls/CtlInfoSplash.ascx" TagPrefix="DN" TagName="CtlInfoSplash" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HC" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MC" runat="server">
    <asp:PlaceHolder ID="JS" EnableViewState="false" runat="server" />    
    <DN:CtlInfoSplash runat="server" ID="ctlInfoSplash" />

    <div class="BodyInfoTextHeader HeaderBar"><h2>Search</h2></div>
    <br />

    <div class="row">
          <div class="col-md-5 TBRowPadding">
                <input id="TBSearch" type="text" class="TBSearch" runat="server" />
        </div>
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="javascript:DoSearch();" class="btn btn-primary btn-lg HeaderBtn">Search &raquo;</a>
            </p>
        </div>
    </div>


    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;Search results</div>
    <br />

    <div class="row">
          <div class="col-md-2">
            <p class="HeaderBtnWrapper">
                <a href="javascript:FilterSearch(0);" class="btn btn-default HeaderBtn">All</a>
            </p>
        </div>
          <div class="col-md-2">
            <p class="HeaderBtnWrapper">
                <a href="javascript:FilterSearch(1);" class="btn btn-default HeaderBtn">Standards</a>
            </p>
        </div>
          <div class="col-md-2">
            <p class="HeaderBtnWrapper">
                <a href="javascript:FilterSearch(2);" class="btn btn-default HeaderBtn">Resources</a>
            </p>
        </div>
          <div class="col-md-2">
            <p class="HeaderBtnWrapper">
                <a href="javascript:FilterSearch(3);" class="btn btn-default HeaderBtn">News</a>
            </p>
        </div>
          <div class="col-md-2">
            <p class="HeaderBtnWrapper">
                <a href="javascript:FilterSearch(4);" class="btn btn-default HeaderBtn">Training</a>
            </p>
        </div>
    </div>

    <hr />
    <div class="BodyInfoContent">No results</div>
    <br /><br /><br />
    <br /><br /><br />


</asp:Content>
