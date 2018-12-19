# yodatepicker

### Just another javascript datepicker with options.

### Tests
Currently there is no test coverage for yodatepicker (hopefully this will change).
Jshint is being used and can be evoked by running:
```
~> grunt test
```

### Minified javascript
Running `grunt build` will generate the min.js files.

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
