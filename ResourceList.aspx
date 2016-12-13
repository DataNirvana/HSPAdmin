<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ResourceList.aspx.cs" Inherits="GHSP.WebAdmin.ResourceList" %>

<%@ Register Src="~/Code/UserControls/DocumentList.ascx" TagPrefix="DN" TagName="DocumentList" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">


    <DN:DocumentList runat="server" DocType="Resource" ID="DocumentList" />

</asp:Content>
