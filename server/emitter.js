'use strict';

var EventEmitter = require('events'),
    util = require('util');

function BackendEmitter() {
    EventEmitter.call(this);
}
util.inherits(BackendEmitter, EventEmitter);

module.exports = new BackendEmitter();
