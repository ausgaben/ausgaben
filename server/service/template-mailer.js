'use strict';

var request = require('request-promise');

function TemplateMailerService(api) {
    this.api = api;
}

TemplateMailerService.prototype.template = function (id, subject, html) {
    var self = this;
    return request({
        method: 'PUT',
        uri: self.api + '/templates/' + id,
        headers: {
            'Content-Type': 'application/vnd.node-templater-mailer-microservice.v1+json; charset=utf-8'
        },
        body: {subject: subject, html: html},
        json: true
    });
};

TemplateMailerService.prototype.config = function (id, dsn, email, name) {
    var self = this;
    return request({
        method: 'PUT',
        uri: self.api + '/smtp_credentials/' + id,
        headers: {
            'Content-Type': 'application/vnd.node-templater-mailer-microservice.v1+json; charset=utf-8'
        },
        body: {dsn: dsn, email: email, name: name},
        json: true
    });
};

TemplateMailerService.prototype.send = function (config, template, to, name, data) {
    var self = this;
    data = data || {};
    data.to = to;
    data.name = name;
    return request({
        method: 'POST',
        uri: self.api + '/send/' + config + '/' + template,
        headers: {
            'Content-Type': 'application/vnd.node-templater-mailer-microservice.v1+json; charset=utf-8'
        },
        body: data,
        json: true
    });
};

module.exports = TemplateMailerService;
