<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="TrainingReview.aspx.cs" Inherits="GHSP.WebAdmin.TrainingReview" %>
<asp:Content ID="Content1" ContentPlaceHolderID="MC" runat="server">

    <script src="Content/JqueryFileTree/jqueryFileTree.js" type="text/javascript"></script>
		<link href="Content/JqueryFileTree/jqueryFileTree.css" rel="stylesheet" type="text/css" media="screen" />
    <script type="text/javascript">
			
        $(document).ready( function() {
            $('#fileTreeDemo_1').fileTree({ root: '../../demo/', script: 'Content/JQueryFileTree/jqueryFileTree.asx' }, function(file) { 
                alert(file);
            });

        });
        </script>

    <div id="fileTreeDemo_1" class="demo"></div>



    <ul id="folder" class="filetree">
        <li><span class="folder">Folder 1</span>
            <ul>
                <li><span class="file">Item 1.1</span></li>
            </ul>
        </li>
        <li><span class="folder">Folder 2</span>
            <ul>
                <li><span class="folder">Subfolder 2.1</span>
                    <ul id="folder21">
                        <li><span class="file">File 2.1.1</span></li>
                        <li><span class="file">File 2.1.2</span></li>
                    </ul>
                </li>
                <li><span class="file">File 2.2</span></li>
            </ul>
        </li>
        <li class="closed"><span class="folder">Folder 3 (closed at start)</span>
            <ul>
                <li><span class="file">File 3.1</span></li>
            </ul>
        </li>
        <li><span class="file">File 4</span></li>
    </ul>

    https://www.jstree.com/docs/html/

</asp:Content>
