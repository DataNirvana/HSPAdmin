<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="TrainingEditor.aspx.cs" Inherits="GHSP.WebAdmin.TrainingEditor"
    EnableEventValidation="false" EnableViewStateMac="true" ViewStateEncryptionMode="Always" %>

<%@ Register Src="~/Code/UserControls/BlogContentEditor.ascx" TagPrefix="DN" TagName="BlogContentEditor" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">

    <DN:BlogContentEditor runat="server" ID="contentEditor" IsNewsArticle="false" />

</asp:Content>
