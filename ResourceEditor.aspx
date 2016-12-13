<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ResourceEditor.aspx.cs" Inherits="GHSP.WebAdmin.ResourceEditor"
    EnableEventValidation="false" EnableViewStateMac="true" ViewStateEncryptionMode="Always" %>

<%@ Register Src="~/Code/UserControls/DocumentEditor.ascx" TagPrefix="DN" TagName="DocumentEditor" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
    <DN:DocumentEditor runat="server" IsStandard="false" ID="DocumentEditor" />

</asp:Content>
