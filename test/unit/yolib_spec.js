'use strict';

describe('yolib', function() {
    var today = new Date();
    var res, diff;

    it('#get_max_date', function() {
        res = yolib.get_max_date(new Date());
        diff = res.getMonth() - today.getMonth();
        expect(diff).toEqual(0);

        res = yolib.get_max_date('3M');
        if(res.getMonth() < today.getMonth()) {
            diff = (res.getMonth() + 12) - today.getMonth();
        } else {
            diff = res.getMonth() - today.getMonth();
        }
        expect(diff).toEqual(3);

        res = yolib.get_max_date('6M');
        if(res.getMonth() < today.getMonth()) {
            diff = (res.getMonth() + 12) - today.getMonth();
        } else {
            diff = res.getMonth() - today.getMonth();
        }
        expect(diff.toString()).toMatch(/[6|7]/);

        res = yolib.get_max_date('9M');
        if(res.getMonth() < today.getMonth()) {
            diff = (res.getMonth() + 12) - today.getMonth();
        } else {
            diff = res.getMonth() - today.getMonth();
        }
        expect(diff.toString()).toMatch(/[9|10]/);

        res = yolib.get_max_date('1Y');
        diff = res.getFullYear() - today.getFullYear();
        expect(diff).toEqual(1);

        res = yolib.get_max_date();  // defaults to 1Y
        diff = res.getFullYear() - today.getFullYear();
        expect(diff).toEqual(1);

        res = yolib.get_max_date('2Y');
        diff = res.getFullYear() - today.getFullYear();
        expect(diff).toEqual(2);

        res = yolib.get_max_date('*');
        diff = res.getFullYear() - today.getFullYear();
        expect(diff).toBeGreaterThan(10);
    });

    it('#get_min_date', function() {
        res = yolib.get_min_date(new Date());
        diff = res.getMonth() - today.getMonth();
        expect(diff).toEqual(0);

        res = yolib.get_min_date('3M');
        if(res.getMonth() < today.getMonth()) {
            diff = (today.getMonth() + 1) - res.getMonth();
            expect(diff).toEqual(3);
        } else {
            diff = res.getMonth() - today.getMonth();
            expect(diff).toEqual(9);
        }

        res = yolib.get_min_date('6M');
        if(res.getMonth() < today.getMonth()) {
            diff = (today.getMonth() + 1) - res.getMonth();
        } else {
            diff = res.getMonth() - today.getMonth();
        }
        expect(diff.toString()).toMatch(/[6|7]/);

        res = yolib.get_min_date('9M');
        if(res.getMonth() < today.getMonth()) {
            diff = (today.getMonth() + 1) - res.getMonth();
            expect(diff.toString()).toMatch(/[9|10]/);
        } else {
            diff = res.getMonth() - today.getMonth();
            expect(diff).toEqual(3);
        }

        res = yolib.get_min_date('1Y');
        if(res.getMonth() === today.getMonth()) {
            diff = (today.getFullYear() - res.getFullYear()) + 11;
        } else if(res.getMonth() < today.getMonth()) {
            diff = (today.getMonth() + 1) - res.getMonth();
        } else {
            diff = res.getMonth() - today.getMonth();
        }
        expect(diff).toEqual(12);

        res = yolib.get_min_date('1Y');
        diff = today.getFullYear() - res.getFullYear();
        expect(diff).toEqual(1);

        res = yolib.get_min_date('2Y');
        diff = today.getFullYear() - res.getFullYear();
        expect(diff).toEqual(2);

        res = yolib.get_min_date();  // defaults to current date
        expect(res.getMonth()).toEqual(today.getMonth());
        expect(res.getFullYear()).toEqual(today.getFullYear());

        res = yolib.get_min_date('*');  // infinity (relatively)
        diff = today.getFullYear() - res.getFullYear();
        expect(diff).toBeGreaterThan(10);
    });

    it('#get_dow_names', function() {
        res = yolib.get_dow_names('en');
        expect(res).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);

        res = yolib.get_dow_names('en', 'single_name');
        expect(res).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);

        res = yolib.get_dow_names('en', 'short_name');
        expect(res).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

        res = yolib.get_dow_names('en', 'full_name');
        expect(res).toEqual(['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                             'Thursday', 'Friday', 'Saturday']);
    });

    it('#get_dow_names locales es, fr, de', function() {
        res = yolib.get_dow_names('es');
        expect(res.length).toEqual(7);
        res = yolib.get_dow_names('fr');
        expect(res.length).toEqual(7);
        res = yolib.get_dow_names('de');
        expect(res.length).toEqual(7);

        res = yolib.get_dow_names('es', 'short_name');
        expect(res.length).toEqual(7);
        res = yolib.get_dow_names('fr', 'short_name');
        expect(res.length).toEqual(7);
        res = yolib.get_dow_names('de', 'short_name');
        expect(res.length).toEqual(7);

        res = yolib.get_dow_names('es', 'full_name');
        expect(res.length).toEqual(7);
        res = yolib.get_dow_names('fr', 'full_name');
        expect(res.length).toEqual(7);
        res = yolib.get_dow_names('de', 'full_name');
        expect(res.length).toEqual(7);
    });

    it('#get_month_names', function() {
      var months = ['January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December']

      res = yolib.get_month_names();
      expect(res).toEqual(months);
    });

    it('#get_month_names locale es, fr, de', function() {
      var months = ['January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December']

      res = yolib.get_month_names('es');
      expect(res[0]).toEqual('Enero');

      res = yolib.get_month_names('fr');
      expect(res[0]).toEqual('Janvier');

      res = yolib.get_month_names('de');
      expect(res[0]).toEqual('Januar');
    });

    it('#days_in_month', function() {
      res = yolib.days_in_month(2, 2019);  // Mar
      expect(res).toEqual(31);

      res = yolib.days_in_month(3, 2019);  // Apr
      expect(res).toEqual(30);

      res = yolib.days_in_month(1, 2017);  // Feb
      expect(res).toEqual(29);

      res = yolib.days_in_month(1, 2020);  // Feb - leap year
      expect(res).toEqual(28);
    });
});
