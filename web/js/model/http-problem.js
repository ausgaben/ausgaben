'use strict';

/**
 * See https://datatracker.ietf.org/doc/draft-ietf-appsawg-http-problem/
 * @param {String} type     A URI reference [RFC3986] that identifies the problem type.
 *                          When dereferenced, it is encouraged to provide  human-readable documentation for the
 *                          problem type (e.g., using  HTML [W3C.REC-html401-19991224]). When this member is not
 *                          present, its value is assumed to be "about:blank".
 * @param {String} title    A short, human-readable summary of the problem type. It SHOULD NOT change from occurrence
 *                          to occurrence of the problem, except for purposes of localisation.
 * @param {Number} status   The HTTP status code ([RFC7231], Section 6) generated by the origin server for this
 *                          occurrence of the problem.
 * @param {String} detail   An human readable explanation specific to this occurrence of the problem.
 * @constructor
 */
function HttpProblem(type, title, status, detail) {
    this.name = 'HttpProblem';
    this.type = type;
    this.title = title;
    this.status = status;
    this.detail = detail;
    this.$context = HttpProblem.$context;
}

HttpProblem.prototype = Object.create(Error.prototype);
HttpProblem.prototype.constructor = HttpProblem;
HttpProblem.prototype.toString = function () {
    return this.type + ' ' + this.title + ': ' + this.status + ' (' + this.detail + ')';
};

HttpProblem.$context = 'https://www.ietf.org/id/draft-ietf-appsawg-http-problem-01.txt';

HttpProblem.fromHttpError = function (httpError, detail) {
    if (httpError.data.$context === HttpProblem.$context) {
        detail += ' (' + httpError.data.detail + ')';
        return new HttpProblem(httpError.data.type, httpError.data.title, httpError.data.status, detail);
    }
    var statusText = httpError.status > 1 ? httpError.statusText : 'Connection failed';
    var url = 'https://github.com/ausgaben/ausgaben-node/wiki/HttpProblem#' +
        httpError.status +
        '?statusText=' + encodeURIComponent(statusText) +
        '&detail=' + encodeURIComponent(detail);
    return new HttpProblem(url, statusText, httpError.status, detail);
};

module.exports = HttpProblem;
