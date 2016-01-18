'use strict';

var db = require('./config/sequelize'),
    repos = require('./config/repositories'),
    CreateMonthlySpendingsTask = require('./task/CreateMonthlySpendingsTask'),
    SendLoginLinkTask = require('./task/SendLoginLinkTask'),
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
    .command('user:loginlink', 'Send a login link')
    .command('config:templatemailer', 'Update the template mailer configuration')
    .demand(1)
    .help('h')
    .alias('h', 'help')
    .alias('e', 'email')
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
    console.log('Creating spendings for month: ' + month.getFullYear() + '-' + _.padStart((month.getMonth() + 1), 2, 0));
    var task = new CreateMonthlySpendingsTask(repos.Periodical, repos.Spending);
    task.execute(month).then(function () {
        console.log('Spendings created');
        process.exit(0);
    });
    break;
case 'token:verify':
    var jwt = require('jsonwebtoken');
    var pubKey = fs.readFileSync(config.get('root') + '/data/id_rsa.pub', 'utf8');
    jwt.verify(argv._[1], pubKey, {algorithms: ['RS256']}, function (err, decoded) {
        console.log(decoded);
        process.exit(0);
    });
    break;
case 'user:loginlink':
    var privKey = fs.readFileSync(config.get('root') + '/data/id_rsa', 'utf8');
    var loginLinkTask = new SendLoginLinkTask(repos.User, privKey, config.get('token_lifetime'));
    loginLinkTask.execute(argv.email).then(function () {
        console.log('Login link sent to ' + argv.email);
        process.exit(0);
    }).catch(function(err) {
        console.error(err);
        process.exit(0);
    });
    break;
case 'config:templatemailer':
    // E-Mail setup
    var TemplateMailerService = require('./service/template-mailer'),
        TemplateMailerConfig = config.get('templateMailer'),
        mailer = new TemplateMailerService(TemplateMailerConfig.api);
    var globAsync = bluebird.promisify(require('glob'));

    console.log('Template mailer: ', TemplateMailerConfig.api);

    // E-Mail templates
    globAsync('build/emails/*.html')
        .map(function (template) {
            return fs.readFileAsync(template, 'utf8')
                .then(function (templateData) {
                    return {
                        subject: templateData.match(/<title>([^<]+)<\/title>/)[1],
                        name: template.match(/\/([a-z]+)\.html$/)[1],
                        html: templateData.replace(/\{\{/g, '<%=').replace(/\}\}/g, '%>')
                    };
                });
        })
        .map(function (template) {
            return mailer.template('ausgaben' + template.name, template.subject, template.html)
                .then(function () {
                    console.log('Updated template mailer template:', template.name);
                });
        });

    // E-Mail SMTP
    mailer.config('ausgaben', TemplateMailerConfig.dsn, TemplateMailerConfig.email, TemplateMailerConfig.name)
        .then(function () {
            console.log('Updated template mailer SMTP: ausgaben');
        });
    break;
default:
    console.error('Unknown command: %j', argv._[0]);
    console.log(yargs.help());
    process.exit(1);
}
