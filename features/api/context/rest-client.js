'use strict';

var _ = require('lodash'),
    expect = require('chai').expect,
    Yadda = require('yadda'),
    English = Yadda.localisation.English,
    dictionary = new Yadda.Dictionary(),
    request = require('supertest');


dictionary
    .define('json', /([^\u0000]*)/, function (data, done) {
        done(null, JSON.parse(data));
    })
    .define('httpStatus', /(\d+)/, Yadda.converters.integer)
;

function client(context) {
    if (!context.client) {
        context.client = request.agent('http://localhost:3000');
    }
    return context.client;
}

function header(context, name, value) {
    if (!context.headers) {
        context.headers = {};
    }
    if (value === undefined) {
        return context[name];
    }
    context[name] = value;
}

module.exports = English.library(dictionary)

    .given('"$value" is the $header', function (value, name, next) {
        var context = this.ctx;
        header(context, name, value)
        next();
    })

    .given('this is the request body\n$json', function (json, next) {
        var context = this.ctx;
        context.body = json;
        next();
    })

    .when('I $method to $endpoint', function (method, endpoint, next) {
        var context = this.ctx;
        var agent = client(context);
        var request = agent[method.toLowerCase()](endpoint);
        _.forIn(context.headers, function (value, name) {
            request.set(name, value);
        });
        request.send(JSON.stringify(context.body));
        request.end(function (error, response) {
            context.response = response;
            next();
        });
    })

    .then('the status code should be $httpStatus', function (status, next) {
        var context = this.ctx;
        expect(context.response.statusCode).to.equal(status);
        next();
    })

;
