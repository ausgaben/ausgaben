'use strict';

var _ = require('lodash'),
    expect = require('chai').expect,
    Yadda = require('yadda'),
    English = Yadda.localisation.English,
    dictionary = new Yadda.Dictionary(),
    request = require('supertest'),
    jwt = require('jsonwebtoken'),
    config = require('../../../server/config/config');


dictionary
    .define('json', /([^\u0000]*)/, function (data, done) {
        done(null, JSON.parse(data));
    })
    .define('num', /(\d+)/, Yadda.converters.integer)
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

function template(str, data) {
    return _.template(str, {interpolate: /{([\s\S]+?)}/g})(data);
}

function doRequest(context, method, endpoint, next) {
    var agent = client(context);
    var url = template(endpoint, context.data);
    console.log('(REST client)', method, url);
    var request = context.request = agent[method.toLowerCase()](url.replace(testHost, ''));
    _.forIn(context.headers, function (value, name) {
        request.set(name, value);
    });
    request.send(JSON.stringify(context.body));
    request.end(function (error, response) {
        context.response = response;
        next();
    });
}

function checkJwtProperty(context, type, value, next) {
    expect(context.response.body['$context']).to.equal('https://tools.ietf.org/html/rfc7519');
    jwt.verify(context.response.body.token, config.get('public_key'), function (err, decoded) {
        expect(decoded[type]).to.equal(value);
    });
    next();
}

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
        doRequest(context, method, endpoint, next);
    })

    .when('I GET $endpoint', function (endpoint, next) {
        var context = this.ctx;
        doRequest(context, 'GET', endpoint, next);
    })

    .when('I store "$node" as "$storage"', function (node, storage, next) {
        var context = this.ctx;
        data(context, storage, context.response.body[node]);
        next();
    })

    .when('I follow the redirect', function (next) {
        var context = this.ctx;
        var agent = client(context);
        console.log('(REST client)', 'GET', context.response.headers['location']);
        var request = context.request = agent.get(context.response.headers['location'].replace(testHost, ''));
        request.send();
        request.end(function (error, response) {
            context.response = response;
            next();
        });
    })

    .then('the status code should be $num', function (status, next) {
        var context = this.ctx;
        try {
            expect(context.response.statusCode).to.equal(status);
            next();
        } catch (err) {
            next(new Error('Unexpected HTTP response status\nExpected: ' + status + '\nGot:      ' + context.response.statusCode + '\nRequest:  ' + context.request.method + ' ' + context.request.url));
        }
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

    .then(/"([^"]+)" should equal ([+0-9,\.-]+)/, function (node, number, next) {
        var context = this.ctx;
        expect(context.response.body[node]).to.equal(+number);
        next();
    })

    .then(/"([^"]+)" should equal (true|false)/, function (node, bool, next) {
        var context = this.ctx;
        expect(context.response.body[node]).to.equal(bool === 'true');
        next();
    })

    .then('"$node" should exist', function (node, next) {
        var context = this.ctx;
        expect(context.response.body[node]).to.not.equal(undefined);
        next();
    })

    .then(/a list of "([^"]+)" with ([0-9]+) of ([0-9]+) items should be returned/, function (itemContext, num, total, next) {
        var context = this.ctx;
        var list = context.response.body;
        expect(list['$context']).to.equal('https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#List');
        expect(list['total']).to.equal(+total);
        expect(list['items'].length).to.equal(+num);
        _.map(list['items'], function (item) {
            expect(item['$context']).to.equal(itemContext);
        });
        next();
    })

    .then('JWT $property should equal "$value"', function (property, value, next) {
        var context = this.ctx;
        checkJwtProperty(context, property, value, next);
    })

    .then(/JWT ([^ ]+) should equal (true|false)/, function (property, bool, next) {
        var context = this.ctx;
        checkJwtProperty(context, property, bool, next);
    })

;
