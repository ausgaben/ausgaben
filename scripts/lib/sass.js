'use strict';

var sass = require('node-sass'),
    fs = require('fs'),
    util = require('util');

module.exports = {
    render: function (src, target) {
        sass.render({
            file: src,
            outputStyle: 'compressed',
        }, function (err, result) {
            if (err) {
                throw err;
            }
            fs.writeFile(target, result.css.toString(), function () {
                util.log(src + " -> " + target);
            });
        });
    }
};
