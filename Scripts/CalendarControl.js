//-- cc obj ...
var cControl = new CalendarControl();
// Stores the previous text, so we can really see if we need to fire the change event!!!
var previousDateWidgetText = null;
var previousDoUnloadCheck = null;
//--
function CalendarControl() {
    var calendarId = 'CalendarControl';
    this.CalendarId = calendarId;
    var ccMonth = "CC_Month";
    var ccYear = "CC_Year";
    var currentYear = 0;
    var currentMonth = 0;
    var currentDay = 0;
    var selectedYear = 0;
    var selectedMonth = 0;
    var selectedDay = 0;
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dateField = null;
    //--
    function getDaysInMonth(year, month) {
        return [31, ((!(year % 4) && ((year % 100) || !(year % 400))) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }
    //--
    function getDayOfWeek(year, month, day) {
        var date = new Date(year, month - 1, day)
        return date.getDay();
    }
    //--
    this.ClearDate = clearDate;
    function clearDate() {
        dateField.value = '';
        hide();
    }
    //--
    this.SetDate = setDate;
    function setDate(year, month, day) {

        if (dateField) {

            if (day < 10) { day = "0" + day; }

            var myDateTime = new Date();

            var dateString = day + " " + (months[month - 1]).substring(0, 3) + " " + year;
            dateField.value = dateString;

            hide();
        }
        return;
    }
    //--
    this.ChangeMonth = changeMonth;
    function changeMonth(change) {
        currentMonth += change;
        currentDay = 0;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        } else if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        DoRebuildCalendar();
    }
    //--
    this.SetMonth = SetMonth;
    function SetMonth() {
        currentMonth = $("#"+ccMonth).val();
        DoRebuildCalendar();
    }
    //--
    this.ChangeYear = changeYear;
    function changeYear(change) {
        currentYear += change;
        currentDay = 0;
        DoRebuildCalendar();
    }
    //--
    this.SetYear = SetYear;
    function SetYear() {
        currentYear = $("#" + ccYear).val();
        DoRebuildCalendar();
    }
    //--
    function DoRebuildCalendar() {
        calendar = document.getElementById(calendarId);
        calendar.innerHTML = calendarDrawTable();
        UpdateDropdowns();
    }
    //--
    function getCurrentYear() {
        var year = new Date().getYear();
        if (year < 1900) year += 1900;
        return year;
    }
    //--
    function getCurrentMonth() {
        return new Date().getMonth() + 1;
    }
    //--
    function getCurrentDay() {
        return new Date().getDate();
    }
    //--
    function calendarDrawTable() {

        var dayOfMonth = 1;
        var validDay = 0;
        var startDayOfWeek = getDayOfWeek(currentYear, currentMonth, dayOfMonth);
        var daysInMonth = getDaysInMonth(currentYear, currentMonth);
        var css_class = null;

        var table = "<div class='ccHeader'>";
        table = table + "  <span style='float:left;'>&nbsp;&nbsp;<a href='javascript:cControl.ChangeMonth(-1);' class='previous'>&lt;</a></span>";
        table = table + "<select id='" + ccMonth + "' class='dropDown' onchange='javascript:cControl.SetMonth();'>";
        var i = 1;
        months.forEach(function (v) {
            table = table + "<option value='"+i.toString()+"'>"+v.substring(0, 3)+"</option>";
            i++;
        });
        table = table +"</select>";
        table = table + "&nbsp;"
        table = table + "<select id='"+ccYear+"' class='dropDown' onchange='javascript:cControl.SetYear();'>"

        for (var i = 0; i < 113; i++) {
            var tempYr = getCurrentYear() - i;
            table = table + "<option value='" + tempYr + "'>" + tempYr + "</option>";
        }
        table = table + "</select>";
        table = table + "  <span style='float:right;'><a href='javascript:cControl.ChangeMonth(1);' class='next'>&gt;</a>&nbsp;&nbsp;</span>";
        table = table + "</div>";
        table = table + "<table cellspacing='0' cellpadding='0' border='0'>";
        table = table + "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>";

        for (var week = 0; week < 6; week++) {
            table = table + "<tr>";
            for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                if (week == 0 && startDayOfWeek == dayOfWeek) {
                    validDay = 1;
                } else if (validDay == 1 && dayOfMonth > daysInMonth) {
                    validDay = 0;
                }

                if (validDay) {
                    if (dayOfMonth == selectedDay && currentYear == selectedYear && currentMonth == selectedMonth) {
                        css_class = 'current';
                    } else if (dayOfWeek == 0 || dayOfWeek == 6) {
                        css_class = 'weekend';
                    } else {
                        css_class = 'weekday';
                    }

                    table = table + "<td><a class='" + css_class + "' href=\"javascript:cControl.SetDate(" + currentYear + "," + currentMonth + "," + dayOfMonth + ");\">" + dayOfMonth + "</a></td>";
                    dayOfMonth++;
                } else {
                    table = table + "<td class='empty'>&nbsp;</td>";
                }
            }
            table = table + "</tr>";
        }
        table = table + "</table>";
        table = table + "<div class='ccFooter'><a href='javascript:cControl.ClearDate();' class='footerText'>Clear</a>&nbsp; | &nbsp;<a href='javascript:hideCalendarControl();' class='footerText'>Close</a></div>";
        return table;
    }
    //--
    this.show = show;
    function show(event, field) {
        // 4-Dec-16 - Set the previousDateWidgetText, so we can see if it has actually changed or not!
        previousDateWidgetText = $("#" + field.id).val();

        can_hide = 0;
        // 10-Jun-15 - Override the unloadcheck for forms with the leaving warning - otherwise we get a popup each time the calendar obj selects a date!
        if (typeof DoUnloadCheck !== 'undefined') {
            previousDoUnloadCheck = DoUnloadCheck;
            DoUnloadCheck = 0;
        }
        // If cal is vis and assoc with this field do nothing
        if (dateField == field) {
            return;
        } else {
            dateField = field;
        }
        if (dateField) {
            try {
                // lets try to parse an existing date if it is there ...
                var dateString = dateField.value;
                var dateParts = dateString.split(" ");

                selectedDay = +dateParts[0];
                var i = 1;
                months.forEach(function (v) {
                    if (v.toLowerCase().substring(0, 3) == dateParts[1].toLowerCase()) {
                        selectedMonth = i;
                    }
                    i++;
                });
                selectedYear = +dateParts[2];
            } catch (e) { }
        }

        if (!(selectedYear && selectedMonth && selectedDay)) {
            selectedMonth = getCurrentMonth();
            selectedDay = getCurrentDay();
            selectedYear = getCurrentYear();
        }
        currentMonth = selectedMonth;
        currentDay = selectedDay;
        currentYear = selectedYear;

        var htmlStr = calendarDrawTable();
        $("#" + calendarId).html(htmlStr);
        $("#" + calendarId).css("display", "block");
        var offsetDF = $("#" + dateField.id).offset();
        var x = offsetDF.left;
        x = x + 70;
        var y = offsetDF.top + 25;
        $("#" + calendarId).css("left", x);
        $("#" + calendarId).css("top", y);
        //$("#" + calendarId).css("z-index", 5000);

        //console.log(x + "   " + y);

        UpdateDropdowns();
    }
    //--
    this.hide = hide;
    function hide() {
        // 10-Jun-15 - Restart the page level leaving restricitons....
        if (typeof DoUnloadCheck !== 'undefined') {
            // 4-Dec-16 - Revert to the previous DoUnloadCheck rather than ALWAYS going for 1 as this now has a dual purpose (ouch) in which it also records if something has changed as well.
            //DoUnloadCheck = 1;
            DoUnloadCheck = previousDoUnloadCheck;
        }

        if (dateField) {
            $("#" + calendarId).fadeOut("fast");
            // ensures that the datefield fires a change event, incase any other code is watching for that ...
            // 4-Dec-16 - Lets make sure this ONLY fires if something has changed!!!
            //console.log("Old:'" + previousDateWidgetText + "'   new:'" + $("#" + dateField.id).val()+"'");
            if ($("#" + dateField.id).val() != previousDateWidgetText) {
                // 4-Dec-16 - This onChange will now also trigger the DoUnloadCheck to be set as well....  But lets do it here just in case ...
                if (typeof DoUnloadCheck !== 'undefined') {
                    DoUnloadCheck = 1;
                }
                $("#" + dateField.id).trigger("change");
            }
            dateField = null;
//            previousDateWidgetText = null;
        }
    }
    //--
    function UpdateDropdowns() {
        $("#" + ccMonth).val(currentMonth);
        $("#" + ccYear).val(currentYear);
    }

    //--
    this.btnClicked = 0;
    this.selectedTextFieldID = null;
    this.visible = visible;
    function visible() {
        return dateField;
    }
    this.can_hide = can_hide;
    var can_hide = 0;
}

//--
function calendarControlTriggerClick(textField) {
    $("#" + textField.id).trigger("click");
}

//--
function showCalendarControl(event, textField) {
    event.stopPropagation();

    cControl.btnClicked = 0;
    cControl.selectedTextFieldID = textField.id;
    cControl.show(event, textField);
}

//--
function hideCalendarControl() {
    if (cControl.visible()) {
        cControl.hide();
    }
}

//-- Hides the calendar if anywhere else on the document is clicked ....
// http://stackoverflow.com/questions/152975/how-to-detect-a-click-outside-an-element
$(document).ready(function () {
    $(document).click(function (event) {
        if (!$(event.target).closest("#" + cControl.CalendarId).length) {
            if ($("#" + cControl.CalendarId).is(":visible")) {
                hideCalendarControl();
            }
        }
    });
    //-- Create and append the cc div to the root element
    $('<div/>', { id: cControl.CalendarId }).appendTo('#PageContainer');
});
