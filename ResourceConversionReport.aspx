<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ResourceConversionReport.aspx.cs" Inherits="GHSP.WebAdmin.ResourceConversionReport" %>

<%@ Register Src="~/Code/UserControls/DocumentConversionReport.ascx" TagPrefix="DN" TagName="DocumentConversionReport" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
    <DN:DocumentConversionReport runat="server" ID="docConversionReport" />   
</asp:Content>

