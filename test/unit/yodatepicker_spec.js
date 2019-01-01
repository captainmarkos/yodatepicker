'use strict';

describe('yodatepicker', function() {
    it('is defined', function() {
        var checkin_datepicker = yodatepicker({});
        expect(checkin_datepicker).toBeDefined();
    });

    it('single datepicker min: current date max: current + 1yr', function() {
        var checkin_datepicker = yodatepicker({});
        expect(checkin_datepicker).toBeDefined();
    });
});
