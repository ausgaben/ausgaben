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
        done(null, data);
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

function storage(store, defaults, context, name, value) {
    if (!context[store]) {
        context[store] = defaults;
    }
    if (value === undefined) {
        if (name === undefined) {
            return context[store];
        }
        return context[store][name];
    }
    context[store][name] = value;
}

var header = storage.bind(null, 'header', {});
var data = storage.bind(null, 'data', {time: Date.now()});

function template(str, data) {
    return _.template(str, {interpolate: /\{([\s\S]+?)\}/g})(data);
}

function doRequest(context, method, endpoint, next) {
    var agent = client(context);
    var url = template(endpoint, data(context));
    var request = context.request = agent[method.toLowerCase()](url.replace(testHost, ''));
    _.forIn(header(context), function (value, name) {
        request.set(name, value);
    });
    var body = template(context.body, data(context));
    request.send(JSON.stringify(JSON.parse('{' + body + '}')));
    request.end(function (error, response) {
        context.response = response;
        next();
    });
}

function checkJwtProperty(context, type, value, next) {
    expect(context.response.body['$context']).to.equal('https://tools.ietf.org/html/rfc7519');
    jwt.verify(context.response.body.token, config.get('public_key'), function (err, decoded) {
        try {
            if (typeof value === 'function') {
                value(decoded[type]);
            } else {
                expect(decoded[type]).to.equal(value);
            }

        } catch (err) {
            next(err);
        }
    });
    next();
}

module.exports = English.library(dictionary)

    .given('"$value" is the $header header', function (value, name, next) {
        var context = this.ctx;
        header(context, name, template(value, data(context)));
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
        var request = context.request = agent.get(context.response.header['location'].replace(testHost, ''));
        _.forIn(header(context), function (value, name) {
            request.set(name, value);
        });
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
        expect(context.response.header[name.toLowerCase()]).to.equal(value);
        next();
    })

    .then('the $header header should exist', function (name, next) {
        var context = this.ctx;
        expect(context.response.header[name.toLowerCase()]).to.not.equal(undefined);
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

    .then('JWT $property should exist', function (property, next) {
        var context = this.ctx;
        checkJwtProperty(context, property, function (value) {
            expect(value).to.not.equal(undefined);
        }, next);
    })

    .then('JWT $property should equal "$value"', function (property, value, next) {
        var context = this.ctx;
        checkJwtProperty(context, property, value, next);
    })

    .then(/JWT ([^ ]+) should equal (true|false)/, function (property, bool, next) {
        var context = this.ctx;
        checkJwtProperty(context, property, bool === 'true', next);
    })

    .then(/JWT ([^ ]+) should be ([0-9]+) ([a-z]+) in the (future|past)/, function (property, num, type, dir, next) {
        var context = this.ctx;
        var d = new Date();
        var m = 1;
        if (type.charAt(0) === 'm') {
            m = 60;
        }
        if (type.charAt(0) === 'h') {
            m = 3600;
        }
        var t = Math.floor(d.getTime() / 1000) + (dir === 'past' ? -1 : 1) * +num * m;
        checkJwtProperty(context, property, function (value) {
            expect(value).to.be.within(t - 1, t + 1);
        }, next);
    })

;
