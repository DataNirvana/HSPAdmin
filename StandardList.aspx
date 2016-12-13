<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="StandardList.aspx.cs" Inherits="GHSP.WebAdmin.StandardList" %>

<%@ Register Src="~/Code/UserControls/DocumentList.ascx" TagPrefix="DN" TagName="DocumentList" %>

<asp:Content ID="Content2" ContentPlaceHolderID="HC" runat="server">
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
  
    <DN:DocumentList runat="server" DocType="Standard" id="DocumentList" />

</asp:Content>
