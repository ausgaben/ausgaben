'use strict';

var _ = require('lodash');

var pad = function (v) {
    return _.padLeft(v, 2, 0);
};

var w3cformat = function (date) {
    var d = new Date();
    d.setTime(date.getTime());
    d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
    var year = d.getFullYear();
    var month = d.getMonth();
    month++;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    return year + '-' + pad(month) + '-' + pad(day) +
        'T' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds) +
        '+00:00';
};

module.exports = {
    W3C: w3cformat
};
