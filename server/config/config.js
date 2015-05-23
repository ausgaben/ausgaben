'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

var dsn = process.env.DSN ? process.env.DSN.match(/postgresql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/) : [];

module.exports = {
    port: process.env.PORT || 3000,
    modelsDir: rootPath + '/models',
    postgresName: dsn[5] || 'ausgaben',
    postgresUser: dsn[1] || 'ausgaben',
    postgresPassword: dsn[2] || 'password',
    postgresPort: dsn[4] || '5432',
    postgresHost: dsn[3] || '127.0.0.1'
};
