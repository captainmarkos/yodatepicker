/* uses yolib.js */

var yoconfig = {
    config: {},
    prepare: function(opts) {
        this.config = {
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
            max_date: yolib.get_max_date((opts.max_date || '1Y')),

            // Min date user can scroll backward to.
            min_date: yolib.get_min_date((opts.min_date || '*')),

            // An array of objects with dates as the key and the content
            // as the value where the value is the content to be included
            // for that date.
            cell_content: opts.cell_content || null,

            // A url to make a request for the cell content.
            cell_content_url: opts.cell_content_url || null,

            // if set to true will ignore normal price configurations and pass
             // the data through as is
             use_custom_content: opts.use_custom_content || false,

            currency_code: opts.currency_code || 'USD',

            // Sets the day of week name: single_name, short_name, full_name.
            dow_heading: opts.dow_heading || 'single_name',

            // Tells yodatepicker that the user wants to use a date range.
            // The first date selected will become the begin date and then
            // the second date selected will become the end date.
            use_date_range: opts.use_date_range || false,

            // If use_date_range then this is the element id where to
            // populate the selected start date.
            begin_id_name: opts.begin_id_name || '',

            // If use_date_range then this is the element id where to
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

            // These options go together for hovering.
            rate_mouseover_fgcolor: opts.rate_mouseover_fgcolor || '',
            day_mouseover_bgcolor: opts.day_mouseover_bgcolor || '',
            day_mouseover_fgcolor: opts.day_mouseover_fgcolor || '',
            selected_rate_color: opts.selected_rate_color || '',

            rate_mouseleave_fgcolor: opts.rate_mouseleave_fgcolor || '',
            day_mouseleave_bgcolor: opts.day_mouseleave_bgcolor || '',
            day_mouseleave_fgcolor: opts.day_mouseleave_fgcolor || '',

            current_start_date: opts.current_start_date || '',
            current_stop_date: opts.current_stop_date || ''
        };

        // TODO: Clean up this below.
        this.config.today = new Date(this.config.currdate.getFullYear(),
                             this.config.currdate.getMonth(),
                             this.config.currdate.getDate());

        // array of month names
        this.config.month_names = yolib.get_month_names(this.config.locale);

        // array of day of week names
        this.config.day_names = yolib.get_dow_names(this.config.locale, this.config.dow_heading);

        // Keeps track of the month the datepicker is on and will
        // not go past the min_date month (if set).
        var dp_display_date = this.config.current_start_date ?
                              this.config.current_start_date : this.config.currdate;
        this.config.mn = (dp_display_date.getTime() < this.config.min_date.getTime()) ?
                 this.config.min_date.getMonth() : dp_display_date.getMonth();

        // Keeps track of the year the datepicker is on and will
        // not go past the min_date year (if set).
        this.config.yy = (dp_display_date.getTime() < this.config.min_date.getTime()) ?
                 this.config.min_date.getFullYear() : dp_display_date.getFullYear();

        // Set flag, tiggers the datepicker to close on selecting a day.
        this.config.close_onselect = (this.config.close_onselect === undefined) ?
                             true : this.config.close_onselect;

        // Limit the number of months to display for a multi-month datepicker.
        this.config.months_to_display = (this.config.months_to_display > this.config.MAX_CALENDARS) ?
                               this.config.MAX_CALENDARS : this.config.months_to_display;

        // This feature is only applicable when close_onselect is false and
        // months_to_display is greater than 1.
        //this.config.use_date_range = (this.config.close_onselect === false &&
        //                  this.config.months_to_display > 1) ? this.config.use_date_range : false;

        // Indicator for which date is active / set when use_date_range.
        this.config.date_range = this.config.use_date_range ? {start: true, stop: false} : null;

        return this.config;
    }
};
