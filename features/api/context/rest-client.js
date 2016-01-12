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

var testHost = 'http://localhost:3000';

function client(context) {
    if (!context.client) {
        context.client = request.agent(testHost);
    }
    return context.client;
}

function storage(store, context, name, value) {
    if (!context[store]) {
        context[store] = {};
    }
    if (value === undefined) {
        return context[store][name];
    }
    context[store][name] = value;
}

var header = storage.bind(null, 'headers');
var data = storage.bind(null, 'data');

module.exports = English.library(dictionary)

    .given('"$value" is the $header header', function (value, name, next) {
        var context = this.ctx;
        header(context, name, value);
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

    .when('I store "$node" as "$storage"', function (node, storage, next) {
        var context = this.ctx;
        data(context, storage, context.response.body[node]);
        next();
    })

    .when('I follow the redirect', function (next) {
        var context = this.ctx;
        var agent = client(context);
        var request = agent.get(context.response.headers['location'].replace(testHost, ''));
        request.send();
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

    .then('the $header header should equal "$value"', function (name, value, next) {
        var context = this.ctx;
        expect(context.response.headers[name.toLowerCase()]).to.equal(value);
        next();
    })

    .then('the $header header should exist', function (name, next) {
        var context = this.ctx;
        expect(context.response.headers[name.toLowerCase()]).to.not.equal(undefined);
        next();
    })

    .then('"$node" should equal "$value"', function (node, value, next) {
        var context = this.ctx;
        expect(context.response.body[node]).to.equal(value);
        next();
    })

    .then('"$node" should exist', function (node, next) {
        var context = this.ctx;
        expect(context.response.body[node]).to.not.equal(undefined);
        next();
    })

;
