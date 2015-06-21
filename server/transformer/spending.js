'use strict';

module.exports = function (model) {
    return {
        '@context': 'https://ausgaben.io/jsonld/Spending',
        type: model.type,
        category: model.category,
        amount: model.amount,
        title: model.title
    };
};
