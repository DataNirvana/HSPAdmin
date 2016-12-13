//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/* 
    DataManipulation.js - Code to support the editing and visualisation of forms
    
    No document.ready or "real time" calls are made from this library - all the initialisation of the forms is encapsulated in the functions at the end of this library
    which are called in the document.ready in each specific page.

    Requires JQuery >1.7
    Edgar Scrase
    Copyright 2010 - 2016, all rights reserved
*/


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Generic methods used in all sites
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//------------------------------------------------------------------------------------------------------------------------------------
// One of S for search, SR for Search Reults, C for Case, I for Individual or R for relative
// need to add this to all three pages
// Keyword is grievances, cases, incidents or projects
var DataContext = "";
// One of "case" (PNA), "grievance" (IDPG), "incident" (SGBV) or "project" (RAHA explorer)
var DataKeyWord = "";
var DoSaveDraft = false;

var infoSplashTimeoutID = "";

//------------------------------------------------------------------------------------------------------------------------------------
// Specific elements in pages - set in the onload of the case and individual user controls ...
// The case/grievance/incident/project ID
var CIID = null;
// The submit button ID
//var CISubmitLinkID = null;
//var CIActionToPerform = null;


//------------------------------------------------------------------------------------------------------------------------------------
// The OnBeforeUnloadHandler for the data pages (Cases and individuals), stops users inadvertently leaving the page without warning them they will lose all their data
function OnBeforeUnloadHandler(e) {

    //UnlockCase();
    // DoUnloadCheck is set on the server side in the individual and case controls ...
    if (DoUnloadCheck == 1) {
        return "Warning!  Any changes you have made to the information on this page have not been saved.  If you leave this page now, those changes will be lost.  Do you really want to leave now?";
    } else {
        // Don't return anything makes IE work well ....!!!!
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
function WebDocTypeText(docType, isRightCase) {

    var txt = "";

    if (docType == 1) {
        txt = (isRightCase == true) ? "Standard" : "standard";
    } else if (docType == 2) {
        txt = (isRightCase == true) ? "Resource" : "resource";
    } else if (docType == 3) {
        txt = (isRightCase == true) ? "News" : "news";
    } else if (docType == 4) {
        txt = (isRightCase == true) ? "Training" : "training";
    }

    return txt;
}


//------------------------------------------------------------------------------------------------------------------------------------
// Submits the form
function DoSubmit(doValidation, doSubmit) {
    HideInfoSplash();
    var valSuc = (doValidation) ? Page_ClientValidate && Page_ClientValidate() : true;
    if (valSuc == true) {
        // Set the action to perform ...
        if (doSubmit == true) {
            $("#ActionToPerform").val("DoSubmit");
        }

        // Cover the screen with the div ...
        ShowLockButtonsModal();

        if (DataContext == "S") {
            // Special case for the search terms...
            if (doSubmit == false) {
                $("#ActionToPerform").val("ClearSearchTerms");                
            }

/////////////////////////////////////
            // This is PNA Specific ......
            // Cheeky little fix due to the server side validation - if no province has been selected,
            // we need to swap the full list of districts back in and select the blank one ...
            // otherwise this causes a validation error 
            var districtDD = $("#TBDistrictCoA");
            if ( districtDD != null ) {
                if (districtDD.val() == "9999") {
                    districtDD.html(savedOptionsDistrictCoA);
                    districtDD.val("");
                }
            }
        } else {
            // Unbind
            $(window).unbind('beforeunload');
            // C/I/R - Suppress the alert that would have warned about unsaved changes
            DoUnloadCheck = 0;
        }
        // Always do the submit ... if the validation was succesfull
        document.forms[0].submit();
    }
}


//------------------------------------------------------------------------------------------------------------------------------------
var formDataToSend = "";
var webMethod = "";

//------------------------------------------------------------------------------------------------------------------------------------
// Saves the draft of the current data - currently not used
// TO DO - and anyway, should now be converted to using local data storage
function SaveDraft() {
    if (DoSaveDraft == true) {
        ShowInfoSplash("Saving ...", "InfoClassSuccess");

        console.log("Form data to send: " +formDataToSend);

        $.ajax({
            type: "POST",
            url: "Code/SaveData.asmx/"+webMethod , //SaveDocument",
//            url: "Code/SaveDraft.aspx",
            //async: true,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
//            data: ({
//                AAATesting1: "Testing here",
//                AAATesting2: "Testing here2"
//            }),
            data: formDataToSend,
            //data: {},

            success: function (response) {

                // And make sure to keep the session alive too..
                SessKeepAlivePoll();

                console.log("SaveDraft: " + response.d);

                // And the last thing to do here is update the IDs for the docID and the languages .... using the response.d csv list of IDs...
                var idArray = response.d.split(",");

                console.log("SaveDraft: " + response.d);

                // The counter for applying the fresh IDs indexes 
                var counter = 1;
                var success = false;

                // check that the first number is numeric, otherwise there were problems saving this
                if (response.d == "nochange") {
                    var mdWord = "metadata ";
                    if (webMethod == "SaveBlog") {
                        mdWord = "";
                    }
                    ShowInfoSplash("The document "+mdWord+"provided has not changed so no need to save it again.", "InfoClassWarning");
                    success = true;
                } else if (response.d == "notauthorised") {
                    ShowInfoSplash("You are not authorised to save changes for this document!", "InfoClassFailure");
                } else if (response.d == "error" || response.d == "unknown" || isNaN(+idArray[0]) == true) {
                    ShowInfoSplash("A problem occurred when trying to save this content.  Please check the information and try again", "InfoClassFailure");
                } else {
                    success = true;

                    // 5-Dec-16 - Lets update the title, just in case the working title changed ...
                    $("#WDWorkingTitle").html($("#TBWorkingTitle").val());

                    // Ok the array is good and no errors were encountered, so lets go ahead and save the IDs ...
                    // Note that the danger of doing this here is with partial successes, the versions that did load wont have their IDs carried accross.
                    $("#DocID").val(+idArray[0]);
                    var languages = $("#TBLanguage").val();
                    languages.forEach(function (item, index) {
                        $("#TB_" + item + "_VersionID").val(+idArray[counter++]);
                    });
                  
                    
                    ShowInfoSplash("Saved content at " + BuildPrettyDateString(new Date(), true), "InfoClassSuccess");
                }
                window.scrollTo(0, 0);
                infoSplashTimeoutID = window.setTimeout("HideInfoSplash(3000);", 3000);
                HideLockButtonsModal();
                // And lastly lets let the user leave without a warning dialogue
                DoUnloadCheck = 0;


                // And lastly - lets push the last item into the ChapterIDList if this is a blog
                // 5-Dec-16 - No longer saving the tags for the News articles and training opportunities ..
                //if (success = true && webMethod == "SaveBlog") {
                //    if (chapterIDList.length == 0) {
                //        console.log("SaveDraft - blog specific stuff - the chapter ID is " + idArray[counter]);
                //        chapterIDList.push(+idArray[counter]);
                //    }
                //    // And lastly, if this is a blog, lets also save the tags as well...
                //    DoTagSave(true);
                //}

            },
            failure: function (response) {
                // wire up the infoSplash ....
                //alert('failed to save the draft');
                console.log("SaveDraft error: " + response);
                ShowInfoSplash("Unspecified problem saving content - check the internet conection?", "InfoClassFailure");
                window.scrollTo(0, 0);
                HideInfoSplash(3000);
                HideLockButtonsModal();

                // And lastly lets let the user leave without a warning dialogue
                DoUnloadCheck = 0;
            }
        });
    }
}


//------------------------------------------------------------------------------------------------------------------------------------
function BuildFormDataFromDocument() {

    webMethod = "SaveDocument";
               
    formDataToSend = "{"
        + "docID:" + JSON.stringify(+$("#DocID").val()) + ","
        + "docType:" + JSON.stringify(+$("#DocType").val()) + ","
        + "workingTitle:" + JSON.stringify($("#TBWorkingTitle").val()) + ","
        + "organisationID:" + JSON.stringify(+$("#TBOrg").val()) + ","   
        + "languages:" + JSON.stringify($("#TBLanguage").val()) + ","
        + "versions:" + BuildWebDocVersionList("", "")
        +  "}";
}



//------------------------------------------------------------------------------------------------------------------------------------
function BuildFormDataFromBlog() {

    webMethod = "SaveBlog";

    var imageName = $("#TBImageSelected").val();
console.log(imageName);
    if (imageName == null) {
        imageName = "";
    }
console.log(imageName);
    formDataToSend = "{"
        // WebDoc
        + "docID:" + JSON.stringify(+$("#DocID").val()) + ","
        + "docType:" + JSON.stringify(+$("#DocType").val()) + ","
        + "workingTitle:" + JSON.stringify($("#TBWorkingTitle").val()) + ","
        + "organisationID:" + JSON.stringify(+$("#TBOrg").val()) + ","

        + "geographicCountry:" + JSON.stringify(+$("#TBGeogCountry").val()) + ","
        + "imageName:" + JSON.stringify(imageName) + ","

        + "languages:" + JSON.stringify($("#TBLanguage").val()) + ","
        // WebDocVersions
        + "versions:" + BuildWebDocVersionList("TBStatus", "TBPublicationDate") + ","
        // WebDocContent
        + "contentList:" + BuildWebDocBlogContent()
        // WebDocTags - No these are done with the existing save method ....
        + "}";
}


//------------------------------------------------------------------------------------------------------------------------------------
function BuildWebDocVersionList(statusID, pubDateID) {

    var wdvList = "[";

    var languages = $("#TBLanguage").val();
    languages.forEach(function (item, index) {
        // Add a comma to separate out the next item in the list ...
        if (index > 0) {
            wdvList = wdvList + ",";
        }

        if (pubDateID == "" || pubDateID == null) {
            pubDateID = "TB_" + item + "_iv";
        }

        var jsonPubDate = BuildJSONDateString($("#" + pubDateID).val())

        if (statusID == "" || statusID == null) {
            statusID = "TB_" + item + "_iii";
        }


        //// Reparse the publication date!!
        //var pubDatePrettyStr = $("#TB_" + item + "_iv").val();
        //// 36610000000 // 1, 0, 1, 1, 1, 1, 0)
        //// We will have to live with this for now - the MGL null date does not work when parsed from JS to C# it becomes 2001.  
        //// Therefore for the avoidance of doubt, lets use this one and convert it when it goes server side ...
        //var pubDate = new Date(1901, 0, 1, 1, 1, 1, 0);
        ////pubDate.setFullYear(pubDate.getFullYear() - 1900);
        //console.log(pubDate);

        //var pubDateStr = BuildDateString(pubDate, true);
        //if (pubDatePrettyStr != "") {
        //    var pubDateBits = pubDatePrettyStr.split(" ");

        //    console.log(pubDateBits[2] + " " + pubDateBits[1] + " " + pubDateBits[0]);
        //    // now convert the date back!!!
        //    var month = -1;
        //    months.forEach(function(item, index) {
        //        if (item == pubDateBits[1]) {
        //            month = index;
        //        }
        //    });

        //    var pubDateObj = new Date(+pubDateBits[2], month, +pubDateBits[0], 0, 0, 0, 0);
        //    pubDateStr = BuildDateString(pubDateObj, false);
        //}

        // now build the object data itself ...
        wdvList = wdvList + "{"
        + "ID:" + JSON.stringify(+$("#TB_" + item + "_VersionID").val()) + ","
        + "DocID:" + JSON.stringify(+$("#DocID").val()) + ","
        + "Status:" + JSON.stringify(+$("#" + statusID).val()) + ","
        + "Title:" + JSON.stringify($("#TB_" + item + "_i").val()) + ","
        + "Description:" + JSON.stringify($("#TB_" + item + "_ii").val()) + ","
        + "Language:" + JSON.stringify(item) + ","
        + "PublicationDate:" + JSON.stringify(jsonPubDate) + ","
        + "InsertDate:" + JSON.stringify(BuildDateString(new Date(), false)) + ","
        + "UpdateDate:" + JSON.stringify(BuildDateString(new Date(), false))
        + "}";

    });

    wdvList = wdvList + "]";

    return wdvList;
}

//------------------------------------------------------------------------------------------------------------------------------------
function BuildWebDocBlogContent() {

    var wdcList = "[";

    var languages = $("#TBLanguage").val();
    languages.forEach(function (item, index) {
        // Add a comma to separate out the next item in the list ...
        if (index > 0) {
            wdcList = wdcList + ",";
        }

        var htmlContent = $("#TB_" + item + "_iii").trumbowyg('html');

        console.log("HTMLContent for TB_" + item + "_iii: " + htmlContent);

        // now build the object data itself ...
        wdcList = wdcList + JSON.stringify(htmlContent);

    });

    wdcList = wdcList + "]";

    return wdcList;
}



//------------------------------------------------------------------------------------------------------------------------------------
//function BuildWebDocVersionListFromBlog() {

//    var wdvList = "[";

//    // ok the difference with the blog is that two fields to be saved in the version information are actually in the web doc stuff - the status and publication date....
//    // TBStatus and TBPublicationDate
//    var status = +$("#TBStatus").val();

//    // Reparse the publication date!!
//    var pubDatePrettyStr = $("#TBPublicationDate").val();
//    // 36610000000 // 1, 0, 1, 1, 1, 1, 0)
//    // We will have to live with this for now - the MGL null date does not work when parsed from JS to C# it becomes 2001.  
//    // Therefore for the avoidance of doubt, lets use this one and convert it when it goes server side ...
//    var pubDate = new Date(1901, 0, 1, 1, 1, 1, 0);
//    //pubDate.setFullYear(pubDate.getFullYear() - 1900);
//    console.log(pubDate);

//    var pubDateStr = BuildDateString(pubDate, true);
//    if (pubDatePrettyStr != "") {
//        var pubDateBits = pubDatePrettyStr.split(" ");

//        console.log(pubDateBits[2] + " " + pubDateBits[1] + " " + pubDateBits[0]);
//        // now convert the date back!!!
//        var month = -1;
//        months.forEach(function (item, index) {
//            if (item == pubDateBits[1]) {
//                month = index;
//            }
//        });

//        var pubDateObj = new Date(+pubDateBits[2], month, +pubDateBits[0], 0, 0, 0, 0);
//        pubDateStr = BuildDateString(pubDateObj, false);
//    }


//    var languages = $("#TBLanguage").val();
//    languages.forEach(function (item, index) {
//        // Add a comma to separate out the next item in the list ...
//        if (index > 0) {
//            wdvList = wdvList + ",";
//        }
                
//        // now build the object data itself ...
//        wdvList = wdvList + "{"
//        + "ID:" + JSON.stringify(+$("#TB_" + item + "_VersionID").val()) + ","
//        + "DocID:" + JSON.stringify(+$("#DocID").val()) + ","
//        + "Status:" + JSON.stringify(status) + ","
//        + "Title:" + JSON.stringify($("#TB_" + item + "_i").val()) + ","
//        + "Description:" + JSON.stringify($("#TB_" + item + "_ii").val()) + ","
//        + "Language:" + JSON.stringify(item) + ","
//        + "PublicationDate:" + JSON.stringify(pubDateStr) + ","
//        + "InsertDate:" + JSON.stringify(BuildDateString(new Date(), false)) + ","
//        + "UpdateDate:" + JSON.stringify(BuildDateString(new Date(), false))
//        + "}";

//    });

//    wdvList = wdvList + "]"

//    return wdvList;
//}



//------------------------------------------------------------------------------------------------------------------------------------
function BuildDateString(dateObj, includeTime) {

    var mo = dateObj.getMonth() + 1;
    mo = (mo < 10) ? "0" + mo : mo;
    var d = dateObj.getDate();
    d = (d < 10) ? "0" + d : d;

    var h = dateObj.getHours();
    h = (h < 10) ? "0" + h : h;
    var mi = dateObj.getMinutes();
    mi = (mi < 10) ? "0" + mi : mi;
    var s = dateObj.getSeconds();
    s = (s < 10) ? "0" + s : s;

    //var testDateStr = d.getFullYear() + "-" + mo + "-" + da + " " + h + ":" + m + ":" + s;
    var dateStr = dateObj.getFullYear() + "-" + mo + "-" + d;
    if (includeTime == true) {
        dateStr = dateStr + " " + h + ":" + mi + ":" + s;
    }
    console.log(dateStr);
    
    return dateStr;
}

//------------------------------------------------------------------------------------------------------------------------------------
function BuildPrettyDateString(dateObj, includeTime) {

    var mo = dateObj.getMonth();
//    mo = (mo < 10) ? "0" + mo : mo;

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = months[mo];

    var d = dateObj.getDate();
    d = (d < 10) ? "0" + d : d;

    var h = dateObj.getHours();
    h = (h < 10) ? "0" + h : h;
    var mi = dateObj.getMinutes();
    mi = (mi < 10) ? "0" + mi : mi;
    var s = dateObj.getSeconds();
    s = (s < 10) ? "0" + s : s;

    //var testDateStr = d.getFullYear() + "-" + mo + "-" + da + " " + h + ":" + m + ":" + s;
    var dateStr = d + "-" + month + "-" + dateObj.getFullYear();
    if (includeTime == true) {
        dateStr = dateStr + " " + h + ":" + mi + ":" + s;
    }
    console.log(dateStr);

    return dateStr;
}


//------------------------------------------------------------------------------------------------------------------------------------
// Src String will be in the pretty date format - e.g. 01 Jan 2016
function BuildJSONDateString(datePrettyStr) {

    // Reparse the publication date!!
    //var pubDatePrettyStr = $("#TBPublicationDate").val();
    // 36610000000 // 1, 0, 1, 1, 1, 1, 0)
    // We will have to live with this for now - the MGL null date does not work when parsed from JS to C# it becomes 2001.  
    // Therefore for the avoidance of doubt, lets use this one and convert it when it goes server side ...
    var aDate = new Date(1901, 0, 1, 1, 1, 1, 0);
    //pubDate.setFullYear(pubDate.getFullYear() - 1900);
    console.log(aDate);

    var dateStr = BuildDateString(aDate, true);
    if (datePrettyStr != "") {
        var dateBits = datePrettyStr.split(" ");

        console.log(dateBits[2] + " " + dateBits[1] + " " + dateBits[0]);
        // now convert the date back!!!
        var month = -1;
        months.forEach(function (item, index) {
            if (item == dateBits[1]) {
                month = index;
            }
        });

        var dateObj = new Date(+dateBits[2], month, +dateBits[0], 0, 0, 0, 0);
        dateStr = BuildDateString(dateObj, false);
    }

    return dateStr;
}


//------------------------------------------------------------------------------------------------------------------------------------
// Builds a list of PlainObject key value pairs {MyFormID: formContent } - see http://api.jquery.com/Types/#PlainObject
//function BuildFormDataFromBlog() {
//    formDataToSend = $({});
//    formDataToSend.data("DocID", $("#DocID").val());
//    formDataToSend.data("TBWorkingTitle", $("#TBWorkingTitle").val());
    
//    //console.log(formDataToSend);

////    formDataToSend.data("key", "value");
////    formDataToSend.data("key", "value");
////    formDataToSend.data("key", "value");


//}

//------------------------------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------------------------------






//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SearchResults specific
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//------------------------------------------------------------------------------------------------------------------------------------
//-- Reloads the search results with the option of sorting, or paginating updated
function SLR(myAction, myActionValue) {
    //ShowLockButtonsModal();

//    console.log("SLR: " + DataKeyWord);

    // The projects are a bit special in that we use an AJAX call rather than a full reload ...
//    if (DataKeyWord == "project") {
//        SML(myAction, myActionValue);
//    } else {
//        var myURL = 
    this.location = SLRReloadPage + "?ActionCommand=" + myAction + "&ActionValue=" + myActionValue; 
//    }
}






//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Page initialisation methods
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
/*
Called in document.ready for the general initialisation for the Search, Case, Individual and Relatives pages ...
DataContext MUST be set before this method is called ...
(OR it could be passed in as a parameter I guess!!)
1-Apr-2016 - Now also used and made generic for the RAHA Explorer, IDP Grievances tool and the SGBV Incident reporting tool....
*/
function InitialisePage() {

    if (DataContext != "") {

        //-----b----- Document and blog editing specific
        if (DataContext == "DE") {

            // For this context - with everything buttonised, and lots of dropdowns wiring up on return doesn't make sense.  
            // Save it for the search and search results

            // 4-Nov-2015 - Wire up the inputs on the page to fire the custom submit not the default submit
            //$('input[type=text]').on('keydown', function (e) {
            //    if (e.which == 13) {
            //        e.preventDefault();
            //        DoSubmit(true);
            //    }
            //});
            //// 4-Nov-2015 - Wire up the page to submit when enter is pressed
            //$(document).keypress(function (e) {
            //    if (e.which == 13) {
            //        DoSubmit(true);
            //    }
            //});

        }

        //console.log("DoSaveDraft: " + DoSaveDraft);

        //-----c----- EDITABLE Forms - Only fire up the following, including the onBeforeUnload events, if this is in edit mode ...
        if (DoSaveDraft == true) {

            // Setup an alert to pop up if the user tries to leave the page without saving the data - this will be overridden if the request to leave is a valid postback (like a full data submit).
            $(window).bind("beforeunload", OnBeforeUnloadHandler);
            // 11-Jun-15 - Wire up the submit button to mitigate the IE onbeforeunload bug
            $("#Submit1").mouseover(function () { DoUnloadCheck = 0; });
            $("#Submit1").mouseout(function () { DoUnloadCheck = 1; });
            $("#Submit2").mouseover(function () { DoUnloadCheck = 0; });
            $("#Submit2").mouseout(function () { DoUnloadCheck = 1; });

        }
    }
}


//------------------------------------------------------------------------------------------------------------------------------------
//  Called in document.ready for the custom initialisation for the search results page ....
function InitialiseSRPage() {

    //-----a----- Search results row warning
    if (numResultsInSession > 0 && rowLimitExceeded == 1) {
        ShowInfoSplash("The search results contains the maximum " + numResultsInSession
                    + " results.  It is likely that your search is quite broad.  Try refining your search to reduce the number of results", 'InfoClassWarning');
        window.setTimeout("HideInfoSplash();", 5000);
    }

    //-----b----- Animate the buttons in the first two columns (e.g. view and edit or map and project details)
    //AnimateButtons();

    //-----c----- Highlights rows on hover over
    //-- JQuery function for highlighting rows on hover ...  SEEE IF THIS iSIS ANY FASTER!!!
    $("#SR tr:has(td)").on({
        mouseenter: function () {
            $(this).addClass("BH");
        },
        mouseleave: function () {
            $(this).removeClass("BH");
        }
    });
    /*
    The above function seems to scale better than this one
    $("#SR").delegate('tr', 'mouseover mouseleave', function (e) {
    var row = $(this).closest("tr");
    if (row != null) {
    if (e.type == 'mouseover') {
    if (prevClass == "") {
    prevClass = row.attr("class");
    row.removeAttr("class");
    row.attr("class", highlightClass);
    }
    } else {
    ...
    */

    //    $("#SR").delegate('tr', 'mouseover mouseleave', function (e) {
    //        var row = $(this).closest("tr");
    //        if (row != null) {
    //            if (e.type == 'mouseover') {
    //                if (prevClass == "") {
    //                    prevClass = row.attr("class");
    //                    row.removeAttr("class");
    //                    row.attr("class", highlightClass);
    //                }
    //            } else {
    //                if (prevClass != "") {
    //                    var row = $(this).closest("tr");
    //                    row.removeAttr("class");
    //                    row.attr("class", prevClass);
    //                    prevClass = "";
    //                }
    //            }
    //        }
    //    });

    //-----d----- 21-Mar-2016 - Wire up the dropdowns in the pagination controls ...
    $('.P2').on({
        change: function () {
            var myVal = $(this).val();
            SLR('ChangePageSize', myVal);
        }
    });
}





//------------------------------------------------------------------------------------------------------------------------------------
//--  Normally called in document.ready.  Initialises the modal div with the easy modal triggers.  
function InitialiseModalPage() {

    // This modal normally used for the pop up lists and details pages
    $("#MDiv").easyModal({
        top: 100,
        autoOpen: false,
        fadeSpeed: 300,
        overlayOpacity: 0.3,
        overlayColor: "#333",
        overlayClose: true,
        closeOnEscape: true
    });
}


////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

//------------------------------------------------------------------------------------------------------------------------------------
function FormDataChanged() {
    DoUnloadCheck = 1;
}
//------------------------------------------------------------------------------------------------------------------------------------
function HasFormDataChanged() {
    return (DoUnloadCheck == 1);
}


//------------------------------------------------------------------------------------------------------------------------------------
// Note that langID and versionHasContent are specific to the content pages
function NavigateToAnotherPageStart(pageType, langID, versionHasContent, disableDiscardChangesIfNotSaved) {
    // pageType can be one of List, Tag, Content, Editor

    var docID = +$('#DocID').val();
    var docType = +$('#DocType').val();

    var docTextName = WebDocTypeText(docType, false); // (docType == 1) ? "standard" : "resource";
    var urlStub = "/" + WebDocTypeText(docType, true); // (docType == 1) ? "/Standard" : "/Resource";
    //if (docType == 1) {
    //    docTextName = "standard";
    //    urlStub = "/Standard";
    //} else if (docType == 2) {
    //    docTextName = "resource";
    //    urlStub = "/Resource";
    //} else if (docType == 3) {
    //    docTextName = "news";
    //    urlStub = "/News";
    //} else if (docType == 4) {
    //    docTextName = "training";
    //    urlStub = "/Training";
    //}

    var url = "";
    if (pageType == "List") {
        url = urlStub + ListURL();
    } else if (pageType == "Tag") {
        url = TagEditorURL();
    } else if (pageType == "Content") {
        url = ContentURL(langID, versionHasContent);
    } else if (pageType == "Editor") {
        url = urlStub + EditorURL();
    }


    console.log("NavigateToAnotherPageStart:" + docID);
    console.log(url);

    var versionID = (typeof(langID) !== "undefined") ? +$('#TB_'+langID+'_VersionID').val() : -1;    

    if (docID == 0 || versionID == 0) {
        // There needs to be a go to warning message like the session expiry warning ...
//        console.log("Warning - document has not yet been saved.  Need to save the document metadata first before going to add tags!!");
        var discardTxt = "Discard changes";
        var discardJS = "NavigateToAnotherPageFinish('" + url + "')";
        if (typeof (disableDiscardChangesIfNotSaved) !== "undefined" && disableDiscardChangesIfNotSaved == true) {
            discardTxt = "";
            discardJS = "";
        }      

        // Do a confirmation here and then proceed to these ...
        ShowConfirmation("Save1Confirmation", "Please save the " + docTextName + " first!",
            "Before editing the " + pageType.toLowerCase() + "s associated with this " + docTextName
            + ", you will first need to save it.  To save this information, first click OK and then once you are happy with the metadata on this page, click on the <i>save "
            + docTextName + "</i> button below.",
            //"OK", "HideConfirmation()", "Discard changes", "NavigateToAnotherPageFinish('" + url + "')");
            //"OK", "HideConfirmation()", "", "");
            "OK", "HideConfirmation()", discardTxt, discardJS);

    } else if (HasFormDataChanged() == true) {

        // There needs to be a go to warning message like the session expiry warning ...
//        console.log("Warning - document has not yet been saved.  Need to save the document metadata first before going to add the content for lang "
//            + langID + "!!");

        // Do a confirmation here and then proceed to these ...
        ShowConfirmation("Save2Confirmation", "Unsaved changes for this " + docTextName + "!",
            "You have changed one or more fields on this page, which have not yet been saved.  If you intended these changes to be made, click OK and then check and save the information on this page before leaving by clicking on the <i>save " + docTextName + "</i> button below.",
            "OK", "HideConfirmation()", "Discard changes", "NavigateToAnotherPageFinish('" + url + "')");

    } else {

        // Just go there as no changes have been made and we have enough information saved
        NavigateToAnotherPageFinish(url);

    }
}
//------------------------------------------------------------------------------------------------------------------------------------
function NavigateToAnotherPageFinish(url) {
    DoUnloadCheck = 0;
    this.location = url;
}

//------------------------------------------------------------------------------------------------------------------------------------
function ListURL() {

    return "List";

//    var docType = +$('#DocType').val();
//    var href = (docType == 1) ? "/StandardList" : "/ResourceList";
//    return href;
    //        this.location = href;
    //    }
}


//------------------------------------------------------------------------------------------------------------------------------------
function ContentURL(langID, versionHasContent) {

    // get the DocID ....
    var docID = +$('#DocID').val();
    var versionID = +$('#TB_'+langID+'_VersionID').val();
    var docType = +$('#DocType').val();

    var href = (docType == 1) ? "/Standard" : "/Resource";
    href = (versionHasContent == true) ? href + "Review" : href + "Chooser";
    href = href + "?DocID=" + docID + "&VersionID=" +versionID+ "&Lang=" + langID;

    console.log("ContentURL" + href);

    //console.log("Going to the Document content editor for id " + docID + " and type " + docType + " and language " + langID + " ... are you sure you want to proceed?");
    return href;
    //        this.location = href;
    //    }
}

//------------------------------------------------------------------------------------------------------------------------------------
function TagEditorURL() {

    // get the DocID ....
    var docID = +$('#DocID').val();

    var href ="/TagEditor?DocID="+docID;
    return href;
    //        this.location = href;
    //    }
}

//------------------------------------------------------------------------------------------------------------------------------------
// currently this is only called from the TagEditor page ...
function EditorURL() {

    // get the DocID ....
    var docID = +$('#DocID').val();
    //var docID = +webDocID;
//    var docType = +webDocType;

//    var href = (docType == 1) ? "/Standard" : "/Resource";
//    var href = href + "Editor?DocID="+docID;
    //    return href;
    return "Editor?DocID=" + docID;
    //        this.location = href;
    //    }
}



//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
// The following are all for document editing and language control ...
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//--
function AnimateWebDocFields() {

    console.log("Doing animation for the WebDoc");

    // and wire up the status change for the working title and organisation list ....
    $('#TBWorkingTitle').on('change', function (event, params) {
        FormDataChanged();
    });
    $('#TBOrg').on('change', function (event, params) {
        FormDataChanged();
    });
}

//--
function AnimateBlogFields() {

    console.log("Doing animation for the WebDoc");

    // and wire up the status change for the working title and organisation list ....
    $('#TBWorkingTitle').on('change', function (event, params) {
        console.log("TBWorkingTitle is changing");
        FormDataChanged();
    });
    $('#TBOrg').on('change', function (event, params) {
        console.log("TBOrg is changing");
        FormDataChanged();
        // And update the list of images ...
        DBXListImages();
    });
    // and wire up the status change for the working title and organisation list ....
    $('#TBStatus').on('change', function (event, params) {
        console.log("TBStatus is changing");
        FormDataChanged();
        StatusChangeBlog();
    });
    $('#TBImage').on('change', function (event, params) {
        console.log("TBImage is changing");
        FormDataChanged();
    });

    // TBGeogRegion
    // TBPublicationDate
}


function AnimateLanguageChooser() {
    //$("#TBLanguage").chosen();
    $('#TBLanguage').on('change', function (event, params) {
        console.log("TBLanguage is changing");

        // If the language field has changed, then something in this WebDocument has changed so flag this here ...
        FormDataChanged();

        //$('#TBLanguage_chosen').on('click', function () {
        console.log($("#TBLanguage").val() + "   " + params.selected + "    " + params.deselected);
        // OK here we will need to do stuff for confirming selection and deselection
        // we need to warn for the deselections ....

        // get the value from the list of options ...
        var selectedText = "";
        $("#TBLanguage option").each(function (random, obj) {
            if ((params.selected != null && params.selected != undefined && obj.value == params.selected)
                || (params.deselected != null && params.deselected != undefined && obj.value == params.deselected)) {
                //console.log(obj.text + " " + obj.value);
                selectedText = obj.text;
            }
        });

        if (params.selected != null && params.selected != undefined) {

            // ok this is a little hacky but here lets check to see if that content section already exists on the page 
            // - if it does, we don't want to readd it!!

            //console.log("The current html: \"" + $("#Lang_Section_" + params.selected).html() + "\"");
            var langSectionID = "Lang_Section_" + params.selected;
            var foundLangSection = false;
            $("#LanguageVersions").children().each(function () {
                var currentID = $(this).attr("id");
                console.log(currentID);
                if (currentID == langSectionID) {
                    foundLangSection = true;
                }
            });

            //var langSectionExists = ($("#Lang_Section_" + params.selected).html() != "");
            if (foundLangSection != "") {
                console.log("The language section already exists on the page, so there is no need to reAdd it...");
            } else {
                console.log("Adding language section for " + params.selected);
                AddLanguage(params.selected, selectedText);
            }
            //$('#TBCurrentLanguage').append($('<option>', {
            //    value: params.selected,
            //    text: selectedText
            //}));
        } else if (params.deselected != null && params.deselected != undefined) {

            // show warning
            console.log("Removing option " + params.deselected + "   " + selectedText);

            var docType = +$('#DocType').val();
            var docTextName = (docType == 1) ? "standard" : "resource";

            // Do a confirmation here and then proceed to these ...
            ShowConfirmation("LangRemoveConfirm", "Remove the " + selectedText + " version of this " + docTextName + "?",
                "Are you sure that you want to remove the " + selectedText + " version of this " + docTextName 
                + "?  This will remove all associated content with this language version.",
                "Yes", "RemoveLanguageSection('" + params.deselected + "')", "No", "ReAddLanguageOption('" + params.deselected + "')");

//            $("#TBCurrentLanguage option[value='" + params.deselected + "']").remove();
//            $("#TBCurrentLanguage").focus();

        }

    });
}

//--
function RemoveLanguageSection(langID) {

    $("#TBLanguage").blur();
    $("#TBLanguage").focus();

    // And then remove the specific section of language ...
    console.log( "Removing the section for "+langID+"...");

    $("#Lang_Section_" + langID).remove();

    // And a special case - if there are now no language versions add the default text back in:
    if ($("#LanguageVersions").children().length == 0) {
        $("#LanguageVersions").html("There are currently no language versions.");
    }

    //$("#LanguageVersions").remove("#Lang_Section_" + langID);
    HideConfirmation();
}
//--
function ReAddLanguageOption(langID) { //, langName) {

    console.log(langID);

    var selectedLangs = [];

    // Ok get all the other options that are selected and then readd them ...
    $("#TBLanguage option").each(function (random, obj) {
        if (obj.selected == true) {
            selectedLangs.push(obj.value);
        }
    });

    selectedLangs.push(langID);

    //$("#TBLanguage option[value=' + langID + ']").attr("selected", true); //.change();
    //$("#TBLanguage").val(langID); //.change();
    $("#TBLanguage").val(selectedLangs); //.change();
    $("#TBLanguage").trigger("chosen:updated");

    //$("#TBLanguage option").each(function (random, obj) {
    //    if (obj.value == langID) {
    //        console.log("SELECTED: " + obj.value);
    //        obj.selected = true;
    //    }
    //});

//    $('#TBLanguage').val(langID);
    //$("#TBLanguage").blur();
    //$("#TBLanguage").focus();
    //event.preventDefault();
    HideConfirmation();
}


//--
function AddLanguage(langID, langName) {

    //$('#TBCurrentLanguage').append($('<option>', {
    //    value: langID,
    //    text: langName
    //}));

    //AddLanguageSection(langID, langName);
//}


//--
//function AddLanguageSection(langID, langName) {

    var docType = +$('#DocType').val();

    var dataContent = "{languageID:" + JSON.stringify(langID) + ",docType:" + JSON.stringify(docType) + "}";

    $.ajax({
        type: "POST",
        url: "Code/HTMLFactory.asmx/LanguageSection",
        //async: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: dataContent,

        success: function (response) {

            // if this is the first language, then lets kill the initial text ...
            if ($("#TBLanguage").val().length == 1) {
                console.log("This is the first language to be added, so killing the no languages text ...");
                $("#LanguageVersions").html("");
            }

            console.log("AddLanguageSection success: " + response.d);
            ShowInfoSplash("Added section for " + langName + " language.", "InfoClassSuccess");
            window.setTimeout("HideInfoSplash();", 3000);

            // Hmmm this basically overwrote all the good binding we had already done - this version below is much better ...
            //$("#LanguageVersions").html($("#LanguageVersions").html() + response.d);
            $("#LanguageVersions").append(response.d);

            HideLockButtonsModal();

            AnimateLanguageSection(langID, docType);

            // And make sure to keep the session alive too..
            SessKeepAlivePoll();

        },
        failure: function (response) {
            // wire up the infoSplash ....
            //alert('failed to save the draft');
            console.log("AddLanguageSection error: " + response);
            HideLockButtonsModal();
        }
    });
}

//--
function AnimateLanguageSection(langID, docType) {

    console.log("Doing animation for " + langID + " and docType " + docType);
    // 4-Dec-16 - Always start by seting the remaining characters in the short description field...
    SetCharactersRemainingInDesc(langID);

    //console.log($('#TB_' + langID + '_iv'));

    // and wire up the status change from draft to live ....
    $('#TB_' + langID + '_i').on('change', function (event, params) {
        console.log("TBTitle for "+langID+" is changing");
        if (docType == 1 || docType == 2) {
            StatusChange(langID);
        } else {
            StatusChangeBlog(langID);
        }
        FormDataChanged();
    });
    // And then wire up the onchange of the other boxes ...
    $('#TB_' + langID + '_ii').on('change', function (event, params) {
        console.log("TBShortDesc for " + langID + " is changing");
        if (docType == 1 || docType == 2) {
            StatusChange(langID);
        } else {
            StatusChangeBlog(langID);
        }
        FormDataChanged();
    });
    // And then wire up the onchange of the other boxes ...
    $('#TB_' + langID + '_ii').on('keydown', function (event, params) {
        // So then lets update the number of characters remaining
        SetCharactersRemainingInDesc(langID);
    });

    if (docType == 1 || docType == 2) {
        // Standard or Resources ...
        $('#TB_' + langID + '_iii').on('change', function (event, params) {
            console.log("TBStatus for " + langID + " is changing");
            // 8-Dec-16 - Add the language switch here ...
            DoWebDocVersionLiveStart(langID);
            StatusChange(langID);
            FormDataChanged();
        });
        $('#TB_' + langID + '_iv').on('change', function (event, params) {
            console.log("TBPubDate for " + langID + " is changing");
            StatusChange(langID);
            FormDataChanged();
        });
        $('#TB_' + langID + '_iv').on('focus', function (event, params) {
            console.log("Focused: " + '#TB_' + langID + '_iv');
            calendarControlTriggerClick(this);
        });
        $('#TB_' + langID + '_iv').on('click', function (event) {
            console.log("Clicked: " + '#TB_' + langID + '_iv');
            showCalendarControl(event, this);
            //FormDataChanged();
        });

    } else {
        // News or training ...
        //$('#TB_' + langID + '_iii').trumbowyg();
        $('#TB_' + langID + '_iii').trumbowyg({
            //['insertImage'],
            //                 ['superscript', 'subscript'],
//            autocomplete:"off",
//            autocorrect: "off",
//            autocapitalize: "off",
//            spellcheck: "false",
            btns: [
                ['viewHTML'],
                ['formatting'],
                'btnGrp-semantic',
                ['link'],
                'btnGrp-justify',
                'btnGrp-lists',
                ['horizontalRule'],
                ['removeformat'],
                ['fullscreen']
            ]
        });
        
        $('#TB_' + langID + '_iii').on('change', function (event, params) {
            console.log("TBTrombowyg for " + langID + " is changing");
            StatusChangeBlog(langID);
            FormDataChanged();

            var html = $('#TB_' + langID + '_iii').trumbowyg('html');
            var hasContent = (html.length > 0) ? 1 : 0;
            $("#TB_" + langID + "_HasContent").val(hasContent);

        });

    }


}


//--
function SetCharactersRemainingInDesc(langID) {
    var charsRem = 200 - $('#TB_' + langID + '_ii').val().length;
    if (charsRem < 0) {
        charsRem = 0;
    }
    //console.log("TBShortDesc: " + charsRem + " characters remaining. " + $('#TB_' + langID + '_ii_CR').html());
    $('#TB_' + langID + '_ii_CR').html(charsRem);
}


//--
function AnimateTagFields() {

    // Iterate through the chapters ... note that this is one based ...
    for (var i = 0; i < chapterIDList.length; i++) {
        console.log("AnimateTagFields ChapterID:" + chapterID);
        // account for the zero based indices by taking off one ....
        var chapterID = chapterIDList[i];

        var tbID = "TB_ChapTags_" + (i+1); // chapterID;

        $('#' + tbID).on('change', function (event, params) {
            FormDataChanged();
        });
    }

//    chapterIDList.forEach(function (chapterID, index1) {      
//    });
}

//--
function DoTagSave(delayMessageDisplay) {

    var infoPopupMS = 100;
    if (delayMessageDisplay == true) {
        window.clearTimeout(infoSplashTimeoutID);
        infoPopupMS = 3000;
    }

    var jsonStr = "{docID:" + JSON.stringify(+$("#DocID").val()) + ",tags:[";
    var tagCount = 0;

    console.log("ChapterIDList length:" + chapterIDList.length);

    // Iterate through the chapters ... note that this is one based ...
    for (var i = 0; i < chapterIDList.length; i++) {
        // account for the zero based indices by taking off one ....
        var chapterID = chapterIDList[i];
        console.log("ChapterID:" + chapterID);

        // Get the list of tags for this chapter
        var tbID = "TB_ChapTags_" + (i + 1);

        console.log("Tag List:" + $("#" + tbID).val());

        $("#" + tbID).val().forEach(function (tagID, index2) {
            console.log(tagID + "   " + tagCount);
            if (tagCount++ > 0) {
                jsonStr = jsonStr + ",";
            }
            jsonStr = jsonStr + JSONTagBuilder(+tagID, +chapterID);
        });
    }

//    chapterIDList.forEach(function (chapterID, index1) {
//        console.log("ChapterID:" + chapterID);
        // Get the list of languages for this chapter
//    });
    jsonStr = jsonStr + "]}";

    console.log(jsonStr);

    $.ajax({
        type: "POST",
        url: "Code/SaveData.asmx/SaveWebDocTags",
        //async: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonStr,

        success: function (response) {

            console.log("DoTagSave: " + response.d);

            // check that the first number is numeric, otherwise there were problems saving this
            if (response.d == "nochange") {
                window.setTimeout('ShowInfoSplash("The tag information provided has not changed, so no need to save it again!", "InfoClassWarning");', infoPopupMS);
            } else if (response.d == "notauthorised") {
                window.setTimeout('ShowInfoSplash("You are not authorised to edit tags for this document!", "InfoClassFailure");', infoPopupMS);
            } else if (response.d == "error" || response.d == "unknown") {
                window.setTimeout('ShowInfoSplash("A problem occurred when trying to save these tags.  Please check the information and try again", "InfoClassFailure");', infoPopupMS);
            } else {
                window.setTimeout('ShowInfoSplash("Saved tags at " + BuildPrettyDateString(new Date(), true), "InfoClassSuccess");', infoPopupMS);
            }
            window.scrollTo(0, 0);
            window.setTimeout("HideInfoSplash(3000);", infoPopupMS + 3000);
            HideLockButtonsModal();

            // And make sure to keep the session alive too..
            SessKeepAlivePoll();

            // And lastly lets let the user leave without a warning dialogue
            DoUnloadCheck = 0;


        },
        failure: function (response) {
            // wire up the infoSplash ....
            //alert('failed to save the draft');
            console.log("DoTagSave error: " + response);
            HideLockButtonsModal();

            // And lastly lets let the user leave without a warning dialogue
            DoUnloadCheck = 0;

        }
    });


}
//--
function JSONTagBuilder(tagID, chapterID) {

    console.log("JSONTagBuilder: " + tagID + "   " + chapterID);

    var tagJSON = "{"
    + "ID:" + JSON.stringify(tagID) + ","
    + "ChapterID:" + JSON.stringify(chapterID) + ","
    + "Name:" + JSON.stringify("")
    + "}";

    return tagJSON;
}

//------------------------------------------------------------------------------------------------------------------------------------
function StatusChange(langID) {
    var success = true;

    // get the current status - if it is live, then show the warning and validate all the inputs for the language ...
    var status = +$('#TB_' + langID + '_iii').val();

    console.log("Current status: " + langID);

//    if (status == 2) {

        // Show the warning

    var isStandardOrResource = (+$("#DocType").val() == 1 || +$("#DocType").val() == 2);

    //success = ValidateLanguage(langID, true);
    success = ValidateLanguage(langID, isStandardOrResource);

//    } else {
        // clear the warnings, if they are there
//        $('#TB_' + langID + '_i_Warning').html("");
//        $('#TB_' + langID + '_ii_Warning').html("");
//        $('#TB_' + langID + '_iii_Warning').html("");
        // Note that these last two will only apply for standards and resources
//        $('#TB_' + langID + '_iv_Warning').html("");
//        $('#TB_' + langID + '_v_Warning').html("");
//    }

    return success;
}

//------------------------------------------------------------------------------------------------------------------------------------
// Note that for News and Training, the langID will not always be passed in...
function StatusChangeBlog() {
    var success = true;

    // get the current status - if it is live, then show the warning and validate all the inputs for the language ...
    var status = +$('#TBStatus').val();
    var langs = $("#TBLanguage").val();

    console.log("Current blog status: " + status);

    console.log("TBStatus has changed");

//    if (status == 2) {

        success = true;
        // Show the warning
        langs.forEach(function (item, index) {
            success = success & ValidateLanguage(item, false);
        });

        if (success == false) {
            ShowInfoSplash("The information you have entered is not quite right.  Please review and fix the errors shown below and try again.", "InfoClassFailure");
            window.setTimeout("HideInfoSplash();", 3000);
            window.scrollTo(0, 0);
        }
        
//    } else {
        // clear the warnings, if they are there
//        langs.forEach(function (item, index) {
//            $('#TB_' + item + '_i_Warning').html("");
//            $('#TB_' + item + '_ii_Warning').html("");
//            $('#TB_' + item + '_iii_Warning').html("");
//        });
//    }

    return success;
}


//--
function ValidateLanguages() {
    var success = false;
    // loop through all the languages
    var langs = $("#TBLanguage").val();

    if (langs.length == 0) {

        // show an errror here  - hmmm this will already be caught by the checks on the languages field ...
        //                ShowInfoSplash("No languages have been chosen!", "InfoClassFailure");
    } else {
        success = true;
        langs.forEach(function (item, index) {
            success = success & StatusChange(item);
        });

        if (success == false) {
            ShowInfoSplash("The information you have entered is not quite right.  Please review and fix the errors shown below and try again.", "InfoClassFailure");
            window.setTimeout("HideInfoSplash();", 3000);
            window.scrollTo(0, 0);
        }
    }


    return success;
}


//--
function ValidateLanguage(langID, isStandardOrResource) {
    var success = false;

    //
    var title = $('#TB_' + langID + '_i').val();
    var titleError1 = ValidateField("TB_" + langID + "_i_Warning", (title != ""), "Please include the title of the content.");
    if (titleError1 == true) {
        success = ValidateField("TB_" + langID + "_i_Warning", (title.length <= 100), "The title should be a maximum of 100 characters.");
    } else {
        success = false;
    }

    console.log("After title: " + success + "   isStandardOrResource:" + isStandardOrResource);

    //
    var desc = $('#TB_' + langID + '_ii').val();

    console.log("Validate language - descr length: " + desc.length);
    var descError1 = ValidateField("TB_" + langID + "_ii_Warning", (desc != ""), "Please enter a short description of this content.");
    if (descError1 == true) {
        success = success & ValidateField("TB_" + langID + "_ii_Warning", (desc.length <= 200), "This short description should be a maximum of 200 characters.");
    } else {
        success = false;
    }

    if (isStandardOrResource == true) {
        //
        var status = +$('#TB_' + langID + '_iii').val();
        success = success & ValidateField("TB_" + langID + "_iii_Warning", (status != 0), "Choose the status of this content.");

        //
        var pubDate = $('#TB_' + langID + '_iv').val();
        var pubDateError1 = ValidateField("TB_" + langID + "_iv_Warning", (pubDate != ""), "Please enter the publication date of this content.");
        if (pubDateError1 == true) {
            var regEx = new RegExp("^[0-9]{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [1-2][0-9]{3}$");
            var regExResult = regEx.exec(pubDate);
            console.log("Regex test: " + regExResult + "  " + (!(regExResult == null || regExResult == "")) + "   |" + pubDate + "|");
            success = success & ValidateField("TB_" + langID + "_iv_Warning", (!(regExResult == null || regExResult == "")), "Please use the date selector to create the dates (e.g. '01 Jan 2008').");
        } else {
            success = false;
        }

        // only do this one if it is live!
        if (status == 2) {
            var contentLoaded = +$('#TB_' + langID + '_HasContent').val();
            success = success & ValidateField("TB_" + langID + "_v_Warning", (contentLoaded == 1), "This version of the document has no content!  Load the content for this version before making it live.");
        }
    } else {

        // only do this one if it is live!
        var status = +$('#TBStatus').val();

        console.log("Article or opportunity status:" + status);
        if (status == 2) {
            var contentLoaded = ($("#TB_" + langID + "_iii").trumbowyg('html').length > 0);
            console.log("Article or opportunity contentIsLoaded:" + contentLoaded);
            success = success & ValidateField("TB_" + langID + "_iii_Warning", (contentLoaded == true),
                "There is no content currently for this language! Use the what-you-see-is-what-you-get (WYSIWYG) editor below to create the content for this language.");
        }
    }

    return success;
}

//--
function ValidateField(id, success, errorMsg) {
    console.log("ValidateField: " + id + "   " + success + "   " + errorMsg);
    if (success == false) {
        $('#' + id).html(errorMsg);
    } else {
        $('#' + id).html("");
    }
    return success;
}




//-- -2, -1, 1 or 2 
function NavigateTo(relativeDirection, contentID, webDocID, webDocVersionID) {

    // The relative directions are from the review buttons
    var index = -1; // the default for the contents pages...
    if (relativeDirection == -2) {
        index = 0;
    } else if (relativeDirection == -1) {
        index = 1;
    } else if (relativeDirection == 1) {
        index = 2;
    } else if (relativeDirection == 2) {
        index = 3;
    }

    console.log(index);

    if (index != -1) {
        contentID = navigationContentIDs[index];
    }

    console.log(contentID + "   " + webDocID + "   " + webDocVersionID);

    // So now if we have a contentID, then go with loading a specific page ... otherwise if we have a webDocID and webDocVersionID, then reload the contents page
    // Otherwise do NADA ....
    if (contentID > 0) {
        LoadWebDocContentHTML(contentID);
    } else if (webDocID > 0 && webDocVersionID > 0) {
        LoadWebDocContentsPage(webDocID, webDocVersionID);
    } else {
        // DOOOO NOTHING
    }

}
//--
function LoadWebDocContentHTML(webDocContentID) {

    var dataStr = "{webDocContentID:" + JSON.stringify(+webDocContentID) + "}";

    console.log(dataStr);

    // So now suck at the new page content using the HTMLFactory
    $.ajax({
        type: "POST",
        url: "/Code/HTMLFactory.asmx/ContentSection",
        //async: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: dataStr,

        success: function (response) {

            // and then disable or enable the links based on the new navigationContentIDs
            console.log("LoadWebDocContentHTML: " + response.d);

            $("#WDContentPlaceHolder").html(response.d);
            // And make sure to keep the session alive too..
            SessKeepAlivePoll();

            ShowOrHideReviewNavigationButtons();

        },
        failure: function (response) {
            console.log("NavigateTo error: " + response);
            ShowInfoSplash("Failed to load contents section.  Please try again.", "InfoClassFailure");
            window.setTimeout("HideInfoSplash(3000);", 3000);
        }
    });

}
//--
function LoadWebDocContentsPage(webDocID, webDocVersionID) {

    var dataStr = "{webDocID:" + JSON.stringify(+webDocID) + ",webDocVersionID:" + JSON.stringify(+webDocVersionID) + "}";

    console.log(dataStr);

    // So now suck at the new page content using the HTMLFactory
    $.ajax({
        type: "POST",
        url: "/Code/HTMLFactory.asmx/ContentsPage",
        //async: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: dataStr,

        success: function (response) {

            // and then disable or enable the links based on the new navigationContentIDs
            console.log("LoadWebDocContentsPage: " + response.d);

            $("#WDContentPlaceHolder").html(response.d);
            // And make sure to keep the session alive too..
            SessKeepAlivePoll();

            // 5-Dec-16 - Reset the navigation Content ID links to the start once the content page is clicked...
            // no no no no - lets do this on the client side ...
            //navigationContentIDs = [0, 0, webDocChapterID, webDocChapterID];          
            ShowOrHideReviewNavigationButtons();
        },
        failure: function (response) {
            console.log("NavigateTo error: " + response);
            ShowInfoSplash("Failed to load contents page.  Please try again.", "InfoClassFailure");
            window.setTimeout("HideInfoSplash(3000);", 3000);
        }
    });

}
//--
function ShowOrHideReviewNavigationButtons() { //isContentsPage) {

    if (typeof(navBarTxt) !== "undefined") {
        $("#WDNavBar").html(navBarTxt);
    }

    //if (isContentsPage == false && typeof(navigationContentIDs) !== "undefined") {
    if (typeof (navigationContentIDs) !== "undefined") {

        var isDisabled = (navigationContentIDs[0] == 0) ? true : false;
        SetButton("PrevC", isDisabled);

        isDisabled = (navigationContentIDs[1] == 0) ? true : false;
        SetButton("PrevS", isDisabled);

        isDisabled = (navigationContentIDs[2] == 0) ? true : false;
        SetButton("NextS", isDisabled);

        isDisabled = (navigationContentIDs[3] == 0) ? true : false;
        SetButton("NextC", isDisabled);

    } else {
        // This is a contents page, so go with the defaults ...
        SetButton("PrevC", true);
        SetButton("PrevS", true);
        SetButton("NextS", false);
        SetButton("NextC", false);
    }

}
//--
function SetButton(btnID, isDisabled) {

    var classToAdd = (isDisabled == true) ? "ReviewBtnDisabled" : "ReviewBtn";
    var classToRemove = (isDisabled == false) ? "ReviewBtnDisabled" : "ReviewBtn";

    if ($("#" + btnID + "1").hasClass(classToRemove)) {
        $("#" + btnID + "1").removeClass(classToRemove);
    }
    $("#" + btnID + "1").addClass(classToAdd);

    if ($("#" + btnID + "2").hasClass(classToRemove)) {
        $("#" + btnID + "2").removeClass(classToRemove);
    }
    $("#" + btnID + "2").addClass(classToAdd);

}

//--
var isFullPage = false;
function ToggleFullPage() {
    isFullPage = !isFullPage;

    var cssDisplay = "";
    var txt = "&laquo; Show full page &raquo;";
    if ( isFullPage == true) {
        cssDisplay = "none";
        txt = "&raquo; Hide full page &laquo;";
    }

    $("#SiteHeader").css("display", cssDisplay);
    $("#SiteFooter").css("display", cssDisplay);
    $("#DocReviewIntro").css("display", cssDisplay);
    
    $("#TogFP").html(txt);
}


//------------------------------------------------------------------------------------------------------------------------------------
function DoWebDocDeleteStart() {

    //console.log("Pressed do delete - need some fancy confirmation here now");

    var docID = +$('#DocID').val();
    var docType = +$('#DocType').val();
    var docTextName = WebDocTypeText(docType, false); // (docType == 1) ? "standard" : "resource";

    // Do a confirmation here and then proceed to these ...
    ShowConfirmation("DeleteConfirmation", "Delete an entire " + docTextName + "?",
        "Are you sure that you want to delete this <i>entire " + docTextName + "</i>, including all language versions, content and associated tags?",
        "Yes", "DoWebDocDeleteFinish()", "No", "HideConfirmation()");

}
//------------------------------------------------------------------------------------------------------------------------------------
function DoWebDocDeleteFinish() {
    //console.log("Doing the finish of the delete requested action ...");

    // now here do we the old school postback as the current content wont exist once it has been deleted ...
    $("#DoDelete").val("1");

    ShowLockButtonsModal();
    // Clear the exit path for the form to submit!
    DoUnloadCheck = 0;
    document.forms[0].submit();
    
//    HideConfirmation();

}

//------------------------------------------------------------------------------------------------------------------------------------
function DoWebDocVersionLiveStart(langID) {

    //console.log("Pressed do delete - need some fancy confirmation here now");

    var docID = +$('#DocID').val();

    var messageExtended = "";
    var messageSuffix = "";
    if (DataContext == "DE") {
        var status = +$("#TB_" + langID + "_iii").val();
        if (status != 2) {
            return;
        }
        messageExtended = "It is recommended that you first review the content of this language version before making it live.  ";
    } else {
        messageSuffix = "<br /><br />";
    }

    // Do a confirmation here and then proceed to these ...
    ShowConfirmation("LiveConfirmation", "Make this version live?",
        messageExtended + "Are you sure that you want to make this language version live?" + messageSuffix,
        "Yes", "DoWebDocVersionLiveFinish('"+langID+"')", "No", "DoWebDocVersionLiveCancel('"+langID+"')");
    
}
//------------------------------------------------------------------------------------------------------------------------------------
function DoWebDocVersionLiveFinish(langID) {
    //console.log("Doing the finish of the delete requested action ...");
    // DataContext - DE versus DR
   

    if (DataContext == "DE") {
        // Do nothing as it has already been set!
        HideConfirmation();
    } else {

        // now here do we the old school postback as the current content wont exist once it has been deleted ...
        $("#DoLive").val("1");

        ShowLockButtonsModal();
        // Clear the exit path for the form to submit!
        DoUnloadCheck = 0;
        document.forms[0].submit();

        //    HideConfirmation();
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
function DoWebDocVersionLiveCancel(langID) {

    if (DataContext == "DE") {
        $("#TB_" + langID + "_iii").val("1");            
    }
    
    HideConfirmation();
}



//------------------------------------------------------------------------------------------------------------------------------------
function DoTagDeleteStart(tagID, tagName) {
    // Do a confirmation here and then proceed to these ...
    ShowConfirmation("DeleteConfirmation", "Delete tag?",
        "Are you sure that you want to delete the selected tag '" + tagName + "' and all corresponding cross-references?<br/><br/>",
        "Yes", "DoTagDeleteFinish(" + tagID + ")", "No", "HideConfirmation()");
}
//------------------------------------------------------------------------------------------------------------------------------------
function DoTagDeleteFinish(orgID) {
    console.log("Doing the finish of the delete requested action ...");

    // now here do we the old school postback as the current content wont exist once it has been deleted ...
    $("#DoDelete").val(orgID);

    ShowLockButtonsModal();
    // Clear the exit path for the form to submit!
    DoUnloadCheck = 0;
    document.forms[0].submit();

    //    HideConfirmation();

}



//------------------------------------------------------------------------------------------------------------------------------------
function DoOrganisationDeleteStart(orgID, orgName) {
    // Do a confirmation here and then proceed to these ...
    ShowConfirmation("DeleteConfirmation", "Delete organisation?",
        "Are you sure that you want to delete the selected organisation '"+orgName+"'?<br/><br/>",
        "Yes", "DoOrganisationDeleteFinish("+orgID+")", "No", "HideConfirmation()");
}
//------------------------------------------------------------------------------------------------------------------------------------
function DoOrganisationDeleteFinish(orgID) {
    console.log("Doing the finish of the delete requested action ...");

    // now here do we the old school postback as the current content wont exist once it has been deleted ...
    $("#DoDelete").val(orgID);

    ShowLockButtonsModal();
    // Clear the exit path for the form to submit!
    DoUnloadCheck = 0;
    document.forms[0].submit();

    //    HideConfirmation();

}




//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
// Dropbox visualisation
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------
function DBXListOrganisationIcons() {

    // Get the async csv list of icons for the dropdownlist...
    $.ajax({
        type: "POST",
        url: "/Code/HTMLFactory.asmx/DropboxIconList",
        //async: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: {},

        success: function (response) {

            // And the last thing to do here is update the IDs for the docID and the languages .... using the response.d csv list of IDs...
            var iconArray = response.d.split(",");
            //console.log("OrgAdmin: " + response);
            console.log("OrgAdmin: " + response.d);

            $('#TBIcon').append($('<option>', { value: "", text: "Please choose ..." }));
            iconArray.forEach(function (item, index) {
                $('#TBIcon').append($('<option>', { value: item, text: item }));
            });

            $("#LoadingIcon").css("display", "none");

            $('#TBIcon').on('change', function (event, params) {
                $("#TBIconSelected").val($("#TBIcon").val());
            });


            // Set the list and hide the loading icon

        },
        failure: function (response) {
            console.log("SaveDraft error: " + response);
        }
    });

}

//------------------------------------------------------------------------------------------------------------------------------------
function DBXListImages() {

    // Only do the call back if we have something already...
    var orgID = +$("#TBOrg").val();

    if (orgID > 0) {

        $("#LoadingIcon").css("display", "inline");

        var jsonOrg = "{orgID:" + JSON.stringify(+orgID) + "}";
        console.log(jsonOrg);

        // Get the async csv list of icons for the dropdownlist...
        $.ajax({
            type: "POST",
            url: "/Code/HTMLFactory.asmx/DropboxBlogImages",
            //async: true,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: jsonOrg,

            success: function (response) {

                // And the last thing to do here is update the IDs for the docID and the languages .... using the response.d csv list of IDs...
                var iconArray = response.d.split(",");
                //console.log("OrgAdmin: " + response);
                console.log("BlogContentEditor: " + response.d);

                $("#TBImage").empty();
                $('#TBImage').append($('<option>', { value: "", text: "Please choose ..." }));
                iconArray.forEach(function (item, index) {
                    $('#TBImage').append($('<option>', { value: item, text: item }));
                });

                $("#LoadingIcon").css("display", "none");

                // Add the existing image if there is one ...
                var existingImage = $("#TBImageSelected").val();
                if (existingImage != null && existingImage != "") {
                    $("#TBImage").val(existingImage);
                }

                $('#TBImage').on('change', function (event, params) {
                    $("#TBImageSelected").val($("#TBImage").val());
                });


                // Set the list and hide the loading icon

            },
            failure: function (response) {
                console.log("SaveDraft error: " + response);
            }
        });
    } else {
        $("#LoadingIcon").css("display", "none");
    }
}


//------------------------------------------------------------------------------------------------------------------------------------
function DBXDocumentChooser() {

    if (typeof(DBXFigurePath) !== "undefined") {
        // This is the response after a postback, and we have used the cached version of the DBX files to make the rendering quicker.
        // But I think we still need to call this which activates the onclick of the folders in the ul lists.
        DBXSetup();

    } else {

        // Get the async csv list of icons for the dropdownlist...
        $.ajax({
            type: "POST",
            url: "/Code/HTMLFactory.asmx/DropboxFileChooser",
            //async: true,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: {},

            success: function (response) {

                //console.log("OrgAdmin: " + response);
                console.log("DBXChooser: " + response.d);

                $("#DBXChooser").html(response.d);
                DBXSetup();
            },
            failure: function (response) {
                console.log("DBXChooser error: " + response);
            }
        });
    }

}

//--
function DBXRefreshList() {
//    ShowLockButtonsModal();
    //    this.location = this.location.href;
    $("#DBXChooser").html( "<img src=\"/Images/Loading.gif\" width=\"24\" />");
    DBXDocumentChooser();
}



//------------------------------------------------------------------------------------------------------------------------------------
function DBXDisplayFigures() {

    if (typeof (DBXFigurePath) !== "undefined") {
        console.log("FigurePath: " + DBXFigurePath);
        var jsonFP = "{path:" + JSON.stringify(DBXFigurePath) + "}";
        //var jsonFP = JSON.stringify(DBXFigurePath);
        console.log( jsonFP );

        $("#DBXNoDoc").css("display", "none");

        // Get the async csv list of icons for the dropdownlist...
        $.ajax({
            type: "POST",
            url: "/Code/HTMLFactory.asmx/DropboxFigureList",
            //async: true,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: jsonFP,

            success: function (response) {

                //console.log("OrgAdmin: " + response);
                console.log("DBXDisplayFigures: " + response.d);

                $("#DBXFigureList").html(response.d);

                $("#DBXFigureLoadingIcon").css("display", "none");

            },
            failure: function (response) {
                console.log("DBXDisplayFigures error: " + response);
            }
        });
    } else {
        $("#DBXFigureLoadingIcon").css("display", "none");
    }
       
}

//------------------------------------------------------------------------------------------------------------------------------------
/* Dropbox file chooser */
function DBXToggler(liObj) {

    // see if this object has the DBXHidden class and toggle it on off respectively ...
    console.log("Doing toggle: " + liObj + "   " + liObj.hasClass("DBXHidden") + "   " + liObj.hasClass("DBXHidden"));

    if (liObj.hasClass("DBXWebDoc") == true || liObj.hasClass("DBXWebImage") == true || liObj.hasClass("DBXWebFigure") == true) {

        // this is a file, so get the path from the data attribute
        var fullFilePath = liObj.attr("data");
        console.log("Full file path: " + fullFilePath);
        $("#DBXFileChosen").val(fullFilePath);
        //$("#DBXFileChosen1").html(fullFilePath);
        //$("#DBXFileChosen1").focus();
        DoSubmit(true, false);

    } else {

        if (liObj.hasClass("DBXHidden") == true) {
            liObj.removeClass("DBXHidden");
        } else {
            liObj.addClass("DBXHidden");
        }
    }


}
//------------------------------------------------------------------------------------------------------------------------------------
/* Dropbox file chooser */
//function DBXSelectFile(theFileName) {

//    // now do something with this filename ....

//    console.log("Doing select: " + liObj);

//}

//------------------------------------------------------------------------------------------------------------------------------------
function DBXSetup() {
    console.log("Setting up DBX ...");
    $('.DBXFolder a').on('click', function (e) {
        e.preventDefault();
        DBXToggler($(this).parent());
    });

}


//------------------------------------------------------------------------------------------------------------------------------------
function DoSearch() {

}
//------------------------------------------------------------------------------------------------------------------------------------
function FilterSearch(objectType) {

}