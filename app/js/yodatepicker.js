'use strict';

// var yo_options = {
//
// }
//
// var start_datepicker = yodatepicker(yo_options);
//
//
//

var yodatepicker = function(options) {

    var configure = function(options) {
        var cfg = {
            MAX_CALENDARS: 2,
            dp_id_name: options.dp_id_name || '',  // selector id where to display the datepicker
            id_name: options.id_name || '',        // selector id where to populate a selected date
            locale: options.locale || 'en',
            ondateselected_callback: (options.onDateSelected instanceof Function) ? options.onDateSelected : null,
            onclose_callback: (options.onClose instanceof Function) ? options.onClose : null,
            display_count: options.display_count || 1,
            close_onselect: options.close_onselect,
            max_date: get_max_date((options.max_date || '1Y')),  // max date user can scroll forward to
            min_date: get_min_date((options.min_date || '*')),   // min date user can scroll back to
            currdate: new Date()
        };

        cfg.today = new Date(cfg.currdate.getFullYear(), cfg.currdate.getMonth(), cfg.currdate.getDate());
        cfg.month_names = get_month_names(cfg.locale);      // array of month names
        cfg.day_names = get_dow_names(cfg.locale);      // array of day of week names
        cfg.mn = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                 cfg.min_date.getMonth() : cfg.currdate.getMonth();
        cfg.yy = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                 cfg.min_date.getFullYear() : cfg.currdate.getFullYear();


        cfg.close_onselect = (cfg.close_onselect === undefined) ?
                                true : cfg.close_onselect;

        cfg.display_count = (cfg.display_count > cfg.MAX_CALENDARS) ?
                               cfg.MAX_CALENDARS : cfg.display_count;
        return cfg;
    };

    // Private
    //
    // yodatepicker options and variables


    var leap_year = function(yr) {
        return(yr % 400 === 0) || (yr % 4 === 0 && yr % 100 !== 0);
    };

    var get_dow_names = function(locale) {
        if(locale === undefined || locale === null) { locale = 'en'; }

        if(locale === 'es' || locale === 'fr') {
            return(['D', 'L', 'M', 'M', 'J', 'V', 'S']);
        }
        else if(locale === 'de') {
            return(['S', 'M', 'D', 'M', 'D', 'F', 'S']);
        }

        return(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    };

    var get_month_names = function(locale) {
        if(locale === undefined || locale === null) { locale = 'en'; }

        if(locale === 'es') {
            return(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                    'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']);
        }

        if(locale === 'fr') {
            return(['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
                    'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']);
        }

        if(locale === 'de') {
            return(['Januar', 'Februar', 'Marz', 'April', 'Mai', 'Juni', 'Juli',
                    'August', 'September', 'Oktober', 'November', 'Dezember']);
        }

        return(['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December']);
    };

    var days_in_month = function(month_num, full_year) {
        // Jan == 0, Feb == 1, Mar == 2, ...
        if(month_num === 0 || month_num === 2 || month_num === 4 ||
           month_num === 6 || month_num === 7 || month_num === 9 ||
           month_num === 11) {
            return(31);
        }
        else if(month_num === 3 || month_num === 5 ||
           month_num === 8 || month_num === 10) {
            return(30);
        }

        return(leap_year(full_year) ? 29 : 28);
    };

    var get_max_date = function(param_max_date) {
        // Return a date object set to max_date.
        // Acceptable parameter formats: 3M, 6M, 9M, 1Y, 2Y, * (infinity)
        var date = new Date();
        var month = date.getMonth();
        var year = date.getFullYear();

        switch(param_max_date) {
            case '3M':
                if((month + 3) > 11) { month = (month +3) % 12; year++; }
                else { month += 3; }
                break;
            case '6M':
                if((month + 6) > 11) { month = (month +6) % 12; year++; }
                else { month += 6; }
                break;
            case '9M':
                if((month + 9) > 11) { month = (month +9) % 12; year++; }
                else { month += 9; }
                break;
            case '2Y':
                year += 2;
                break;
            case '*':
                year = 3125;
                break;
            default:       // '1Y' is the default
                year += 1;
        }
        return(new Date(year, month, date.getDate()));
    };

var get_min_date = function(param_min_date) {
    // Return a date object set to min_date.
    // Acceptable parameter formats: 0, 3M, 6M, 9M, 1Y, 2Y, * (infinity)
    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();

    // If a Date object is passed in, use that.
    if(param_min_date instanceof Date) { return(param_min_date); }

    switch(param_min_date) {
        case '3M':
            if((month - 3) < 0) { month = (month -3) % 12; year--; }
            else { month -= 3; }
            break;
        case '6M':
            if((month - 6) < 0) { month = (month -6) % 12; year--; }
            else { month -= 6; }
            break;
        case '9M':
            if((month - 9) < 0) { month = (month -9) % 12; year--; }
            else { month -= 9; }
            break;
        case '1Y':
            year -= 1;
            break;
        case '2Y':
            year -= 2;
            break;
        case '*':
            year = 1900;
            break;
        default:
            break;  // default is the current date
    }
    return(new Date(year, month, date.getDate()));
};

    var citem = {
        day: 0,
        month: 0,
        year: 1900,
        first_dow: 0,
        total_days: 0,
        offset: 0,
        multi_cal: '',

        markup: function(unique_id) {
            var the_html = '';
            if(this.offset >= this.first_dow) {
                var tmp_date = new Date(this.year, this.month, this.day);
                var td_id = unique_id + this.month+ '_' + this.day + '_' + this.year;
                if(tmp_date.valueOf() > cfg.max_date.valueOf()) {
                    the_html += '<td id="' + td_id + '" class="jrdp_calendar_day1_noselect' + this.multi_cal + '">' + this.day + '</td>';
                }
                else if(tmp_date.valueOf() < cfg.min_date.valueOf()) {
                    the_html += '<td id="' + td_id + '" class="jrdp_calendar_day1_noselect' + this.multi_cal + '">' + this.day + '</td>';
                }
                else if(tmp_date.valueOf() === cfg.today.valueOf()) {
                    the_html += '<td id="' + td_id + '" class="jrdp_calendar_current_day' + this.multi_cal + '">' + this.day + '</td>';
                }
                else {
                    the_html += '<td id="' + td_id + '" class="jrdp_calendar_day1' + this.multi_cal + '">' + this.day + '</td>';
                }

                if(this.day >= this.total_days) { this.first_dow = 999; }
            }
            else { the_html += '<td class="jrdp_calendar_day2' + this.multi_cal + '">&nbsp;</td>'; }
            this.offset++;
            if(this.offset > this.first_dow) { this.day++; }
            return(the_html);
        }
    };

    var close_datepicker = function() {
        if(cfg.close_onselect) {
            document.getElementById(cfg.dp_id_name).innerHTML = '';
            if(cfg.id_name !== '') {
                eval('document.getElementById("' + cfg.id_name + '").focus();');
            }

            if(cfg.onclose_callback !== undefined) { cfg.onclose_callback(); }
        }
    };

/* -------------------- */
/* jshint unused: false */
/* -------------------- */
    var select_date = function(mm, dd, yy) {
        var the_month, the_day;

        mm++;    // Note: mm is the month number 0 - 11 so always add 1.
        if(mm < 10) { the_month = '0' + mm; } else { the_month = mm.toString(); }
        if(dd < 10) { the_day = '0' + dd;   } else { the_day = dd.toString();   }

        if(cfg.id_name !== '') {
            if(cfg.locale === 'en') {
                eval('document.getElementById("' + cfg.id_name +
                     '").value = the_month + "/" + the_day + "/" + yy');
            } else {
                eval('document.getElementById("' + cfg.id_name +
                     '").value = the_day + "/" + the_month + "/" + yy');
            }
        }

        if(cfg.ondateselected_callback) { cfg.ondateselected_callback(); }
        close_datepicker();
    };
/* -------------------- */
/* jshint unused: true  */
/* -------------------- */

    var month_inc = function() {
        var scroll_date = new Date(cfg.yy, cfg.mn, cfg.today.getDate());
        if((scroll_date.getFullYear() === cfg.max_date.getFullYear()) &&
           (scroll_date.getMonth() >= cfg.max_date.getMonth())) {
            return;
        }

        if(cfg.mn < 11) { cfg.mn++; }
        else { cfg.mn = 0; cfg.yy++; }
        this.show();
    };

    var month_dec = function() {
        var scroll_date = new Date(cfg.yy, cfg.mn, cfg.today.getDate());
        if((scroll_date.getFullYear() === cfg.min_date.getFullYear()) &&
           (scroll_date.getMonth() <= cfg.min_date.getMonth())) {
            return;
        }

        if(cfg.mn > 0) { cfg.mn--; }
        else { cfg.mn = 11; cfg.yy--; }
        this.show();
    };


/* -------------------- */
/* jshint unused: false */
/* -------------------- */
    var dump_html = function(calendar_html) {
        var the_html = '<tt>';
        for(var j=0; j<calendar_html.length; j++) {
            var ch = calendar_html.charAt(j);
            if(ch === '<')      { ch = '&lt;'; }
            else if(ch === '>') { ch = '&gt;<br />'; }
            else if(ch === ' ') { ch = '&nbsp;'; }
            the_html += ch;
        }
        the_html += '</tt>';
        if(document.getElementById('htmldump') !== null) {
            document.getElementById('htmldump').innerHTML = the_html;
        }
    };
/* -------------------- */
/* jshint unused: true  */
/* -------------------- */


    var cfg = configure(options);

    var _yodatepicker = {
        version: '1.6.7',

        hide: function() {
            close_datepicker();
        },

        set_min_date: function(mdate) {
            // This will override the cfg.min_date param.
            if(mdate instanceof Date) {
                cfg.min_date = mdate;
                cfg.mn = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                          cfg.min_date.getMonth() : cfg.currdate.getMonth();
                cfg.yy = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                         cfg.min_date.getFullYear() : cfg.currdate.getFullYear();
            }
        },

/* --------------------------- */
/* jshint maxstatements: false */
/* --------------------------- */
        show: function() {
            console.log('--> jodatepicker.show() fired!');
console.log(cfg.dp_id_name);
            if(cfg.dp_id_name === undefined) { return; }
            var calendar_html = '';
            var unique_id = 'jrdp_' + cfg.dp_id_name + '_';

            calendar_html  = '<table id="jrdp_' + cfg.dp_id_name + '" class="jrdp_encapsulated_table" cellspacing="0" cellpadding="0">';
            calendar_html += '<tr>';

            for(var i = 0; i < cfg.display_count; i++) {
                citem.day = 1;
                citem.month = cfg.mn;
                citem.year = cfg.yy;

                if(i > 0) {
                    if(cfg.mn < 11) { citem.month = cfg.mn +1; }
                    else { citem.month = 0; citem.year = cfg.yy +1; }
                }

                cfg.currdate.setDate(1);                 // set day of month to the 1st
                cfg.currdate.setMonth(citem.month);      // set the month
                cfg.currdate.setFullYear(citem.year);    // set to 4-digit year

                citem.offset = 0;
                citem.first_dow = cfg.currdate.getDay(); // 0 - 6 (sun - sat)
                citem.total_days = days_in_month(cfg.currdate.getMonth(), cfg.currdate.getFullYear());
                citem.multi_cal = (cfg.display_count > 1) ? '_multi' : '';

                calendar_html += '<td>';
                calendar_html += '<table class="jrdp_calendar' + citem.multi_cal + '" cellspacing="0" cellpadding="0">';

                // This below snippet needs to eventually come out as it serves no purpose.
                calendar_html += '    <tr><td>';
                calendar_html += '        <table id="jrdp_calendar_table_inner" width="100%" border="0" cellspacing="0" cellpadding="0">';
                calendar_html += '        <tr class="jrdp_calendar_tbar' + citem.multi_cal + '">';
                if(cfg.close_onselect) {
                    calendar_html += '            <td align="right">';
                    calendar_html += '            <span id="' + unique_id + 'close" style="cursor: pointer;">';
                    calendar_html += '                <span class="jrdp_calendar_close_btn' + citem.multi_cal + '"></span>';
                    calendar_html += '            </span>';
                    calendar_html += '            </td>';
                }
                else { calendar_html += '         <td align="right">&nbsp;</td>'; }
                calendar_html += '        </tr></table>';
                calendar_html += '    </td></tr>';
                // This above snippet needs to eventually come out as it serves no purpose.

                calendar_html += '    <tr class="jrdp_calendar_month_tbar' + citem.multi_cal + '">';
                calendar_html += '            <td colspan="1" class="jrdp_calendar_month_prev' + citem.multi_cal + '" align="left">';
                calendar_html += '                <span id="' + unique_id + 'prevmonth' + citem.multi_cal + '_' + i +'">&lsaquo;</span></td>';
                calendar_html += '            <td colspan="5" class="jrdp_calendar_month' + citem.multi_cal + '" align="center">' + cfg.month_names[citem.month] + ' ' + citem.year + '</td>';
                calendar_html += '            <td colspan="1" class="jrdp_calendar_month_next' + citem.multi_cal + '" align="right">';
                calendar_html += '                <span id="' + unique_id + 'nextmonth' + citem.multi_cal + '_' + i +'">&rsaquo;</span></td>';
                calendar_html += '    </tr>';

                calendar_html += '    <tr>';
                for(var a = 0; a < 7; a++) { calendar_html += '<td class="jrdp_calendar_days' + citem.multi_cal + '">' + cfg.day_names[a] + '</td>'; }
                calendar_html += '    </tr>';

                var rows_printed = 0;
                for(var j = 0; j < 6; j++) {
                    if(citem.first_dow === 999) { break; }
                    calendar_html += '            <tr>';
                    for(var k = 0; k < 7; k++) {
                        calendar_html += citem.markup(unique_id);
                    }
                    calendar_html += '            </tr>';
                    rows_printed++;
                }
                // Output empty rows if needed so we have a total of 6 rows printed.
                for(var b = 0; b < (6-rows_printed); b++) {
                    calendar_html += '<tr>';
                    for(var c = 0; c < 7; c++) {
                        calendar_html += '<td class="jrdp_calendar_day2' + citem.multi_cal + '">&nbsp;</td>';
                    }
                    calendar_html += '</tr>';
                }
                calendar_html += '</table>';
                calendar_html += '</td>';
            }
            calendar_html += '</tr></table>';
            document.getElementById(cfg.dp_id_name).innerHTML = calendar_html;

            // Setup event listeners for elements.
            //
            // These methods replace the existing click event listener(s) on the element if there are any.
            // Because this was essentially part of DOM 0, this method is very widely supported and requires
            // no special cross–browser code; hence it is normally used to register event listeners dynamically.
            for(var x = 0; x < i; x++) {
                document.getElementById(unique_id + 'prevmonth' + citem.multi_cal + '_' + x).onclick = month_dec;
                document.getElementById(unique_id + 'nextmonth' + citem.multi_cal + '_' + x).onclick = month_inc;

                document.getElementById(unique_id + 'prevmonth' + citem.multi_cal + '_' + x).style.display = 'block';
                document.getElementById(unique_id + 'nextmonth' + citem.multi_cal + '_' + x).style.display = 'block';
            }

            // Attach event listeners to the following events so that the datepicker
            // will close when the user clicks outside of the calendar.
            document.getElementsByTagName('body')[0].onmousedown = close_datepicker;

            document.getElementById('jrdp_' + cfg.dp_id_name).onmouseover = function(e) {
                // IE 7-8 does not support event.currentTarget but does so for event.srcElement;
                var target, target_id, ev = e || window.event;
                var using_srcElement = false;
                try { target = ev.currentTarget; }
                catch(err) { target = ev.srcElement; using_srcElement = true; }
                try { target_id = target.id; }
                catch(err) { target_id = (target) ? target : 'jrdp_' + cfg.dp_id_name; }
                if(target_id) {
                    //console.log('MOUSE OVER: target_id of triggered element: "' + target_id + '" using_srcElement: ' + using_srcElement);
                    document.getElementById(target_id).onmouseover = function() {
                        document.getElementsByTagName('body')[0].onmousedown = null;
                    };
                }
                document.getElementsByTagName('body')[0].onmousedown = null;
            };

            document.getElementById('jrdp_' + cfg.dp_id_name).onmouseout = function(e) {
                // IE 7-8 does not support event.currentTarget but does so for event.srcElement;
                var target, target_id, ev = e || window.event;
                var using_srcElement = false;
                try { target = ev.currentTarget; }
                catch(err) { target = ev.srcElement; using_srcElement = true; }
                try { target_id = target.id; }
                catch(err) { target_id = (target) ? target : 'jrdp_' + cfg.dp_id_name; }
                if(target_id) {
                    //console.log('MOUSE OUT: target_id of triggered element: "' + target_id + '" using_srcElement: ' + using_srcElement);
                    document.getElementById(target_id).onmouseout = function() {
                        document.getElementsByTagName('body')[0].onmousedown = close_datepicker;
                    };
                }
                document.getElementsByTagName('body')[0].onmousedown = close_datepicker;
            };

            // Bind event listeners to each day for the onclick event.  Get an array of
            // elements by the class name so we can get the element id name.
            //var day_tds = document.querySelectorAll('.jrdp_calendar_day1' + citem.multi_cal);
            var day_tds = document.getElementsByClassName('jrdp_calendar_day1' + citem.multi_cal);
            for(var y = 0; y < day_tds.length; y++) {
                // The id is in the format of 'jrdp_idname_mm_dd_yy'.
                // So if we split on the '_' then we can use the last three elements.
                var items = day_tds[y].id.split('_');
                var mmtmp = items[items.length -3];
                var ddtmp = items[items.length -2];
                var yytmp = items[items.length -1];

                var tmp_id = unique_id + mmtmp + '_' + ddtmp + '_' + yytmp;

                var s  = 'document.getElementById("' + tmp_id + '").onclick = ';
                    s += 'function() { select_date(' + mmtmp + ',' + ddtmp + ',' + yytmp + '); };';

                if(document.getElementById(tmp_id)) {
                    eval(s);
                }
            }

            // Check for the current day node because it will have a different class name.
            //var curr_day_td = document.querySelectorAll('.jrdp_calendar_current_day' + citem.multi_cal);
            var curr_day_td = document.getElementsByClassName('jrdp_calendar_current_day' + citem.multi_cal);
            if(curr_day_td.length > 0) {
                var items = curr_day_td[0].id.split('_');
                var mmtmp = items[items.length -3];
                var ddtmp = items[items.length -2];
                var yytmp = items[items.length -1];

                var tmp_id = unique_id + mmtmp + '_' + ddtmp + '_' + yytmp;

                var s  = 'document.getElementById("' + tmp_id + '").onclick = ';
                    s += 'function() { select_date(' + mmtmp + ',' + ddtmp + ',' + yytmp + '); };';
                if(document.getElementById(tmp_id)) {
                    eval(s);
                }
            }

            // Uncomment the below to dump the html for debugging.  Need an element with id='htmldump'
            //dump_html(calendar_html);
        }
    };
/* --------------------------- */
/* jshint maxstatements: 20 */
/* --------------------------- */

    return _yodatepicker;
};
