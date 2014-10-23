'use strict';

var text = function(_text) {
    var node = document.createTextNode(_text);
    return node;
};

var element = function(_name, _attrs) {
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

/* jshint maxstatements: false */
var build_dom = function() {
    console.log('--> build_dom() fired!');

    var dp_id_name = 'dp_start_date';

    var yo_root = document.getElementById(dp_id_name);
    var yo_tbody, yo_tbody_tr;
    var yo_id = 'yo-' + dp_id_name;

    if(!yo_root) { console.log('yo_root is invalid'); return; }

    yo_tbody = yo_root.appendChild(element('div', {id: dp_id_name, klass: 'yo-container'}))
                      .appendChild(element('table', {id: yo_id, klass: 'yo-content'}))
                      .appendChild(element('tbody'))
                      .appendChild(element('tr'))
                      .appendChild(element('td'))
                      .appendChild(element('table', {klass: 'yo-calendar'}))
                      .appendChild(element('tbody'));


    create_title_header(yo_tbody);

    create_dow_header(yo_tbody);

    create_week(yo_tbody);
    create_week(yo_tbody);
    create_week(yo_tbody);
    create_week(yo_tbody);

};
var create_week = function(yo_tbody) {
    var dp_id_name = 'dp_start_date';
    var klass = '', id = '';

    console.log('create_week()');
    console.log(yo_tbody);
    var yo_tbody_tr = yo_tbody.appendChild(element('tr'));

    // Styles for the cells that represent the day of the week:
    //
    // klass = 'yo-empty-day-cell';          // day (cell) is empty
    // klass = 'yo-datepicker-day';          // day (cell) has a day number and is selectable
    // klass = 'yo-datepicker-day-noselect'; // day (cell) has a day but is not selectable

    id = 'yo-' + dp_id_name + '_9-1-2014';  // 'jrdp_dp_start_date_9-1_2014';
    klass = 'yo-empty-day-cell';
    yo_tbody_tr.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text(' '));
    yo_tbody_tr.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text(' '));

    klass = 'yo-datepicker-day';
    yo_tbody_tr.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('1'));

    klass = 'yo-datepicker-day';
    yo_tbody_tr.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('2'));

    klass = 'yo-datepicker-day-noselect';
    yo_tbody_tr.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('3'));

    klass = 'yo-datepicker-day-noselect';
    yo_tbody_tr.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('4'));

    klass = 'yo-datepicker-day-noselect';
    yo_tbody_tr.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('5'));

};

var create_title_header = function(yo_tbody) {
    // Creates the title heading for yodatepicker which includes navigation
    // and the current month name.
    // [previous] MONTH NAME [next]
    var dp_id_name = 'dp_start_date';

    console.log('create_title_header()');
    console.log(yo_tbody);
    var yo_tbody_tr = yo_tbody.appendChild(element('tr', {klass: 'yo-calendar-title-bar'}));


    var prev_month_id = 'yo-' + dp_id_name + '-prevmonth_0';
    yo_tbody_tr.appendChild(element('td', {klass: 'yo-previous-month', colspan: '1'}))
               .appendChild(element('span', {id: prev_month_id, style: 'display: block;'}))
               .appendChild(text('<'));

    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-month', colspan: '5'}))
               .appendChild(text('October 2014'));

    var next_month_id = 'yo-' + dp_id_name + '-nextmonth_0';
    yo_tbody_tr.appendChild(element('td', {klass: 'yo-next-month', colspan: '1'}))
               .appendChild(element('span', {id: next_month_id, style: 'display: block;'}))
               .appendChild(text('>'));
};

var create_dow_header = function(yo_tbody) {
    // Creates the day-of-week heading for yodatepicker.
    //
    console.log('create_dow_header()');
    console.log(yo_tbody);
    var yo_tbody_tr = yo_tbody.appendChild(element('tr'));

    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('S'));  // Sunday


    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('M'));  // Monday

    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('T'));  // Tuesday

    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('W'));  // Wednesday

    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('T'));  // Thursday

    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('F'));  // Friday

    yo_tbody_tr.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('S'));  // Saturday
};
/* jshint maxstatements: 20 */

