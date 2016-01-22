'use strict';

var TemplateMailerService = require('node-templater-mailer-microservice-client'),
    config = require('../config/config'),
    TemplateMailerConfig = config.get('templateMailer'),
    mailer = new TemplateMailerService(TemplateMailerConfig.api),
    jwt = require('jsonwebtoken');

var SendLoginLinkTask = function (usersRepository, privateKey, lifetime) {
    this.usersRepository = usersRepository;
    this.privateKey = privateKey;
    this.lifetime = lifetime;
};

/**
 * @returns {bluebird.Promise}
 */
SendLoginLinkTask.prototype.execute = function (email) {
    var self = this;
    // Find the periodicals for the given month
    return self.usersRepository
        .findByEmail(email)
        .then(function (user) {
            if (!user) {
                throw new Error('User not found: ' + email);
            }
            var token = jwt.sign(
                {},
                self.privateKey,
                {
                    algorithm: 'RS256',
                    issuer: 'loginlinktask',
                    subject: user.get('id'),
                    expiresIn: self.lifetime
                }
            );

            var data = {
                token: token,
                lifetime: self.lifetime / 60
            };

            return mailer
                .send('ausgaben', 'ausgabenlogin', email, email, data)
                .catch(function (err) {
                    throw new Error(err.error.detail);
                });
        });
};

module.exports = SendLoginLinkTask;
