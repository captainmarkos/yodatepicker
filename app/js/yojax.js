// Vanilla javascript to make asyncronous requests.
//
// YoJax.get('/test.php', {foo: 'bar'}, function() {});

'use strict';

var YoJax = {};
YoJax.xhr = function() {
    if(typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        'MSXML2.XmlHttp.6.0',
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'
    ];

    /* global ActiveXObject */
    var xhr;
    for(var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch(e) { }
    }
    return xhr;
};

YoJax.send = function(url, callback, method, data, async) {
    if(async === undefined) {
        async = true;
    }
    var xhr = YoJax.xhr();
    xhr.open(method, url, async);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    if(method === 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    xhr.send(data);

    return xhr.responseText;
};

YoJax.get = function(url, data, callback, async) {
    var query = [];
    for(var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    var response = YoJax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
    return response;
};

YoJax.post = function(url, data, callback, async) {
    var query = [];
    for(var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    var response = YoJax.send(url, callback, 'POST', query.join('&'), async);
    return response;
};
