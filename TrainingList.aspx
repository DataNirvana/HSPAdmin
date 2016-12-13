<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="TrainingList.aspx.cs" Inherits="GHSP.WebAdmin.TrainingList" %>

<%@ Register Src="~/Code/UserControls/DocumentList.ascx" TagPrefix="DN" TagName="DocumentList" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">
    
    <DN:DocumentList runat="server" DocType="Training" ID="DocumentList" />

</asp:Content>
