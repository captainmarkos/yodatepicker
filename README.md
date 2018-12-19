# yodatepicker

### Just another javascript datepicker with options.
Yodatepicker is a javascript calendar that has zero dependencies. It was developed to be used as
a datepicker / calendar and to work on any site with no conflicts with other javascript libraries
such as jquery.

### Example Usage
Consider this scenario: You build a widget to be placed on a website. This widget has a datepicker
and uses the jquery-ui datepicker.  The widget is given to the client to embed on their web page
however the client's site uses jquery version x.  Your widget uses jquery version y and so you
encounter jquery version conflicts.  Maybe the client's site doesn't use jquery in which case it
works.  Maybe you change the widget to use the client's version of jquery and it works. Or maybe...
you just use a plain javascript datepicker and then you have no issues at all!  This is what we
needed so yodatepicker it is!

Here's a simple usage:
```
var checkin_datepicker = yodatepicker({
    dp_id_name: 'dp_start_date', // selector id where to display the datepicker
    id_name: 'start_date',       // selector id where to populate a selected date
    max_date: '1Y'               // datepicker calendar will scroll 1 year
});
```

```
<div>
    <input type="text" id="start_date" value="mm/dd/yyyy" />
    <img src="images/icon_calendar.gif" onclick="checkin_datepicker.show();" />
    <div id="dp_start_date"></div>
</div>
```
With yodatepicker you can create datepicker style calendars or regular static calendars.  There
are html files in the `app/` directory that have working examples of how to use yodatepicker.


### Supplying content for dates
Yodatepicker can display content for given days on the calendar, for example hotel rates.

Example of data to display content for dates:
```
// yodatepicker needs it in this format:
var cell_content = [
    { '10_28_2014': '209.00' },
    { '10_29_2014': '189.00' },
    { '10_30_2014': '169.00' },
    { '11_1_2014' : '169.00' }
];

// create a datepicker / calendar to display rates
var my_datepicker = yodatepicker({
    dp_id_name: 'dp_price_calendar',
    id_name: 'price_calendar',
    months_to_display: 2,       // display two months
    close_onselect: false,      // display the calendar all the time
    max_date: '3M',
    min_date: new Date(),
    locale: 'en',
    cell_content: cell_content
});
```

### Minified javascript
Running `grunt build` will generate the min.js files.

### Tests
Currently there is no test coverage for yodatepicker (hopefully this will change).
Jshint is being used and can be evoked by running:
```
~> grunt test
```
