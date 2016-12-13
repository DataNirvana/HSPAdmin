<%@ Page Language="C#" AutoEventWireup="true"  MasterPageFile="~/Site.Master"  
    CodeBehind="ResourceChooser.aspx.cs" Inherits="GHSP.WebAdmin.ResourceChooser"
    EnableEventValidation="false" EnableViewStateMac="true" ViewStateEncryptionMode="Always" %>

<%@ Register Src="~/Code/UserControls/DocumentChooser.ascx" TagPrefix="DN" TagName="DocumentChooser" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
    <DN:DocumentChooser IsStandard="false" runat="server" id="documentChooser" />
</asp:Content>
