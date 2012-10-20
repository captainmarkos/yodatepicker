jrDatePicker
============

Javascript DatePicker

This datapicker implementation is intended to be stand-alone, that is no
external files are used.  As much as I really like jquery, jquery-ui and 
others, I got tired of running into conflicts and/or issues of some sort.
So I created a simple datapicker that relies on nothing else, just pure
javascript (no jquery).

Usage
=====
var my_datepicker = jrDatePicker({
    dp_id_name: 'disp_datepicker',    // datepicker is displayed here
    id_name: 'start_date',            // selected date is inserted here
    locale: 'fr',                     // setting locale to french
    max_date: '3M',                   // maximum selectable date
    min_date: '3M',                   // minimum selectable date
    onDateSelected: function() {alert("onDateSelected callback");},
    onClose: function() {alert("onClose callback");}
});
