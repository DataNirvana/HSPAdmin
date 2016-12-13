//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*
    Core site code used in all pages
    Edgar Scrase
    Copyright 2004 - 2016, all rights reserved
*/
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var jsVersion = 1.22;

// Checks if this is being viewed in a mobile (or tablet context)
// Useful browser check to help functionality to filter where there are STILL quirks!  Based on: http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
var isMobile = window.mobilecheck();

// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// At least Safari 3+: "[object HTMLElementConstructor]"
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
// Chrome 1+
var isChrome = !!window.chrome && !isOpera;
// Finds the specific version if IE since v5 - useful as HTML 5 functionality is only 12+
// http://tanalin.com/en/articles/ie-version-js/
// http://codepen.io/gapcode/pen/vEJNZN
// Original query much more succinct but does not work in IE12+
//var isIE = /*@cc_on!@*/false || !!document.documentMode;
function GetIEVersion() {
    var ieV = "";
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');

    if (document.all && !document.compatMode) {     // 5.x
        ieV = "IE v5";
    } else if (document.all && !window.XMLHttpRequest) {      // 6 or older
        ieV = "IE v6";
    } else if (document.all && !document.querySelector) {       // 7 or older
        ieV = "IE v7";
    } else if (document.all && !document.addEventListener) { // 8 or older
        ieV = "IE v8";
    } else if (document.all && !window.atob) { // 9 or older
        ieV = "IE v9";
    } else if (document.all || msie > 0) { // 10 or older
        // IE 10
        //ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        var v = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        ieV = "IE v" + v;
    } else if (trident > 0) {
        // IE 11
        //ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        var rv = ua.indexOf('rv:');
        var v = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        ieV = "IE v" + v;
    } else if (edge > 0) {
        // IE 12+ / Spartan
        //ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        var v = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        ieV = "IE v" + v;
    }
    return ieV;
}
var isIE = (GetIEVersion() != "");

// Check that the IE test still works in Edge...
console.log("IE test: " + isIE + "   " + GetIEVersion());

// checks if an array contains a particularly value

function Contains(a, obj) {
    if (a != null) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
    }
    return false;
}


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 0 = dont do a Information Not Saved Warning, 1 = do this on unload
// has to be referenced here rather than in the DataManipulation library as it is also called from CalendarControl and the SessionExpiryWarning here in Site.js
var DoUnloadCheck = 0;

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Go to the default page on session expiry ...
function DoAJAXSessionExpired() {
    this.location = "Default.aspx";
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
* easyModal.js v1.1.0
* A minimal jQuery modal that works with your CSS.
* Author: Flavius Matis

    Note that the default z-index for this overlay is 2000, so anything else must be more than this to be on top and visible - e.g. the Tooltips ...
*/
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
(function ($) {

    var methods = {
        init: function (options) {

            var defaults = {
                top: 'auto',
                autoOpen: false,
                overlayOpacity: 0.5,
                overlayColor: '#000',
                overlayClose: true,
                overlayParent: 'body',
                closeOnEscape: true,
                closeButtonClass: '.close',
                fadeSpeed: 1000, // Fade in and out speed in ms ...
                onOpen: false,
                onClose: false
            };

            options = $.extend(defaults, options);

            return this.each(function () {

                var o = options;

                var $overlay = $('<div class="lean-overlay"></div>');

                $overlay.css({
                    'display': 'none',
                    'position': 'fixed',
                    'z-index': 2000,
                    'top': 0,
                    'left': 0,
                    'height': 100 + '%',
                    'width': 100 + '%',
                    'background': o.overlayColor,
                    'opacity': o.overlayOpacity
                }).appendTo(o.overlayParent);

                var $modal = $(this);

                $modal.css({
                    'display': 'none',
                    'position': 'fixed',
                    'z-index': 2001,
                    'left': 50 + '%',
                    'top': parseInt(o.top) > -1 ? o.top + 'px' : 50 + '%'
                });

                $modal.bind('openModal', function () {
                    $(this).css({
                        'display': 'block',
                        'margin-left': -($modal.outerWidth() / 2) + 'px',
                        'margin-top': (parseInt(o.top) > -1 ? 0 : -($modal.outerHeight() / 2)) + 'px'
                    });
                    $overlay.fadeIn(o.fadeSpeed, function () {
                        if (o.onOpen && typeof (o.onOpen) === 'function') {
                            o.onOpen($modal[0]);
                        }
                    });
                });

                $modal.bind('closeModal', function () {
                    $(this).css('display', 'none');
                    $overlay.fadeOut(o.fadeSpeed, function () {
                        if (o.onClose && typeof (o.onClose) === 'function') {
                            o.onClose($modal[0]);
                        }
                    });
                });

                $overlay.click(function () {
                    if (o.overlayClose)
                        $modal.trigger('closeModal');
                });

                $(document).keydown(function (e) {
                    // ESCAPE key pressed
                    if (o.closeOnEscape && e.keyCode == 27) {
                        $modal.trigger('closeModal');
                    }
                });

                $modal.on('click', o.closeButtonClass, function (e) {
                    $modal.trigger('closeModal');
                    e.preventDefault();
                });

                if (o.autoOpen)
                    $modal.trigger('openModal');

            });

        }
    };

    $.fn.easyModal = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.easyModal');
        }

    };

})(jQuery);




//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*
    Lock screen used to stop people double clicking when lengthier processes have been requested!
    Edgar Scrase
    Copyright 2004 - 2016, all rights reserved
    520 bytes that will now not be loaded in each and every page!
    18-Apr-2016 - added the ability to dynamically set the background color as there are now some cases where we dont want a background colour
    e.g. when pages changing quickly as it looks too jumpy!
*/
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//------------------------------------------------------------------------------------------------------------------------------------
//--  Normally called in document.ready.  Initialises the modal div with the easy modal triggers
// Background color is customisable
function InitialiseLockButtonsModal(customBackgroundCol) {

    var backgroundCol = (customBackgroundCol == null || customBackgroundCol == "") ? "#333" : customBackgroundCol;

    // special case if the backgroundCol is "transparent", then we need to set the overlayOpacity to zero too
    var opacity = (backgroundCol.toLowerCase() == "transparent") ? 0.0 : 0.3;

    // If the top is not set, then it will automatically set to the middle of the page, which is what we want ...
    $("#LBD").easyModal({
        autoOpen: false,
        fadeSpeed: 300,
        overlayOpacity: opacity,
        overlayColor: backgroundCol,
        overlayClose: true,
        closeOnEscape: true
    });
}
//--
function ShowLockButtonsModal(customBackgroundCol) {

    InitialiseLockButtonsModal(customBackgroundCol);

    $("#LBD").css("display", "inline");
    $("#LBD").trigger("openModal");
}
//--
function HideLockButtonsModal() {
    $("#LBD").css("display", "none");
    $("#LBD").trigger("closeModal");
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*
    Session expiry window - when the user reaches a predefined time limit on the page (probably the session expiry limit minus the 2 minute countdown period at the end),
    a modal window pops up with the session expiry window, giving the user the option to stay logged in or to log out.
    The modal window helpfully counts down the remaining time before the session is ended.

    This is the javascript to help facilitate the html in the SessionExpiryWarning user control.
    It is included here as then this is 2,584 bytes that will now not be loaded in each and every page!

    Edgar Scrase
    Copyright 2013 - 2016, all rights reserved
*/
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// The timeout IDs
var sessTOID1 = "";
var sessTOID2 = "";
// The default document title and its temporary replacement.  These are used to "blink" the title to draw attention that that tab's content is expiring.
var sessDocTitle = document.title;
var sessDocTitleTemp = "Session Expiring";
// The timeout duration (probably the session expiry limit minus the 2 minute countdown period at the end)
var sessTimeoutMS = 0;
// The countdown period
var sessDefaultCountdown = 120;
// The counter used to store the countdown if this expiry warning limit is reached
var sessFinalCountdown = 120;
// The two "outcome" URLs, one to keep the session alive and one to manage the logout
var sessKeepAliveURL = "";
var sessLogoutURL = "";
// The time when the page containing this JS was first loaded.
var sessPageStartMS = 0;
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    This function starts the session timeout check within a page.  Simply sets the current time in the page and calls the next method in the chain
    (ShowSessTimeoutModal)
*/
function StartSessTimeout() {
    sessPageStartMS = (new Date()).getTime();
    sessTOID1 = window.setTimeout("ShowSessTimeoutModal();", sessTimeoutMS);
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Displays the session time out warning and checks whether the session has timed out.  If it has, the user is redirected to the logout page.
    Otherwise the session countdown is initiated.
*/
function ShowSessTimeoutModal() {

    //-----a----- Display the session timeout warning
    $("#SessDiv").css("display", "inline");
    $("#SessDiv").trigger("openModal");

    //-----b----- If the session has timed out, then lets logout immediately, otherwise, we start the countdown to the actual session expiry
    if (SessHasTimedOut()) {
        SessLogout();
    } else {
        SessCountdown(false);
    }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    This function determines if too much time has elapsed and the session has therefore timed out.
    It does this by comparing the server side set session interval with the current time and the time when the page was first loaded.
    Returns true if it has timed out.
*/
function SessHasTimedOut() {
    var nowMS = (new Date()).getTime();
    // Determine whether the current time less the time when the page first loaded is more than the timeout interval (normally 58 mins) plus the session countdown at the end (normally two mins)
    var hasTimedOut = ((nowMS - sessPageStartMS) > (sessTimeoutMS + (sessDefaultCountdown * 1000)));
    //console.log((nowMS - sessPageStartMS) + "    " + sessTimeoutMS + "    " + (sessTimeoutMS + (sessDefaultCountdown * 1000)));

    return hasTimedOut;
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Conducts one iteration of the countdown, by toggling the title of the tab to raise awareness if the user is browsing elsewhere, and also
    updates the session countdown number of seconds in the modal window.
    To finish, the method calls itself to repeat every second.
    doDefault is a boolean that determines which title to show (the warning or the default title)
*/
function SessCountdown(doDefault) {
    //-----a----- reduce the number of seconds by one and logout if we reach zero OR the elapsed time from the page load is too great.
    // The second option could happen if e.g. the user is browsing from a laptop, closed the laptop partway through the warning message and then reopened it
    // some minutes/hours/days later by which time the session has of course expired.
    sessFinalCountdown--;
    if (sessFinalCountdown < 0 || SessHasTimedOut()) {
        SessLogout();
    } else {
        //-----b----- Set the html
        $("#CountDown").html("" + sessFinalCountdown);
        //-----c----- Set the document title
        document.title = (doDefault) ? sessDocTitle : sessDocTitleTemp;
        //-----d----- Call this method again in one seconds time, and reverse the doDefault method
        sessTOID2 = window.setTimeout("SessCountdown(" + !doDefault + ");", 1000);
    }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Called when the user says "I want to stay in this session", showing they are still actively browsing.
    All it does is close the modal window.  If you look at the OnReady code at the bottom of this library, you will see that closing the modal
    window triggers the SessKeepAlivePoll method automatically, which actually posts to the server to make sure the session is reinvigorated.
*/
function SessKeepAlive() {
    $("#SessDiv").trigger("closeModal");
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Does the ajax call to the server to request a page deriving from the MGLBasePage, that keeps the session alive.
*/
function SessKeepAlivePoll() {
    $.ajax({
        url: sessKeepAliveURL,
        //async: true,
        cache: false,
        data: null,
        success: SessKeepAlivePollSuccess
    });
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Once the response is recieved from the SessKeepAlivePoll call, this method is triggered.
    All this method does is reset all the window timeout calls if any are still active, reset the document title and the session countdown.
    MOST IMPORTANTLY, this method then calls the first method StartSessTimeout, to reset the page load time so that we have a new "zero"
    time for the session.
*/
function SessKeepAlivePollSuccess() {
    SessKeepAliveFinish();
    sessFinalCountdown = sessDefaultCountdown;
    StartSessTimeout();
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Cleans up the page timeouts and resets the document title.  Called if the user has requested to keep the session alive and onBeforeUnload
    if another page has been requested.
*/
function SessKeepAliveFinish(e) {
    window.clearTimeout(sessTOID1);
    window.clearTimeout(sessTOID2);
    document.title = sessDocTitle;
    return;
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    If the session has expired, this method is called and if the beforeUnload is bound, this is unbound and any constraints on the page
    unloading (e.g. the DoUnloadCheck) are also removed.  The method then redirects the user to the logout page.
*/
function SessLogout() {
    $(window).unbind('beforeunload');
    if (typeof DoUnloadCheck !== 'undefined') {
        DoUnloadCheck = 0;
    }
    window.location = sessLogoutURL;
}




//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    InfoSplash javascript to turn on and off the views ...
    Edgar Scrase
    Copyright 2004 - 2016, all rights reserved
    469 bytes that will now not be loaded in each and every page!
*/
//var InfoSplashWrapperID = "";
//var InfoSplashContentID = "";

//--
function ShowInfoSplash(message, displayClass) {
    $('#InfoSplash').attr("class", "InfoClassWrapper");
    $('#InfoSplashContent').attr("class", displayClass);
    $('#InfoSplashContent').html("");
    // 30-Mar-2016 - always add a line feed onto the end of the infosplash if it is not already there ...
    // 21-Apr-2016 - now we are using sandwich top and bottom margins these line feeds are not really needed anymore
    //    if (message.endsWith("<br />") == false) {
    //        message = message + "<br />";
    //    }
    $('#InfoSplashContent').html(message);
    //$('#InfoSplash').css("display", "inline");
    $('#InfoSplashContent').css("display", "inline");
    $('#InfoSplash').focus();
}
//--
function HideInfoSplash(timeMS) {
    if (timeMS == null || timeMS == 0) {
        timeMS = 3000;
    }

    // Reset the class as well just to be sure
    window.setTimeout("$('#InfoSplash').attr('class', 'Nada');", timeMS);

    //$('#InfoSplash').attr("class", "Nada");
    //console.log("ID:" + InfoSplashWrapperID);

    //$('#InfoSplash').fadeOut(timeMS);
    $('#InfoSplashContent').fadeOut(timeMS);
}




//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Functions that are used in almost all pages follow
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Local storage methods - most are specific to the photo management
    Edgar Scrase
    Copyright 2015 - 2016, all rights reserved
    Check for local storage  if (storageAvailable('localStorage')) {
*/
function StorageAvailable(type) {
    try {
        var storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Used in sites like IDPGrievances to ensure that two sibling divs have the same height - e.g. a main page and a sidebar.

    Edgar Scrase
    Copyright 2013, all rights reserved
*/
function UpdateDivLengthOnResize() {

    var ele1 = document.getElementById("DefaultTable");
    var elem1Rect = ele1.getBoundingClientRect();
    //var bodyRect = document.body.getBoundingClientRect();
    var ele2 = document.getElementById("PositionFinder");
    var elem2Rect = ele2.getBoundingClientRect();
    //var offset = elemRect.top - bodyRect.top;

    // Calculate the offset height as the top of the position finder div - the top of the containing table
    var offset = elem2Rect.bottom - elem1Rect.top;
    var minHeight = 600;
    //    console.log(offset + "   " + elem1Rect.top + "   " + elem2Rect.top);
    if (offset < minHeight) { offset = minHeight };
    $("#MainDiv").height(offset);
    $("#SideDiv").height(offset);
}



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    Checks if a css class rule has been defined in the current context
    REMEMBER to add the "." or "#" when passing in the classToCheck ....!

    Edgar Scrase
    Copyright 2016, all rights reserved
    http://stackoverflow.com/questions/983586/how-can-you-determine-if-a-css-class-exists-with-javascript
    document.styleSheets[].rules[].selectorText
    document.styleSheets[].imports[].rules[].selectorText
*/
function CssClassExists(classToCheck) {
    // check that we have some stylesheets to check!
    if (document.styleSheets == null) {
        // This is surely some kind of disaster, but lets return true for now!
        return true;
    } else {

        // loop through the stylesheets, if there are more than one
        for (var i = 0; i < document.styleSheets.length; i++) {
            // loop through the rules in each of these stylesheets
            var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;

            if (rules == null) {
                // This is surely some kind of disaster, but lets return true for now!
                return true;
            } else {
                for (var j = 0; j < rules.length; j++) {
                    // compare the selectorText with the text provided into the method ...
                    var tempTxt = rules[j].selectorText;
                    //            console.log(tempTxt);
                    if (tempTxt == classToCheck) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Animates the hover over for the MGLK buttons, the linkObj is a jQuery object and isHover is true for the OnHover, otherwise false
function ResetHoverImage(linkObj, isHover) {

    //var im = $(this).find('img');
    if (linkObj != null) {
        var im = linkObj.find('img');

        if (isHover == true) {
            if (im != null) {
                var cSrc = im.attr('src');
                var hSrc = cSrc.replace(".png", "H.png").replace(".jpg", "H.jpg").replace(".gif", "H.gif");
                im.attr('src', hSrc);
            }
        } else {
            if (im != null) {
                var hSrc = im.attr('src');
                var cSrc = hSrc.replace("H.png", ".png").replace("H.jpg", ".jpg").replace("H.gif", ".gif");
                im.attr('src', cSrc);
            }
        }
    }
}



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Used in the BlogContentEditor Page
function CheckContentLength(source, args) {
    var clientID = source.controltovalidate;
    var val = $("#" + clientID).val();
    if (val != null && val.length < 100) {
        args.IsValid = true;
    } else {
        args.IsValid = false;
    }
}


//------------------------------------------------------------------------------------------------------------------------------------
// Fires if ther are any unsave changes on the page and stops users inadvertently leaving the page without warning them they will lose all their data
function OnBeforeUnloadHandler(e) {

    // DoUnloadCheck is set on the server side in the specific controls ...
    if (DoUnloadCheck == 1) {
        return "Warning!  You have made changes to the information in this page, which have not yet been saved.  If you leave this page now, these changes will be lost.  Do you really want to leave now?";
    } else {
        // Don't return anything makes IE work well ....!!!!
    }
}




//------------------------------------------------------------------------------------------------------------------------------------
function ShowConfirmation(snippetID, titleTxt, blurbTxt, leftButtonTxt, leftButtonJSAction, rightButtonTxt, rightButtonJSAction) {

    var jsonStr = "{snippetID:" + JSON.stringify(snippetID)
        + ",titleTxt:" + JSON.stringify(titleTxt)
        + ",blurbTxt:" + JSON.stringify(blurbTxt)
        + ",leftButtonTxt:" + JSON.stringify(leftButtonTxt)
        + ",leftButtonJSAction:" + JSON.stringify(leftButtonJSAction)
        + ",rightButtonTxt:" + JSON.stringify(rightButtonTxt)
        + ",rightButtonJSAction:" + JSON.stringify(rightButtonJSAction)
        + "}";

    console.log(jsonStr);

    $.ajax({
        type: "POST",
        url: "/Code/HTMLFactory.asmx/ShowConfirmation",
        //async: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonStr,

        success: function (response) {

            //console.log("ShowConfirmation: " + response.d);
            console.log("ShowConfirmation: " + response.d);

            $("#SiteConfirmation").html(response.d);
            $("#SiteConfirmation").css("display", "inline");
            $("#SiteConfirmation").trigger("openModal");

        },
        failure: function (response) {
            // wire up the infoSplash ....
            //alert('failed to save the draft');
            console.log("ShowConfirmation error: " + response);

        }
    });
}
//------------------------------------------------------------------------------------------------------------------------------------
function HideConfirmation() {
    // Just tidy up the confirmation window....
    $("#SiteConfirmation").trigger("closeModal");
    $("#SiteConfirmation").html("");
}
//------------------------------------------------------------------------------------------------------------------------------------
function HideConfirmationAuto() {
    // Just tidy up the confirmation window....
//    $("#SiteConfirmation").trigger("closeModal");
    $("#SiteConfirmation").html("");
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// All the generic JS that should be loaded ONCE the page has loaded ...
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).ready(function () {
    //-- Makes the MG Links interactive by triggering a mouse over / mouse out event when a user hovers over a MG link and then swaps out the subimage if it exists....
    $('.MGLK').hover(function () {
        ResetHoverImage($(this), true);

        //var im = $(this).find('.MGIM');
        //        var im = $(this).find('img');
        //        if (im != null) {
        //            var cSrc = im.attr('src');
        //            var hSrc = cSrc.replace(".png", "H.png").replace(".jpg", "H.jpg").replace(".gif", "H.gif");
        //            im.attr('src', hSrc);
        //        }
    }, function () {
        ResetHoverImage($(this), false);

        //        var im = $(this).find('img');
        //        //var im = $(this).find('.MGIM');
        //        if (im != null) {
        //            var hSrc = im.attr('src');
        //            var cSrc = hSrc.replace("H.png", ".png").replace("H.jpg", ".jpg").replace("H.gif", ".gif");
        //            im.attr('src', cSrc);
        //        }
    });


    //-- Setup the easyModal for the Session expiry warning div and make sure to call the SessKeepAlivePoll method to keep the session alive
    $("#SiteConfirmation").easyModal({
        autoOpen: false,
        overlayOpacity: 0.3,
        overlayColor: "#333",
        overlayClose: true,
        closeOnEscape: true,
        onClose: HideConfirmationAuto
    });

    //-- Setup the easyModal for the Confirmation div and make sure to call the SessKeepAlivePoll method to keep the session alive
    $("#SessDiv").easyModal({
        autoOpen: false,
        overlayOpacity: 0.3,
        overlayColor: "#333",
        overlayClose: true,
        closeOnEscape: true,
        onClose: SessKeepAlivePoll
    });


    // Bind the Sess finish method to before unload to clean things up
    $(window).bind("beforeunload", SessKeepAliveFinish);


    //-- 18-Apr-2016 - This is now done when the ShowLockButtonsModal function is called
    //    $("#LBD").easyModal({
    //        autoOpen: false,
    //        overlayOpacity: 0.3,
    //        overlayColor: "#333",
    //        overlayClose: false,
    //        fadeSpeed: 500,
    //        closeOnEscape: false
    //    });

});






