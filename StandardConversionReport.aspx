<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="StandardConversionReport.aspx.cs" Inherits="GHSP.WebAdmin.StandardConversionReport" %>

<%@ Register Src="~/Code/UserControls/DocumentConversionReport.ascx" TagPrefix="DN" TagName="DocumentConversionReport" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
    <DN:DocumentConversionReport runat="server" ID="docConversionReport" />
</asp:Content>

