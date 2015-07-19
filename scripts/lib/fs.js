'use strict';

var fs = require('fs'),
    util = require('util'),
    _ = require('lodash');

module.exports = {
    mkDir: function (path) {
        fs.stat(path, function (err, stats) {
            if (stats === undefined) {
                fs.mkdirAsync(path)
                    .then(function () {
                        util.log(path + ' created');
                    });
            }
        });
    },
    copyFiles: function (srcDir, targetDir, pattern) {
        fs.readdir(srcDir, function (err, files) {
            if (err !== null) {
                throw err;
            }
            _.map(_.filter(files, function (file) {
                return pattern.test(file);
            }), function (file) {
                var reader = fs.createReadStream(srcDir + "/" + file);
                var writer = fs.createWriteStream(targetDir + "/" + file);
                reader.on('end', function () {
                    writer.end();
                    util.log(srcDir + "/" + file + " -> " + targetDir + "/" + file);
                });
                reader.pipe(writer, {end: false});
            });
        });
    }
};
