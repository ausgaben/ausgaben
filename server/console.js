'use strict';

var db = require('./config/sequelize'),
    fs = require('fs'),
    yargs = require('yargs'),
    bluebird = require('bluebird');
bluebird.promisifyAll(fs);

var argv = yargs
        .usage('Usage: $0 <command> [options]')
        .command('sequelize:schema:sync', 'Sync the db schmea')
        .demand(1)
        .help('h')
        .alias('h', 'help')
        .argv
    ;

switch (argv._[0]) {
    case 'sequelize:schema:sync':
    case 's:s:s':
        return db.sync({
            force: false
        }).then(function () {
            console.log('Schema synched');
        }).catch(function (err) {
            console.log('Error synching schema: %j', err);
            process.exit(1);
        });
    default:
        console.error('Unknown command: %j', argv._[0]);
        console.log(yargs.help());
        process.exit(1);
}
