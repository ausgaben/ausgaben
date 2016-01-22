'use strict';

var User = require('../../web/js/model/user');

module.exports = function (model) {
    return new User(model);
};
