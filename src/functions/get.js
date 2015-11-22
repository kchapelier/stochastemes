"use strict";

module.exports = function get (url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200) {
                callback(null, req.responseText);
            } else {
                callback(new Error('HTTP Error ' + req.status), null);
            }
        }
    };
    req.send();
};
