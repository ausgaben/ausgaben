'use strict';

var _ = require('lodash');

if (!atob) {
    var atob = function (str) {
        return new Buffer(str, 'base64').toString('binary');
    };
}

/**
 * @param {object} token
 * @constructor
 */
function JsonWebToken(token) {
    this.iss = undefined; // Issuer
    this.sub = undefined; // Subject
    this.aud = undefined; // Audience
    this.exp = undefined; // Expiration Time
    this.nbf = undefined; // Not Before
    this.iat = undefined; // Issued At
    this.jti = undefined; // JWT ID

    var data = JSON.parse(atob(token.split('.')[1]));
    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? undefined : data[key];
        });
        if (this.exp) {
            this.exp = new Date(this.exp * 1000);
        }
        if (this.nbf) {
            this.nbf = new Date(this.nbf * 1000);
        }
        if (this.iat) {
            this.iat = new Date(this.iat * 1000);
        }
    }

    this.$context = JsonWebToken.$context;
    this.token = token || undefined;
}

JsonWebToken.$context = 'https://tools.ietf.org/html/rfc7519';

module.exports = JsonWebToken;
