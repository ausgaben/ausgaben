'use strict';

module.exports = function (model) {
    return {
        '@context': 'https://ausgaben.io/jsonld/Spending',
        amount: model.amount,
        title: model.title
    };
};
