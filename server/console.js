'use strict';

var db = require('./config/sequelize'),
    repos = require('./config/repositories'),
    CreateMonthlySpendingsTask = require('./task/CreateMonthlySpendingsTask'),
    fs = require('fs'),
    yargs = require('yargs'),
    bluebird = require('bluebird'),
    _ = require('lodash'),
    config = require('./config/config');

bluebird.promisifyAll(fs);

var argv = yargs
    .usage('Usage: $0 <command> [options]')
    .command('sequelize:schema:sync', 'Sync the db schema')
    .command('spendings:monthly', 'Creating spendings for the current month')
    .command('token:verify', 'Verify a JWT')
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
case 'spendings:monthly':
case 's:m':
    var month = new Date();
    console.log('Creating spendings for month: ' + month.getFullYear() + '-' + _.padLeft((month.getMonth() + 1), 2, 0));
    var task = new CreateMonthlySpendingsTask(repos['Periodical'], repos['Spending']);
    task.execute(month).then(function () {
        console.log('Spendings created');
        process.exit(0);
    });
    break;
case 'token:verify':
    var jwt = require('jsonwebtoken');
    var pubKey = fs.readFileSync(config.get('root') + '/data/ida_rsa.pub', 'utf8');
    jwt.verify(argv._[1], pubKey, {algorithms: ['RS256']}, function (err, decoded) {
        console.log(decoded);
        process.exit(0);
    });
    break;
default:
    console.error('Unknown command: %j', argv._[0]);
    console.log(yargs.help());
    process.exit(1);
}
