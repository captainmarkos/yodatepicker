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

    var root_node = document.getElementById(dp_id_name);
    var tbody_node, tbody_tr_node;
    var yo_id = 'yo-' + dp_id_name;

    if(!root_node) { console.log('root_node is invalid'); return; }

    tbody_node = root_node.appendChild(element('div', {id: dp_id_name, klass: 'yo-container'}))
                      .appendChild(element('table', {id: yo_id, klass: 'yo-content'}))
                      .appendChild(element('tbody'))
                      .appendChild(element('tr'))
                      .appendChild(element('td'))
                      .appendChild(element('table', {klass: 'yo-calendar'}))
                      .appendChild(element('tbody'));


    create_title_header(tbody_node);

    create_dow_header(tbody_node);

    create_week(tbody_node);

    // create the days
    for(var week = 1; week <=4; week++) {
        var tbody_tr_node = tbody_node.appendChild(element('tr'));
        for(var day = 1; day <=7; day++) {
            create_day(tbody_tr_node, day*week, '', 'yo-datepicker-day');
        }
    }
};

var create_day = function(tbody_tr_node, content, _id, _klass) {
    tbody_tr_node.appendChild(element('td', {klass: _klass, id: _id}))
               .appendChild(text(content));
};

var create_week = function(tbody_node) {
    var dp_id_name = 'dp_start_date';
    var klass = '', id = '';

    console.log('create_week()');
    console.log(tbody_node);
    var tbody_tr_node = tbody_node.appendChild(element('tr'));

    // klass = 'yo-datepicker-day';          // day (cell) has a day number and is selectable
    // klass = 'yo-datepicker-day-current';  // day (cell) is the current day
    // klass = 'yo-datepicker-day-noselect'; // day (cell) has a day but is not selectable
    // klass = 'yo-datepicker-day-empty';    // day (cell) is empty

    id = 'yo-' + dp_id_name + '_9-1-2014';  // 'jrdp_dp_start_date_9-1_2014';
    klass = 'yo-datepicker-day-empty';
    tbody_tr_node.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text(' '));
    klass = 'yo-datepicker-day';
    tbody_tr_node.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text(' '));

    klass = 'yo-datepicker-day';
    tbody_tr_node.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('1'));

    klass = 'yo-datepicker-day-current';
    tbody_tr_node.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('2'));

    klass = 'yo-datepicker-day-noselect';
    tbody_tr_node.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('3'));

    klass = 'yo-datepicker-day-noselect';
    tbody_tr_node.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('4'));

    klass = 'yo-datepicker-day-noselect';
    tbody_tr_node.appendChild(element('td', {klass: klass, id: id}))
               .appendChild(text('5'));

};

var create_title_header = function(tbody_node) {
    // Creates the title heading for yodatepicker which includes navigation
    // and the current month name.
    // [previous] MONTH NAME [next]
    var dp_id_name = 'dp_start_date';

    console.log('create_title_header()');
    console.log(tbody_node);
    var tbody_tr_node = tbody_node.appendChild(element('tr', {klass: 'yo-calendar-title-bar'}));


    var prev_month_id = 'yo-' + dp_id_name + '-prevmonth_0';
    tbody_tr_node.appendChild(element('td', {klass: 'yo-previous-month', colspan: '1'}))
               .appendChild(element('span', {id: prev_month_id, style: 'display: block;'}))
               .appendChild(text('<'));

    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-month', colspan: '5'}))
               .appendChild(text('October 2014'));

    var next_month_id = 'yo-' + dp_id_name + '-nextmonth_0';
    tbody_tr_node.appendChild(element('td', {klass: 'yo-next-month', colspan: '1'}))
               .appendChild(element('span', {id: next_month_id, style: 'display: block;'}))
               .appendChild(text('>'));
};

var create_dow_header = function(tbody_node) {
    // Creates the day-of-week heading for yodatepicker.
    //
    console.log('create_dow_header()');
    console.log(tbody_node);
    var tbody_tr_node = tbody_node.appendChild(element('tr'));

    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('S'));  // Sunday


    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('M'));  // Monday

    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('T'));  // Tuesday

    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('W'));  // Wednesday

    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('T'));  // Thursday

    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('F'));  // Friday

    tbody_tr_node.appendChild(element('td', {klass: 'yo-calendar-dow-title'}))
               .appendChild(text('S'));  // Saturday
};
/* jshint maxstatements: 20 */

