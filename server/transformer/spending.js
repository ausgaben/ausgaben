'use strict';

module.exports = function (model) {
    return {
        '@context': 'https://ausgaben.io/jsonld/Spending',
        amount: model.amount,
        description: model.description
    };
};
