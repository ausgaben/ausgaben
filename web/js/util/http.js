'use strict';

/**
 * @param {Token} token
 * @returns {{headers: {Authorization: string}}}
 */
function auth(token) {
    return {
        headers: {
            Authorization: 'Bearer ' + token.token
        }
    };
}

var API_VERSION = require('../../../package.json').API_VERSION;
var MIME_TYPE = 'application/vnd.ausgaben.v' + API_VERSION + '+json';
var CONTENT_TYPE = MIME_TYPE + '; charset=utf-8';

function accept() {
    return {
        headers: {
            Accept: MIME_TYPE,
            'Content-Type': CONTENT_TYPE
        }
    };
}

function HttpProgress() {
    this.$pristine = true;
    this.$active = false;
    this.$done = false;
    this.$error = false;
    this.$success = false;
    this.$problem = null;
}

HttpProgress.prototype.activity = function () {
    this.$pristine = false;
    this.$active = true;
    this.$done = false;
    this.$error = false;
    this.$success = false;
    this.$problem = null;
    document.body.parentElement.style.cursor = 'wait';
    return this;
};

/**
 * @param {HttpProgress} self
 * @param {boolean} error
 * @param {HttpProblem} httpProblem
 * @returns {HttpProgress}
 */
var done = function (self, error, httpProblem) {
    self.$pristine = false;
    self.$active = false;
    self.$done = true;
    self.$error = error || false;
    self.$success = !self.$error;
    self.$problem = httpProblem && self.$error ? httpProblem : null;
    document.body.parentElement.style.cursor = '';
    return self;
};

/**
 * @param {HttpProblem} httpProblem
 */
HttpProgress.prototype.error = function (httpProblem) {
    done(this, true, httpProblem);
};

HttpProgress.prototype.success = function () {
    done(this);
};

module.exports = {
    auth: auth,
    accept: accept,
    HttpProgress: HttpProgress,
    API_VERSION: API_VERSION,
    MIME_TYPE: MIME_TYPE,
    CONTENT_TYPE: CONTENT_TYPE
};
