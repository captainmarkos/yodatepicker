'use strict';

/* jshint unused: false */
var yodatepicker = function(options) {
/* jshint unused: true */
    var YoException = function(value) {
        this.value = value;
        this.message = 'yoException: something is wrong with ';
        this.toString = function() {
            return this.message + this.value;
        };
    };

    var configure = function(opts) {
        var cfg = {
            // Max months to display on a multi-month yodatepicker.
            MAX_CALENDARS: 2,

            // Element id where to display the yodatepicker.
            dp_id_name: opts.dp_id_name || '',

            // Element id where to populate a selected date.
            id_name: opts.id_name || '',

            // Localization.
            locale: opts.locale || 'en',

            // User defined function executed when selecting a date.
            ondateselected_callback: (opts.onDateSelected instanceof Function) ?
                                     opts.onDateSelected : null,

            // User defined function to be called when closing yodatepicker.
            onclose_callback: (opts.onClose instanceof Function) ?
                                     opts.onClose : null,

            // Number of months to display in multi-month yodatepicker.
            months_to_display: opts.months_to_display || 1,

            // Boolean triggers yodatepicker to close when user selects a date.
            close_onselect: opts.close_onselect,

            // Max date user can scroll forward to.
            max_date: get_max_date((opts.max_date || '1Y')),

            // Min date user can scroll backward to.
            min_date: get_min_date((opts.min_date || '*')),

            // An array of objects with dates as the key and the content
            // as the value where the value is the content to be included
            // for that date.
            cell_content: opts.cell_content || null,

            // Sets the day of week name: single_name, short_name, full_name.
            dow_heading: opts.dow_heading || 'single_name',

            // Tells yodatepicker that the user wants to use a date range.
            // The first date selected will become the begin date and then
            // the second date selected will become the end date.
            date_range: opts.date_range || false,

            // If using date_range then this is the element id where to
            // populate the selected start date.
            begin_id_name: opts.begin_id_name || '',

            // If using date_range then this is the element id where to
            // populate the selected end date.
            end_id_name: opts.end_id_name || '',

            // The current date.
            currdate: new Date(),

            // CSS class used for previous and next navigation (fontawesome).
            prev_fa_class: opts.prev_fa_class || '',
            next_fa_class: opts.next_fa_class || '',

            // Custom colors for certain items.
            prev_month_nav_color: opts.prev_month_nav_color || '',
            next_month_nav_color: opts.next_month_nav_color || '',

            // These four options go together for hovering.
            day_mouseover_bgcolor: opts.day_mouseover_bgcolor || '',
            day_mouseover_fgcolor: opts.day_mouseover_fgcolor || '',
            day_mouseleave_bgcolor: opts.day_mouseleave_bgcolor || '',
            day_mouseleave_fgcolor: opts.day_mouseleave_fgcolor || ''
        };

        // TODO: Clean up this below.
        cfg.today = new Date(cfg.currdate.getFullYear(),
                             cfg.currdate.getMonth(),
                             cfg.currdate.getDate());

        // array of month names
        cfg.month_names = get_month_names(cfg.locale);

        // array of day of week names
        cfg.day_names = get_dow_names(cfg.locale, cfg.dow_heading);

        // Keeps track of the month the datepicker is on and will
        // not go past the min_date month (if set).
        cfg.mn = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                 cfg.min_date.getMonth() : cfg.currdate.getMonth();

        // Keeps track of the year the datepicker is on and will
        // not go past the min_date year (if set).
        cfg.yy = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                 cfg.min_date.getFullYear() : cfg.currdate.getFullYear();

        // Set flag, tiggers the datepicker to close on selecting a day.
        cfg.close_onselect = (cfg.close_onselect === undefined) ?
                             true : cfg.close_onselect;

        // Limit the number of months to display for a multi-month datepicker.
        cfg.months_to_display = (cfg.months_to_display > cfg.MAX_CALENDARS) ?
                               cfg.MAX_CALENDARS : cfg.months_to_display;

        // This feature is only applicable when close_onselect is false and
        // months_to_display is greater than 1.
        cfg.date_range = (cfg.close_onselect === false &&
                          cfg.months_to_display > 1) ? cfg.date_range : false;

        // Indicator for which date the user is selecting when date_range on.
        cfg.begin_end = cfg.date_range ? {begin: true, end: false} : null;

        return cfg;
    };

    var toggle_begin_end = function() {
        if(cfg.date_range) {
            if(cfg.begin_end.begin) {
                cfg.begin_end.begin = false;
                cfg.begin_end.end = true;
            } else {
                cfg.begin_end.begin = true;
                cfg.begin_end.end = false;
            }
            return true;
        }
        return false;
    };

    var citem = {
        day: 0,
        month: 0,
        year: 1900,
        first_dow: 0,
        total_days: 0,
        offset: 0,

        jrs_more_content: function(key) {
            // Returns the content for a cell if it is present.
            // Otherwise return an alternate string.
            //
            // NOTE: key is formatted like '0_25_2015' so here we'll
            // reformat that to look like '2015-01-25'.
            //

            var items = key.split('_');
            var no_availability = '<div class="yo-rate-item">N/A</div>';
            if(!items) { return no_availability; }

            items[0] = parseInt(items[0], 10) +1;
            var key_month = (items[0] < 10) ? ('0' + items[0]) : items[0];
            var key_day = (items[1] < 10) ? ('0' + items[1]) : items[1];
            var content_date = items[2] + '-' + key_month + '-' + key_day;

            // NOTE: This loop is inefficient, however for our immediate
            // purposes, cell_content is only going to have 365 elements
            // which is one year of rates.
            for(var i = 0; i < cfg.cell_content.length; i++) {
                if(cfg.cell_content[i].date === content_date) {
                    var value = cfg.cell_content[i].price;
                    if(!value) { return no_availability; }
                    return '<div class="yo-rate-item">$' + value + '</div>';
                }
            }
            return no_availability;
        },

        markup: function(params) {
            var tr_node = params.tr_node;
            var td_class = 'yo-datepicker-day-empty' + params.multi_cal;

            if(this.offset >= this.first_dow) {
                var tmp_date = new Date(this.year, this.month, this.day);
                var key = this.month + '_' + this.day + '_' + this.year;
                var td_id = params.yo_id + '_' + key;

                if(tmp_date.valueOf() > cfg.max_date.valueOf()) {
                    td_class = 'yo-datepicker-day-noselect' + params.multi_cal;
                    _yodatepicker.create_day(tr_node, this.day, td_id, td_class);
                }
                else if(tmp_date.valueOf() < cfg.min_date.valueOf()) {
                    td_class = 'yo-datepicker-day-noselect' + params.multi_cal;
                    _yodatepicker.create_day(tr_node, this.day, td_id, td_class);
                }
                else if(tmp_date.valueOf() === cfg.today.valueOf()) {
                    td_class = 'yo-datepicker-day-current' + params.multi_cal;
                    _yodatepicker.create_day(tr_node, this.day, td_id, td_class);
                    var tmp_elem = document.getElementById(td_id);
                    if(tmp_elem && cfg.cell_content) {
                        tmp_elem.innerHTML += this.jrs_more_content(key);
                    }
                }
                else {
                    td_class = 'yo-datepicker-day' + params.multi_cal;
                    _yodatepicker.create_day(tr_node, this.day, td_id, td_class);
                    var tmp_elem = document.getElementById(td_id);
                    if(tmp_elem && cfg.cell_content) {
                        tmp_elem.innerHTML += this.jrs_more_content(key);
                    }
                }

                if(this.day >= this.total_days) { this.first_dow = 999; }
            }
            else {
                _yodatepicker.create_day(tr_node, '', '', td_class);
            }
            this.offset++;
            if(this.offset > this.first_dow) { this.day++; }
        }
    };

    var close_datepicker = function() {
        if(cfg.close_onselect) {
            document.getElementById(cfg.dp_id_name).innerHTML = '';

            if(cfg.id_name !== '' || cfg.begin_end) {
                var elem = cfg.id_name;
                if(cfg.date_range) {
                    if(cfg.begin_end.begin) { elem = cfg.begin_id_name; }
                    else                    { elem = cfg.end_id_name; }
                }

                /* jshint evil: true */
                eval('document.getElementById("' + cfg.id_name + '").focus();');
                /* jshint evil: false */
            }

            if(cfg.onclose_callback) { cfg.onclose_callback(); }
        }
    };

    /* jshint unused: false */
    var select_date = function(_mm, _dd, _yy) {
        try {
            var the_month, the_day, elem;
            if(_mm === undefined || _dd === undefined || _yy === undefined) {
                throw new YoException('undefined paramter(s)');
            }

            _mm++;    // Note: _mm is the month number 0 - 11 so always add 1.

            if(_mm < 10) { the_month = '0' + _mm; }
            else         { the_month = _mm.toString(); }

            if(_dd < 10) { the_day = '0' + _dd;  }
            else         { the_day = _dd.toString();   }

            if(cfg.id_name !== '' || cfg.begin_end) {
                if(cfg.date_range) {
                    if(cfg.begin_end.begin) {
                        elem = cfg.begin_id_name;
                        document.getElementById(cfg.end_id_name).value = '';
                    } else { elem = cfg.end_id_name; }
                    toggle_begin_end();
                } else { elem = cfg.id_name; }

                /* jshint evil: true */
                if(cfg.locale === 'en') {
                    eval('document.getElementById("' + elem +
                         '").value = the_month + "/" + the_day + "/" + _yy');
                } else {
                    eval('document.getElementById("' + elem +
                         '").value = the_day + "/" + the_month + "/" + _yy');
                }
                /* jshint evil: false */
            }

            if(cfg.ondateselected_callback) { cfg.ondateselected_callback(); }
            close_datepicker();
        } catch(e) {
            console.log(e.toString());
            return false;
        }
        return true;
    /* jshint unused: true */
    };

    var text = function(_text) {
        // Create and set a text node and return it.
        var node = document.createTextNode(_text);
        return node;
    };

    var element = function(_name, _attrs) {
        // Create and set an element node and return it.
        var node = document.createElement(_name);
        if(_attrs) {
            if(_attrs.id)      { node.setAttribute('id', _attrs.id); }
            if(_attrs.klass)   { node.setAttribute('class', _attrs.klass); }
            if(_attrs.style)   { node.setAttribute('style', _attrs.style); }
            if(_attrs.colspan) { node.setAttribute('colspan', _attrs.colspan); }
            if(_attrs.value)   { node.setAttribute('value', _attrs.value); }
            if(_attrs.type)    { node.setAttribute('type', _attrs.type); }
        }
        return(node);
    };

    var remove_element = function(_node, _id) {
        if(document.getElementById(_id)) {
            _node.removeChild(document.getElementById(_id));
        }
    };

    var month_inc = function() {
        var scroll_date = new Date(cfg.yy, cfg.mn, cfg.today.getDate());
        if((scroll_date.getFullYear() === cfg.max_date.getFullYear()) &&
           (scroll_date.getMonth() >= cfg.max_date.getMonth())) {
            return;
        }

        if(cfg.mn < 11) { cfg.mn++; }
        else { cfg.mn = 0; cfg.yy++; }
        _yodatepicker.show();
    };

    var month_dec = function() {
        var scroll_date = new Date(cfg.yy, cfg.mn, cfg.today.getDate());
        if((scroll_date.getFullYear() === cfg.min_date.getFullYear()) &&
           (scroll_date.getMonth() <= cfg.min_date.getMonth())) {
            return;
        }

        if(cfg.mn > 0) { cfg.mn--; }
        else { cfg.mn = 11; cfg.yy--; }
        _yodatepicker.show();
    };

    var leap_year = function(yr) {
        return(yr % 400 === 0) || (yr % 4 === 0 && yr % 100 !== 0);
    };

    var get_dow_names = function(locale, dow_heading) {
        var names = [];
        switch(dow_heading) {
            case 'single_name':
                names = dow_single_names(locale);
                break;
            case 'short_name':
                names = dow_short_names(locale);
                break;
            case 'full_name':
                names = dow_full_names(locale);
                break;
            default:
                names = dow_single_names(locale);
        }
        return names;
    };

    var dow_single_names = function(locale) {
        var names = [];
        switch(locale) {
            case 'es':
                names = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
                break;
            case 'fr':
                names = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
                break;
            case 'de':
                names = ['S', 'M', 'D', 'M', 'D', 'F', 'S'];
                break;
            default:
                names = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        }
        return names;
    };

    var dow_short_names = function(locale) {
        var names = [];
        switch(locale) {
            case 'es':
                names = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
                break;
            case 'fr':
                names = ['Dim', 'Lu', 'Ma', 'Me', 'Jeu', 'Vend', 'Sam'];
                break;
            case 'de':
                names = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
                break;
            default:
                names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        }
        return names;
    };

    var dow_full_names = function(locale) {
        var names = [];
        switch(locale) {
            case 'es':
                names = ['Domingo', 'Lunes', 'Martes', 'Miercoles',
                         'Jueves', 'Viernes', 'Sabado'];
                break;
            case 'fr':
                names = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi',
                         'Jeudi', 'Vendredi', 'Samedi'];
                break;
            case 'de':
                names = ['zondag', 'maandag', 'dinsdag', 'woensdag',
                         'donderdag', 'vrijdag', 'zaterdag'];
                break;
            default:
                names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                         'Thursday', 'Friday', 'Saturday'];
        }
        return names;
    };

    var get_month_names = function(locale) {
        if(locale === undefined || locale === null) { locale = 'en'; }

        if(locale === 'es') {
            return(['Enero', 'Febrero', 'Marzo', 'Abril',
                    'Mayo', 'Junio', 'Julio', 'Augosto',
                    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']);
        }
        else if(locale === 'fr') {
            return(['Janvier', 'Fevrier', 'Mars', 'Avril',
                    'Mai', 'Juin', 'Juillet', 'Aout',
                    'Septembre', 'Octobre', 'Novembre', 'Decembre']);
        }
        else if(locale === 'de') {
            return(['Januar', 'Februar', 'Marz', 'April',
                    'Mai', 'Juni', 'Juli', 'August',
                    'September', 'Oktober', 'November', 'Dezember']);
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
            case '*':  // infinity
                year = 3125;
                break;
            default:   // default to '1Y'
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

    var cfg = configure(options);

    // This object is returned and represents the public properties and methods.
    var _yodatepicker = {
        version: 'yo-da',

        hide: function() {
            close_datepicker();
        },

        set_min_date: function(mdate) {
            // This will override the cfg.min_date param.
            if(!mdate instanceof Date) { return false; }

            cfg.min_date = mdate;

            cfg.mn = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                     cfg.min_date.getMonth() : cfg.currdate.getMonth();

            cfg.yy = (cfg.currdate.getTime() < cfg.min_date.getTime()) ?
                     cfg.min_date.getFullYear() : cfg.currdate.getFullYear();

            return cfg.min_date;
        },

        create_title_header: function(params) {
            // Creates the header on the yodatepicker.
            try {
                if(!params.tbody || !params.month || !params.year) {
                    throw new YoException(params);
                }

                var tr_class = 'yo-calendar-title-bar' + params.multi_cal;
                var tr = params.tbody.appendChild(
                                      element('tr', { klass: tr_class }));
                var yo_id = params.yo_id;

                // previous month navigation element
                var prev_style = 'yo-previous-month' + params.multi_cal;
                var prev_id = yo_id + '-prev-month' + params.multi_cal + '-' +
                              params.calendar_number;

                if(cfg.prev_fa_class) {
                    tr.appendChild(element('td', {klass: prev_style, colspan: '1'}))
                      .appendChild(element('span', {id: prev_id}))
                      .appendChild(element('i', {klass: cfg.prev_fa_class}));
                } else {
                    tr.appendChild(element('td', {klass: prev_style, colspan: '1'}))
                      .appendChild(element('span', {id: prev_id}))
                      .appendChild(text('<'));
                }

                // month name element
                var text_style = 'yo-calendar-month' + params.multi_cal;
                tr.appendChild(element('td', {klass: text_style, colspan: '5'}))
                  .appendChild(text(params.month + ' ' + params.year));

                // next month navigation element
                var next_style = 'yo-next-month' + params.multi_cal;
                var next_id = yo_id + '-next-month' + params.multi_cal + '-' +
                              params.calendar_number;
                if(cfg.next_fa_class) {
                    tr.appendChild(element('td', {klass: next_style, colspan: '1'}))
                      .appendChild(element('span', {id: next_id}))
                      .appendChild(element('i', {klass: cfg.next_fa_class}));
                } else {
                    tr.appendChild(element('td', {klass: next_style, colspan: '1'}))
                      .appendChild(element('span', {id: next_id}))
                      .appendChild(text('>'));
                }

                // suppress inner nav buttons
                if(params.calendar_number > 0) {
                    prev_id = 'yo-previous-month-multi';
                    document.getElementsByClassName(prev_id)[1].innerHTML = '';
                    document.getElementsByClassName(prev_id)[1].style.cursor = 'default';
                    next_id = 'yo-next-month-multi';
                    document.getElementsByClassName(next_id)[0].innerHTML = '';
                    document.getElementsByClassName(next_id)[0].style.cursor = 'default';
                }
            } catch(e) {
                console.log(e.toString());
                return false;
            }
            return true;
        },

        create_dow_header: function(params) {
            // Creates the day-of-week header for yodatepicker.
            try {
                if(!params.tbody) { throw new YoException(params.tbody); }
                var tr = params.tbody.appendChild(element('tr'));
                var td_class = 'yo-calendar-dow-title' + params.multi_cal;
                for(var i = 0; i < cfg.day_names.length; i++) {
                    tr.appendChild(element('td', {klass: td_class}))
                      .appendChild(text(cfg.day_names[i]));
                }
            } catch(e) {
                console.log(e.toString());
                return false;
            }
            return true;
        },

        create_empty_week: function(tbody_node) {
            // Creates an entire week with empty days.
            try {
                if(!tbody_node) { throw new YoException(tbody_node); }
                var multi_cal = (cfg.months_to_display > 1) ? '-multi' : '';
                var td_class = 'yo-datepicker-day-empty' + multi_cal;
                var tr = tbody_node.appendChild(element('tr'));
                for(var i = 0; i < 7; i++) {
                    tr.appendChild(element('td', {klass: td_class}))
                      .appendChild(text(' '));
                }
            } catch(e) {
                console.log(e.toString());
                return false;
            }
            return true;
        },

        create_day: function(tr, content, _id, _klass) {
            // Styles for a single day (cell) should be one of these classes:
            //
            // .yo-datepicker-day           // day is selectable
            // .yo-datepicker-day-current   // day is the current day
            // .yo-datepicker-day-empty     // empty content
            // .yo-datepicker-day-noselect  // day is not selectable
            //
            // .yo-datepicker-day-multi           // day is selectable
            // .yo-datepicker-day-current-multi   // day is the current day
            // .yo-datepicker-day-empty-multi     // empty content
            // .yo-datepicker-day-noselect-multi  // day is not selectable
            try {
                tr.appendChild(element('td', {klass: _klass, id: _id}))
                  .appendChild(text(content));
            } catch(e) {
                console.log(e.toString());
                return false;
            }
            return true;
        },

        /* jshint maxstatements: false */
        create_month_calendar: function(params) {
            var tbody_node = false;
            for(var i = 0; i < cfg.months_to_display; i++) {
                var table_class = 'yo-calendar' + params.multi_cal;
                tbody_node = params.td_node
                    .appendChild(element('table', {klass: table_class}))
                    .appendChild(element('tbody'));

                citem.day = 1;
                citem.month = cfg.mn;
                citem.year = cfg.yy;

                if(i > 0) {
                    if(cfg.mn < 11) { citem.month = cfg.mn +1; }
                    else { citem.month = 0; citem.year = cfg.yy +1; }
                }

                cfg.currdate.setDate(1); // set day of month to the 1st
                cfg.currdate.setMonth(citem.month); // set the month
                cfg.currdate.setFullYear(citem.year); // set to 4-digit year

                citem.offset = 0;
                citem.first_dow = cfg.currdate.getDay(); // 0 - 6 (sun - sat)
                citem.total_days = days_in_month(cfg.currdate.getMonth(),
                                                 cfg.currdate.getFullYear());

                this.create_title_header({
                    tbody: tbody_node,
                    month: cfg.month_names[citem.month],
                    year: citem.year,
                    calendar_number: i,
                    multi_cal: params.multi_cal,
                    yo_id: params.yo_id
                });

                this.create_dow_header({
                    tbody: tbody_node,
                    multi_cal: params.multi_cal
                });

                var weeks_created = 0;
                for(var j = 0; j < 6; j++) {
                    if(citem.first_dow === 999) { break; }
                    var yo_tbody_tr = tbody_node.appendChild(element('tr'));
                    for(var k = 0; k < 7; k++) {
                        citem.markup({
                            yo_id: params.yo_id,
                            tr_node: yo_tbody_tr,
                            multi_cal: params.multi_cal
                        });
                    }
                    weeks_created++;
                }

                // Output empty rows if needed so we have 6 rows total.
                for(var b = 0; b < (6-weeks_created); b++) {
                    this.create_empty_week(tbody_node);
                }
            }
            return tbody_node;
        },
        /* jshint maxstatements: 25 */

        set_custom_nav_colors: function() {
            if(cfg.prev_month_nav_color) {
                var klass_name = 'yo-previous-month-multi';
                var items = document.getElementsByClassName(klass_name);
                for(var i = 0; i < items.length; i++) {
                    items[i].style.color = cfg.prev_month_nav_color;
                }
            }

            if(cfg.next_month_nav_color) {
                var klass_name = 'yo-next-month-multi';
                var items = document.getElementsByClassName(klass_name);
                for(var i = 0; i < items.length; i++) {
                    items[i].style.color = cfg.next_month_nav_color;
                }
            }
        },

        /* jshint loopfunc: true */
        set_custom_day_colors: function() {
            var klass_cell = 'yo-datepicker-day-multi';
            var klass_item = 'yo-rate-item';
            if(cfg.day_mouseover_bgcolor && cfg.day_mouseover_fgcolor) {
                // when mouseover this element change colors
                var items = document.getElementsByClassName(klass_cell);
                for(var i = 0; i < items.length; i++) {
                    items[i].onmouseover = function(event) {
                        var id = event.srcElement.id;
                        if(!id) { id = event.srcElement.parentElement.id; }
                        var elem = document.getElementById(id);
                        if(!elem) { return; }
                        var day_item = elem.getElementsByClassName(klass_item);
                        day_item[0].style.color = cfg.day_mouseover_fgcolor;
                        elem.style.backgroundColor = cfg.day_mouseover_bgcolor;
                    };
                }
            }

            if(cfg.day_mouseleave_bgcolor && cfg.day_mouseleave_fgcolor) {
                // initialize (override) the foreground colors
                var items = document.getElementsByClassName(klass_item);
                for(var i = 0; i < items.length; i++) {
                    items[i].style.color = cfg.day_mouseleave_fgcolor;
                }

                // when mouseleave this element change colors
                items = document.getElementsByClassName(klass_cell);
                for(var i = 0; i < items.length; i++) {
                    items[i].onmouseleave = function(event) {
                        var id = event.srcElement.id;
                        if(!id) { id = event.srcElement.parentElement.id; }
                        var elem = document.getElementById(id);
                        if(!elem) { return; }
                        var day_item = elem.getElementsByClassName(klass_item);
                        day_item[0].style.color = cfg.day_mouseleave_fgcolor;
                        elem.style.backgroundColor = cfg.day_mouseleave_bgcolor;
                    };
                }
             }
        },
        /* jshint loopfunc: false */

        /* jshint maxstatements: false */
        show: function() {
            var yo_id = 'yo-' + cfg.dp_id_name;
            var root_node = document.getElementById(cfg.dp_id_name);
            var multi_cal = (cfg.months_to_display > 1) ? '-multi' : '';

            if(!root_node) { throw new YoException(root_node); }

            if(document.getElementById(yo_id)) {
                remove_element(root_node, yo_id);
            }

            var td_node = root_node
                .appendChild(element('table', {id: yo_id, klass: 'yo-content'}))
                .appendChild(element('tbody')).appendChild(element('tr'))
                .appendChild(element('td'));

            this.create_month_calendar({
                td_node: td_node,
                yo_id: yo_id,
                multi_cal: multi_cal
            });

            this.set_custom_nav_colors();
            this.set_custom_day_colors();

            // Attach event listeners for the previous and next buttons.
            var prev_month_id = yo_id + '-prev-month' + multi_cal + '-';
            var next_month_id = yo_id + '-next-month' + multi_cal + '-';
            var elem;
            for(var x = 0; x < cfg.months_to_display; x++) {
                elem = document.getElementById(prev_month_id + x);
                if(elem) {
                    elem.onclick = month_dec;
                    elem.style.display = 'block';
                }

                elem = document.getElementById(next_month_id + x);
                if(elem) {
                    elem.onclick = month_inc;
                    elem.style.display = 'block';
                }
            }

            // Attach event listeners to the following events so that the
            // datepicker will close when the user clicks outside the calendar.
            document.getElementsByTagName('body')[0]
                    .onmousedown = close_datepicker;

            // Event onmouseover is set to disable onmousedown so that when
            // mouseover the datepicker, mousedown doesn't close it.
            document.getElementById(yo_id).onmouseover = function(e) {
                // IE 7-8 does not support event.currentTarget but does 
                // so for event.srcElement;
                var elem, elem_id, ev = e || window.event;

                try { elem = ev.currentTarget; }
                catch(err) { elem = ev.srcElement; }

                try { elem_id = elem.id; }
                catch(err) { elem_id = (elem) ? elem : yo_id; }

                if(elem_id) {
                    document.getElementById(elem_id).onmouseover = function() {
                        document.getElementsByTagName('body')[0]
                                .onmousedown = null;
                    };
                }
                document.getElementsByTagName('body')[0].onmousedown = null;
            };

            // Event onmouseout is set to close_datepicker.
            document.getElementById(yo_id).onmouseout = function(e) {
                // IE 7-8 does not support event.currentTarget but does
                // so for event.srcElement;
                var elem, elem_id, ev = e || window.event;

                try { elem = ev.currentTarget; }
                catch(err) { elem = ev.srcElement; }

                try { elem_id = elem.id; }
                catch(err) { elem_id = (elem) ? elem : yo_id; }

                if(elem_id) {
                    document.getElementById(elem_id).onmouseout = function() {
                        document.getElementsByTagName('body')[0]
                                .onmousedown = close_datepicker;
                    };
                }
                document.getElementsByTagName('body')[0]
                        .onmousedown = close_datepicker;
            };

            // Bind event listeners to each day for the onclick event.
            // Get an array of elements by the class name so we can get
            // each element id name to bind the onclick handler.
            var day_selectors = 'yo-datepicker-day' + multi_cal;
            var day_tds = document.getElementsByClassName(day_selectors);
            for(var y = 0; y < day_tds.length; y++) {
                // string to match: 'yo-rates_calendar_id_9_22_2014'
                // Split on '_' then we can use the last three elements.
                var items = day_tds[y].id.split('_');
                var mmtmp = items[items.length -3];
                var ddtmp = items[items.length -2];
                var yytmp = items[items.length -1];
                var t_id = yo_id + '_' + mmtmp + '_' + ddtmp + '_' + yytmp;
                var s  = 'document.getElementById("' + t_id + '")' +
                         '.onclick = function() { select_date(' +
                          mmtmp + ',' + ddtmp + ',' + yytmp + '); };';
                if(document.getElementById(t_id)) {
                    /* jshint evil: true */
                    eval(s);
                    /* jshint evil: false */
                }
            }

            // The current day node will have a different class name so
            // we get that and bind the onclick handler.
            var selector = 'yo-datepicker-day-current' + multi_cal;
            var curr_day_td = document.getElementsByClassName(selector);
            if(curr_day_td.length > 0) {
                var items = curr_day_td[0].id.split('_');
                var mmtmp = items[items.length -3];
                var ddtmp = items[items.length -2];
                var yytmp = items[items.length -1];
                var t_id = yo_id + mmtmp + '_' + ddtmp + '_' + yytmp;
                var s  = 'document.getElementById("' + t_id + '")' +
                         '.onclick = function() ' + '{ select_date(' +
                         mmtmp + ',' + ddtmp + ',' + yytmp + '); };';
                if(document.getElementById(t_id)) {
                    /* jshint evil: true */
                    eval(s);
                    /* jshint evil: false */
                }
            }

            return true;
        }
    };
        /* jshint maxstatements: 25 */

    return _yodatepicker;
};
