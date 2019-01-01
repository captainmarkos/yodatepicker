// Vanilla javascript to make asyncronous requests.
//
// YoJax.get('/test.php', {foo: 'bar'}, function() {});

/* jshint strict: false */
const YoJax = {
  xhr: () => {
    if(typeof XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    let versions = [
      'MSXML2.XmlHttp.6.0',
      'MSXML2.XmlHttp.5.0',
      'MSXML2.XmlHttp.4.0',
      'MSXML2.XmlHttp.3.0',
      'MSXML2.XmlHttp.2.0',
      'Microsoft.XmlHttp'
    ];

    /* global ActiveXObject */
    let xhr;
    for(let i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch(e) { }
    }
    return xhr;
  },

  send: (url, callback, method, data, async) => {
    if(async === undefined) {
        async = true;
    }
    let xhr = YoJax.xhr();
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
  },


  // get: function(url, data, callback, async) {
  get: (url, data, callback, async) => {
    let query = [];
    for(let key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    let response = YoJax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
    return response;
  },

  post: (url, data, callback, async) => {
    let query = [];
    for(let key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    let response = YoJax.send(url, callback, 'POST', query.join('&'), async);
    return response;
  }
};
/* jshint strict: true */
