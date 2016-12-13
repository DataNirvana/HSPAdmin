<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" 
    CodeBehind="StandardReview.aspx.cs" Inherits="GHSP.WebAdmin.StandardReview"
     ClientIDMode="Static" %>

<%@ Register Src="~/Code/UserControls/DocumentReview.ascx" TagPrefix="DN" TagName="DocumentReview" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
    <DN:DocumentReview runat="server" ID="DocumentReview" />
</asp:Content>
