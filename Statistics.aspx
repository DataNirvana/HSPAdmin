<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Statistics.aspx.cs" Inherits="GHSP.WebAdmin.Statistics" %>

<%@ Register Src="~/Code/UserControls/CtlInfoSplash.ascx" TagPrefix="DN" TagName="CtlInfoSplash" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
    <DN:CtlInfoSplash runat="server" ID="CtlInfoSplash" />

    <div class="BodyInfoTextHeader HeaderBar"><h2>Statistics</h2></div>
    <br />

    <div class="row">
          <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/Default" class="btn btn-primary btn-lg HeaderBtn" runat="server">&laquo; Home</a>
            </p>
        </div>
        <div class="col-md-4">
            <p class="HeaderBtnWrapper">
                <a href="/Code/ViewPagePerformance" class="btn btn-primary btn-lg HeaderBtnWide">Admin statistics &raquo;</a>
            </p>
        </div>
    </div>

    <br />
    <div class="BodyInfoTextHeader HeaderBar">&nbsp;&nbsp;App statistics</div>
    <br /><br />


    <br /><br />
    To do - add the Statistics visualisation here ....
    <br /><br /><br />


</asp:Content>
