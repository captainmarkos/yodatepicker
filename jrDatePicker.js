// ------------------------------------------------------------------------- //
// jrDatePicker.js                                                           //
//                                                                           //
// Mark Brettin     SEP 12, 2012                                             //
// ------------------------------------------------------------------------- //


var jrDatePicker = function(params) {
    // Create an object literal (that) that includes properties and methods
    // for public use.  Any local variables defined outside of that{} or 
    // passed to jrDatePicker will remain private but still accessible 
    // from functions within that{}.


    // ---- Private ----
    var leap_year = function(yr) { return(yr % 400 == 0) || (yr % 4 == 0 && yr % 100 != 0); };


    var get_dow_names = function(loc) {
        if(loc == undefined || loc == null) { loc = 'en'; }

        if(loc == 'es' || loc == 'fr') { return(['D', 'L', 'M', 'M', 'J', 'V', 'S']); }
        else if(loc == 'de') { return(['S', 'M', 'D', 'M', 'D', 'F', 'S']); }
        else                 { return(['S', 'M', 'T', 'W', 'T', 'F', 'S']); }
    };


    var get_month_names = function(loc) {
        if(loc == undefined || loc == null) { loc = 'en'; }

        if(loc == 'es') {
            return(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
                    'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']);
        }
        else if(loc == 'fr') {
            return(['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
                    'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']);
        }
        else if(loc == 'de') {
            return(['Januar', 'Februar', 'Marz', 'April', 'Mai', 'Juni', 'Juli',
                    'August', 'September', 'Oktober', 'November', 'Dezember']);
        }
        else {
            return(['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December']);
        }
    };


    var days_in_month = function(month_num) {
        // Jan == 0, Feb == 1, Mar == 2, ...
        if(month_num == 0 || month_num == 2 || month_num == 4 || 
           month_num == 6 || month_num == 7 || month_num == 9 || month_num == 11) {
            return(31);
        }
        else if(month_num == 3 || month_num == 5 || 
                month_num == 8 || month_num == 10) {
            return(30);
        }
        else {
            return(leap_year(yy) ? 29 : 28);
        }
    };

    var MAX_DATEPICKERS = 2;
    var dp_id_name = params.dp_id_name || '';  // selector id where to display the datepicker
    var id_name = params.id_name || '';        // selector id where to populate a selected date
    var locale = params.locale || 'en';
    var ondateselected_callback = (params.onDateSelected instanceof Function) ? params.onDateSelected : null;
    var onclose_callback = (params.onClose instanceof Function) ? params.onClose : null;
    var display_count = params.display_count || 1;
        display_count = (display_count > MAX_DATEPICKERS) ? MAX_DATEPICKERS : display_count;
    var close_onselect = params.close_onselect;
        close_onselect = (close_onselect == undefined) ? true : close_onselect;

    var d = new Date();              
    var months = get_month_names(locale);      // array of month names
    var dow_name = get_dow_names(locale);      // array of day of week names
    var mn = d.getMonth();                     // month 0 - 11
    var yy = d.getFullYear();                  // 4-digit year

    var citem = {
        day: 0,
        month: 0,
        year: 1900,
        first_dow: 0, 
        total_days: 0, 
        offset: 0,

        markup: function(unique_id) {
            var the_html = '';
            if(this.offset >= this.first_dow) { 
                var td_id = unique_id + this.month+ '_' + this.day + '_' + this.year;
                the_html += '<td id="' + td_id + '" class="jrdp_calendar_day1_multi">' + this.day + '</td>';
                if(this.day >= this.total_days) { this.first_dow = 999; } 
            }
            else { the_html += '<td class="jrdp_calendar_day2_multi">&nbsp;</td>'; }
            this.offset++;
            if(this.offset > this.first_dow) { this.day++; }
            return(the_html);
        }
    };


    // ---- Public ----
    var that = {
        show: function() {
            if(display_count <= 1)
                this.display_calendar();
            else
                this.display_calendar_multi();
        },


        display_calendar_multi: function() {
            if(dp_id_name == undefined) return;
            var calendar_html = '';
            var unique_id = 'jrdp_' + dp_id_name + '_';
            
            calendar_html  = '<table class="jrdp_encapsulated_table" cellspacing="0" cellpadding="0">';
            calendar_html += '<tr>';

            for(i = 0; i < display_count; i++) {
                citem.day = 1;
                citem.month = mn;
                citem.year = yy;

                if(i > 0) {
                    if(mn < 11) { citem.month = mn +1; }
                    else { citem.month = 0; citem.year = yy +1; }
                }

                d.setDate(1);                 // set day of month to the 1st
                d.setMonth(citem.month);         // set the month
                d.setFullYear(citem.year);    // set to 4-digit year

                citem.offset = 1;
                citem.first_dow = d.getDay(); // 0 - 6 (sun - sat)
                citem.total_days = days_in_month(d.getMonth());

                calendar_html += '<td>';
                calendar_html += '<table class="jrdp_calendar_multi" cellspacing="0" cellpadding="0">';

                calendar_html += '    <tr><td colspan="7">';
                calendar_html += '        <table width="100%" border="0" cellspacing="0" cellpadding="0">';
                calendar_html += '        <tr class="jrdp_calendar_tbar_multi">';
                if(close_onselect) {
                    calendar_html += '            <td align="right"><span id="' + unique_id + 'close" style="cursor: pointer;">';
                    calendar_html += '                                  <span class="jrdp_calendar_close_btn_multi"></span>';
                    calendar_html += '                              </span></td>';
                }
                else { calendar_html += '            <td align="right">&nbsp;</td>'; }

                calendar_html += '        </tr></table>';
                calendar_html += '    </td></tr>';

                calendar_html += '    <tr class="jrdp_calendar_month_tbar_multi">';

                calendar_html += '    <td>';
                calendar_html += '        <table width="100%" border="0" cellspacing="0" cellpadding="0">';
                calendar_html += '            <tr align="center" valign="middle">';
                calendar_html += '            <td colspan="1" class="jrdp_calendar_month_prev_multi" align="left">';
                calendar_html += '                <span id="' + unique_id + 'prevmonth_multi_' + i +'">&lt;</span></td>';
                calendar_html += '            <td colspan="5" class="jrdp_calendar_month_multi">' + months[citem.month] + ' ' + citem.year + '</td>';
                calendar_html += '            <td colspan="1" class="jrdp_calendar_month_next_multi" align="right">';
                calendar_html += '                <span id="' + unique_id + 'nextmonth_multi_' + i +'">&gt</span></td>';
                calendar_html += '            </tr>';

                calendar_html += '            <tr>';
                for(var j = 0; j < 7; j++) { calendar_html += '<td class="jrdp_calendar_days_multi">' + dow_name[j] + '</td>'; }
                calendar_html += '            </tr>';

                var rows_printed = 0;
                for(var j = 0; j < 6; j++) {
                    if(citem.first_dow == 999) { break; }
                    calendar_html += '            <tr>';
                    for(var k = 0; k < 7; k++) {
                        calendar_html += citem.markup(unique_id);
                    }
                    calendar_html += '            </tr>';
                    rows_printed++;
                }
                // Output empty rows if needed so we have a total of 6 rows printed.
                for(var j = 0; j < (6-rows_printed); j++) {
                    calendar_html += '<tr>';
                    for(var k = 0; k < 7; k++) {
                        calendar_html += '<td class="jrdp_calendar_day2_multi">&nbsp;</td>';
                    }
                    calendar_html += '</tr>';
                }
                calendar_html += '        </table>';
                calendar_html += '    </td>';
                calendar_html += '    </tr>';
                calendar_html += '</table>';
                calendar_html += '</td>';
            }
            calendar_html += '</tr></table>';
   
            document.getElementById(dp_id_name).innerHTML = calendar_html;

            // Setup event listeners for elements.
            //
            // These methods replace the existing click event listener(s) on the element if there are any.
            // Because this was essentially part of DOM 0, this method is very widely supported and requires 
            // no special cross–browser code; hence it is normally used to register event listeners dynamically.
            for(var j = 0; j < i; j++) {
                document.getElementById(unique_id + 'prevmonth_multi_' + j).onclick = this.month_dec;
                document.getElementById(unique_id + 'nextmonth_multi_' + j).onclick = this.month_inc;
            }
            if(close_onselect) document.getElementById(unique_id + 'close').onclick = this.close_datepicker;
            
            // Bind event listeners to each day for the onclick event.  Get an array of 
            // elements by the class name so we can get the element id name.
            var day_tds = document.getElementsByClassName('jrdp_calendar_day1_multi');
            for(var i = 0; i < day_tds.length; i++) {
                // The id is in the format of 'jrdp_idname_mm_dd_yy'.
                // So if we split on the '_' then we can use the last three elements.
                var items = day_tds[i].id.split('_');
                var mmtmp = items[items.length -3];
                var ddtmp = items[items.length -2];
                var yytmp = items[items.length -1];
          
                var tmp_id = unique_id + mmtmp + '_' + ddtmp + '_' + yytmp;

                var s  = 'document.getElementById("' + tmp_id + '").onclick = ';
                    s += 'function() { that.select_date(' + mmtmp + ',' + ddtmp + ',' + yytmp + '); };';
                eval(s);
            }

            // Uncomment the below to dump the html for debugging.
            this.dump_html(calendar_html);
        },


        display_calendar: function() {
            if(dp_id_name == undefined) return;
            d.setDate(1);
            d.setFullYear(yy);
            d.setMonth(mn);
            var first_dow = d.getDay();   // Get the day of the week which the 1st falls on (0 - 6 = sun - sat) 
            var calendar_html = '';
            var days = 1;
            var total_days = days_in_month(d.getMonth());
            var offset = 0;

            var unique_id = 'jrdp_' + dp_id_name + '_';

            calendar_html  = '<table class="jrDatePicker_miniCalendar" cellspacing="0" cellpadding="0">';

            calendar_html += '    <tr><td colspan="7">';
            calendar_html += '        <table width="100%" border="0" cellspacing="0" cellpadding="0">';
            calendar_html += '        <tr class="jrDatePicker_calendarTbar">';
            calendar_html += '            <td align="right"><span id="' + unique_id + 'close" style="cursor: pointer;">';
            calendar_html += '                              <span class="jrDatePicker_calendarCloseBtn"></span>';
            calendar_html += '                              </span></td>';
            calendar_html += '        </tr></table>';
            calendar_html += '    </td></tr>';

            calendar_html += '    <tr class="jrDatePicker_calendarMonthTbar">';

            calendar_html += '    <td>';
            calendar_html += '        <table width="100%" border="0" cellspacing="0" cellpadding="0">';
            calendar_html += '            <tr align="center" valign="middle">';
            calendar_html += '            <td colspan="1" class="jrDatePicker_calendarMonthPrev" align="left">';
            calendar_html += '                <span id="' + unique_id + 'prevmonth">&lt;</span></td>';
            calendar_html += '            <td colspan="5" class="jrDatePicker_calendarMonth">' + months[mn] + ' ' + yy + '</td>';
            calendar_html += '            <td colspan="1" class="jrDatePicker_calendarMonthNext" align="right">';
            calendar_html += '                <span id="' + unique_id + 'nextmonth">&gt</span></td>';
            calendar_html += '            </tr>';

            calendar_html += '            <tr>';
            for(var i = 0; i < 7; i++) { calendar_html += '<td class="jrDatePicker_calendarDays">' + dow_name[i] + '</td>'; }
            calendar_html += '            </tr>';


            for(var i = 0; i < 6; i++) {
                if(first_dow == 999) { break; }

                calendar_html += '            <tr>';

                // BEGIN: SUNDAY
                if(offset >= first_dow)  { 
                    var td_id = unique_id + mn + '_' + days + '_' + yy;
                    calendar_html += '<td id="' + td_id + '" class="jrDatePicker_calendarDate1">' + days + '</td>';
                    if(days >= total_days) { first_dow = 999; } 
                }
                else { calendar_html += '<td class="jrDatePicker_calendarDate2">&nbsp;</td>'; }
                offset++;
                if(offset > first_dow) { days++; }
                // END: SUNDAY

                // BEGIN: MONDAY
                if(offset >= first_dow)  { 
                    var td_id = unique_id + mn + '_' + days + '_' + yy;
                    calendar_html += '<td id="' + td_id + '" class="jrDatePicker_calendarDate1">' + days + '</td>';
                    if(days >= total_days) { first_dow = 999; } 
                }
                else { calendar_html += '<td class="jrDatePicker_calendarDate2">&nbsp;</td>'; }
                offset++;
                if(offset > first_dow) { days++; }
                // END: MONDAY
    
                // BEGIN: TUESDAY
                if(offset >= first_dow)  { 
                    var td_id = unique_id + mn + '_' + days + '_' + yy;
                    calendar_html += '<td id="' + td_id + '" class="jrDatePicker_calendarDate1">' + days + '</td>';
                    if(days >= total_days) { first_dow = 999; } 
                }
                else { calendar_html += '<td class="jrDatePicker_calendarDate2">&nbsp;</td>'; }
                offset++;
                if(offset > first_dow) { days++; }
                // END: TUESDAY

                // BEGIN: WEDNESDAY
                if(offset >= first_dow)  { 
                    var td_id = unique_id + mn + '_' + days + '_' + yy;
                    calendar_html += '<td id="' + td_id + '" class="jrDatePicker_calendarDate1">' + days + '</td>';
                    if(days >= total_days) { first_dow = 999; } 
                }
                else { calendar_html += '<td class="jrDatePicker_calendarDate2">&nbsp;</td>'; }
                offset++;
                if(offset > first_dow) { days++; }
                // END: WEDNESDAY

                // BEGIN: THURSDAY
                if(offset >= first_dow)  {
                    var td_id = unique_id + mn + '_' + days + '_' + yy;
                    calendar_html += '<td id="' + td_id + '" class="jrDatePicker_calendarDate1">' + days + '</td>';
                    if(days >= total_days) { first_dow = 999; } 
                }
                else { calendar_html += '<td class="jrDatePicker_calendarDate2">&nbsp;</td>'; }
                offset++;
                if(offset > first_dow) { days++; }
                // END: THURSDAY

                // BEGIN: FRIDAY
                if(offset >= first_dow)  { 
                    var td_id = unique_id + mn + '_' + days + '_' + yy;
                    calendar_html += '<td id="' + td_id + '" class="jrDatePicker_calendarDate1">' + days + '</td>';
                    if(days >= total_days) { first_dow = 999; } 
                }
                else { calendar_html += '<td class="jrDatePicker_calendarDate2">&nbsp;</td>'; }
                offset++;
                if(offset > first_dow) { days++; }
                // END: FRIDAY

                // BEGIN: SATURDAY
                if(offset >= first_dow)  { 
                    var td_id = unique_id + mn + '_' + days + '_' + yy;
                    calendar_html += '<td id="' + td_id + '" class="jrDatePicker_calendarDate1">' + days + '</td>';
                    if(days >= total_days) { first_dow = 999; } 
                }
                else { calendar_html += '<td class="jrDatePicker_calendarDate2">&nbsp;</td>'; }
                offset++;
                if(offset > first_dow) { days++; }
                // END: SATURDAY

                calendar_html += '            </tr>';
            }
            calendar_html += '        </table>';
            calendar_html += '    </td>';
            calendar_html += '    </tr>';
            calendar_html += '</table>';

            document.getElementById(dp_id_name).innerHTML = calendar_html;

            // Setup some event listeners for elements.
            //
            // These methods replace the existing click event listener(s) on the element if there are any.
            // Because this was essentially part of DOM 0, this method is very widely supported and requires 
            // no special cross–browser code; hence it is normally used to register event listeners dynamically.
            //
            // Pass a function reference — do not add '()' after it, that would call the function!
            document.getElementById(unique_id + 'prevmonth').onclick = this.month_dec;
            document.getElementById(unique_id + 'nextmonth').onclick = this.month_inc;
            document.getElementById(unique_id + 'close').onclick = this.close_datepicker;
            
            // Bind event listeners to each day for the onclick event.  Get an array of 
            // elements by the class name so we can get the element id name.
            var day_tds = document.getElementsByClassName('jrDatePicker_calendarDate1');
            for(var i = 0; i < day_tds.length; i++) {
                // The id is in the format of 'jrdp_idname_mm_dd_yy'.
                // So if we split on the '_' then we can use the last three elements.
                var items = day_tds[i].id.split('_');
                var mmtmp = items[items.length -3];
                var ddtmp = items[items.length -2];
                var yytmp = items[items.length -1];
          
                var tmp_id = unique_id + mmtmp + '_' + ddtmp + '_' + yytmp;

                var s  = 'document.getElementById("' + tmp_id + '").onclick = ';
                    s += 'function() { that.select_date(' + mmtmp + ',' + ddtmp + ',' + yytmp + '); };';
                eval(s);
            }

            // Uncomment the below to dump the html for debugging.
            //this.dump_html(calendar_html);
        },


        select_date: function(mm, dd, yy) {
            var the_month, the_day;

            mm++;    // Note: mm is the month number 0 - 11 so always add 1.

            if(mm < 10) { the_month = "0" + mm; } else { the_month = mm.toString(); }
            if(dd < 10) { the_day = "0" + dd;   } else { the_day = dd.toString();   }

            //alert(the_month + "/" + the_day + "/" + yy);

            eval('document.getElementById("' + id_name + '").value = the_month + "/" + the_day + "/" + yy');

            if(ondateselected_callback != undefined) ondateselected_callback();
            this.close_datepicker();
        },


        month_inc: function() {
            //alert("month_inc() --> mn:" + mn);
            if(mn < 11) { mn++; }
            else { mn = 0; yy++; }
            that.show();
        },


        month_dec: function() {
            //alert("month_dec() --> mn:" + mn);
            if(mn > 0) { mn--; }
            else { mn = 11; yy--; }
            that.show();
        },


        close_datepicker: function() {
            if(close_onselect) {
                document.getElementById(dp_id_name).innerHTML = "";
                eval('document.getElementById("' + id_name + '").focus();');

                if(onclose_callback != undefined) onclose_callback();
            }
        },


        dump_html: function(calendar_html) {
            var the_html = '<tt>';
            for(var j=0; j<calendar_html.length; j++) {
                var ch = calendar_html.charAt(j);
                if(ch == '<') ch = '&lt;';
                else if(ch == '>') ch = '&gt;<br />';
                else if(ch == ' ') ch = '&nbsp;';
                the_html += ch;
            }
            the_html += '</tt>';
            if(document.getElementById('htmldump') != null)
                document.getElementById('htmldump').innerHTML = the_html;
        },
    };

    return(that);
};
