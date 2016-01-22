'use strict';

var _ = require('lodash'),
    User = require('../../web/js/model/user');

module.exports = function (httpHost) {

    var apiBase = _.trimEnd(httpHost, '/') + '/api';

    var typeMap = {};
    typeMap[User.$context] = apiBase + '/user/:id';

    /**
     * @param {string} $context
     * @param {string} id
     * @returns {string}
     */
    function createId($context, id) {
        return typeMap[$context].replace(':id', id);
    }

    /**
     * @param {string} $context
     * @param {string} $id
     */
    function parseId($context, $id) {
        return $id.match(new RegExp(typeMap[$context].replace(':id', '([0-9]+)')))[1];
    }

    return {
        createId: createId,
        parseId: parseId
    };
};
