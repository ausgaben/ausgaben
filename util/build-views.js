'use strict';

var Promise = require('bluebird');
Promise.promisifyAll(require('fs'));

var glob = require('glob'),
    fs = require('fs'),
    _ = require('lodash'),
    packageJson = require('../package.json');

function run() {

    var config = {
        version: +new Date(),
        tag: packageJson.version,
        name: packageJson.name,
        description: packageJson.description
    };

    var includes = {};
    var directives = {};

    console.log();
    console.log('Building template files …');
    console.log(' public config:');
    _.map(config, function (value, key) {
        console.log('  ' + key + ': ' + value);
    });

    // Build includes
    var globAsync = Promise.promisify(glob);
    return Promise.join(globAsync('./web/includes/*.html'), globAsync('./web/js/directives/*.html'))
        .spread(function (includeTemplates, directiveTemplates) {
            return Promise.join(
                Promise.map(includeTemplates, function (file) {
                    return fs.readFileAsync(file, 'utf8').then(function (data) {
                        var trg = file.replace('./web/includes/', '');
                        trg = trg.replace(/\.html$/, '');
                        trg = trg.replace(/\//, '.');
                        includes[trg] = data;
                    });
                }),
                Promise.map(directiveTemplates, function (file) {
                    return fs.readFileAsync(file, 'utf8').then(function (data) {
                        var trg = file.replace('./web/js/directives/', '');
                        trg = trg.replace(/\.html$/, '');
                        trg = trg.replace(/\//, '.');
                        console.log(trg);
                        directives[trg] = data;
                    });
                })
            );
        })
        .then(function () {
            var src = './web/index.html';
            return fs.readFileAsync(src, 'utf8').then(function (data) {
                data = _.template(data)({data: config, includes: includes, directives: directives});
                var trg = './build/' + src.replace('./web/', '');
                console.log(src + ' -> ' + trg);
                return fs.writeFileAsync(trg, data);
            });
        });
}

return run().then(function () {
    process.exit(0);
}).catch(function (err) {
    console.error(err);
    process.exit(1);
});
