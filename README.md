yodatepicker

Just another javascript datepicker with options.


~/local/src/javascript/yodatepicker> date
Wed Oct 22 20:40:08 EDT 2014


Sample content to display content for dates:


    // Perhaps some repsonse form some an API.
    var response = [
        { rate: { date: '2014-11-28', price: '209.00' }},
        { rate: { date: '2014-11-29', price: '189.00' }},
        { rate: { date: '2014-11-30', price: '169.00' }},
        { rate: { date: '2014-12-01', price: '169.00' }}
    ];

    // The yodatepicker needs it in this format:
    var cell_content = [
        { '10_28_2014': '209.00' },
        { '10_29_2014': '189.00' },
        { '10_30_2014': '169.00' },
        { '11_1_2014' : '169.00' }
    ];


    var convert_to_yo_cell_format = function(response) {
        var key, value, data = [];
        for(var i = 0; i < response.length; i++) {
            key = response[i].rate.date;
            value = response[i].rate.price;
            data[i] = {};
            // NOTE: The key must be a string representing the date
            // that the value is to used.  The format of key is:
            // Date.getMonth() . '_' + Date.getDay() + '_' + Date.getFullYear()
            data[i][key] = value;
        }
        return data;
    };

    var double_datepicker = yodatepicker({
        dp_id_name: 'dp_price_calendar',
        id_name: 'price_calendar',
        months_to_display: 2,       // display two months
        close_onselect: false,      // display the calendar all the time
        max_date: '3M',
        min_date: new Date(),
        locale: 'en',
        cell_content: convert_to_yo_cell_format(response)
    });





