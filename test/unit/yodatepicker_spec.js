'use strict';

describe('yodatepicker', function() {
    it('is defined', function() {
        var checkin_datepicker = yodatepicker({});
        expect(checkin_datepicker).toBeDefined();
    });

    it('single datepicker min: current date max: current + 1yr', function() {
        var checkin_datepicker = yodatepicker({
            dp_id_name: 'dp_start_date', // selector id where to display the datepicker
            id_name: 'start_date',       // selector id where to populate a selected date
            max_date: '1Y'               // datepicker calendar will scroll 1 year
        });
        expect(checkin_datepicker).toBeDefined();
    });
});
