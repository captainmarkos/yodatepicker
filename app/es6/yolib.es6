/* jshint strict: false */
/* jshint unused: false */
const yolib = {
    get_max_date: (param_max_date) => {
        // Return a date object set to max_date.
        // Acceptable parameter formats: 3M, 6M, 9M, 1Y, 2Y, * (infinity)
        const date = new Date();
        let month = date.getMonth();
        let year = date.getFullYear();

        if(param_max_date instanceof Date) { return(param_max_date); }

        switch(param_max_date) {
            case '3M':
                if((month + 3) > 11) { month = (month +3) % 12; year++; }
                else { month += 3; }
                break;
            case '6M':
                if((month + 6) > 11) { month = (month +6) % 12; year++; }
                else { month += 6; }
                break;
            case '9M':
                if((month + 9) > 11) { month = (month +9) % 12; year++; }
                else { month += 9; }
                break;
            case '2Y':
                year += 2;
                break;
            case '*':  // infinity
                year = 3125;
                break;
            default:   // default to '1Y'
                year += 1;
        }
        return(new Date(year, month, date.getDate()));
    },

    get_min_date: (param_min_date) => {
        // Return a date object set to min_date.
        // Acceptable parameter formats: 0, 3M, 6M, 9M, 1Y, 2Y, * (infinity)
        const date = new Date();
        let month = date.getMonth();
        let year = date.getFullYear();

        // If a Date object is passed in, use that.
        if(param_min_date instanceof Date) { return(param_min_date); }

        switch(param_min_date) {
            case '3M':
                if((month - 3) < 0) { month = (month -3) % 12; year--; }
                else { month -= 3; }
                break;
            case '6M':
                if((month - 6) < 0) { month = (month -6) % 12; year--; }
                else { month -= 6; }
                break;
            case '9M':
                if((month - 9) < 0) { month = (month -9) % 12; year--; }
                else { month -= 9; }
                break;
            case '1Y':
                year -= 1;
                break;
            case '2Y':
                year -= 2;
                break;
            case '*':
                year = 1900;
                break;
            default:
                break;  // default is the current date
        }
        return(new Date(year, month, date.getDate()));
    },

    get_dow_names: (locale, dow_heading) => {
        let names = [];
        switch(dow_heading) {
            case 'single_name':
                names = yolib.dow_single_names(locale);
                break;
            case 'short_name':
                names = yolib.dow_short_names(locale);
                break;
            case 'full_name':
                names = yolib.dow_full_names(locale);
                break;
            default:
                names = yolib.dow_single_names(locale);
        }
        return names;
    },

    get_month_names: (locale) => {
        if(locale === undefined || locale === null) { locale = 'en'; }

        if(locale === 'es') {
            return(['Enero', 'Febrero', 'Marzo', 'Abril',
                    'Mayo', 'Junio', 'Julio', 'Augosto',
                    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']);
        }
        else if(locale === 'fr') {
            return(['Janvier', 'Fevrier', 'Mars', 'Avril',
                    'Mai', 'Juin', 'Juillet', 'Aout',
                    'Septembre', 'Octobre', 'Novembre', 'Decembre']);
        }
        else if(locale === 'de') {
            return(['Januar', 'Februar', 'Marz', 'April',
                    'Mai', 'Juni', 'Juli', 'August',
                    'September', 'Oktober', 'November', 'Dezember']);
        }

        return(['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December']);
    },

    dow_single_names: (locale) => {
        let names = [];
        switch(locale) {
            case 'es':
                names = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
                break;
            case 'fr':
                names = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
                break;
            case 'de':
                names = ['S', 'M', 'D', 'M', 'D', 'F', 'S'];
                break;
            default:
                names = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        }
        return names;
    },

    dow_short_names: (locale) => {
        let names = [];
        switch(locale) {
            case 'es':
                names = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
                break;
            case 'fr':
                names = ['Dim', 'Lu', 'Ma', 'Me', 'Jeu', 'Vend', 'Sam'];
                break;
            case 'de':
                names = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
                break;
            default:
                names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        }
        return names;
    },

    dow_full_names: (locale) => {
        let names = [];
        switch(locale) {
            case 'es':
                names = ['Domingo', 'Lunes', 'Martes', 'Miercoles',
                         'Jueves', 'Viernes', 'Sabado'];
                break;
            case 'fr':
                names = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi',
                         'Jeudi', 'Vendredi', 'Samedi'];
                break;
            case 'de':
                names = ['zondag', 'maandag', 'dinsdag', 'woensdag',
                           'donderdag', 'vrijdag', 'zaterdag'];
                break;
            default:
                names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                         'Thursday', 'Friday', 'Saturday'];
        }
        return names;
    },

    days_in_month: (month_num, full_year) => {
        // Jan == 0, Feb == 1, Mar == 2, ...
        if(month_num === 0 || month_num === 2 || month_num === 4 ||
           month_num === 6 || month_num === 7 || month_num === 9 ||
           month_num === 11) {
            return(31);
        }
        else if(month_num === 3 || month_num === 5 ||
           month_num === 8 || month_num === 10) {
            return(30);
        }

        return(yolib.leap_year(full_year) ? 28 : 29);
    },

    leap_year: (yr) => {
        return(yr % 400 === 0) || (yr % 4 === 0 && yr % 100 !== 0);
    }
};
/* jshint unused: true */
/* jshint strict: true */
