'use strict';

var dateUtil = require('../../util/date');

module.exports = function (model) {
    return {
        '@context': 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Periodical',
        type: model.type,
        category: model.category,
        amount: model.amount,
        title: model.title,
        starts: dateUtil.W3C(model.starts),
        estimate: model.estimate,
        enabledIn01: model.enabledIn01,
        enabledIn02: model.enabledIn02,
        enabledIn03: model.enabledIn03,
        enabledIn04: model.enabledIn04,
        enabledIn05: model.enabledIn05,
        enabledIn06: model.enabledIn06,
        enabledIn07: model.enabledIn07,
        enabledIn08: model.enabledIn08,
        enabledIn09: model.enabledIn09,
        enabledIn10: model.enabledIn10,
        enabledIn11: model.enabledIn11,
        enabledIn12: model.enabledIn12
    };
};
