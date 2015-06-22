'use strict';

var dateUtil = require('../../util/date');

module.exports = function (model) {
    return {
        '@context': 'https://ausgaben.io/jsonld/Spending',
        booked: model.booked,
        bookedAt: dateUtil.W3C(model.bookedAt),
        type: model.type,
        category: model.category,
        amount: model.amount,
        title: model.title
    };
};
