<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="NewsList.aspx.cs" Inherits="GHSP.WebAdmin.NewsList" %>

<%@ Register Src="~/Code/UserControls/DocumentList.ascx" TagPrefix="DN" TagName="DocumentList" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">

    <DN:DocumentList runat="server" DocType="News" ID="DocumentList" />

</asp:Content>
