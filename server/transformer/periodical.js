'use strict';

module.exports = function (model) {
    return {
        '@context': 'https://ausgaben.io/jsonld/Periodical',
        amount: model.amount,
        description: model.description
    };
};
