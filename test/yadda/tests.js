'use strict';

var path = require('path'),
    glob = require('glob'),
    runner = require('./feature-runner');

var apiFeaturesDir = path.normalize(__dirname + '/../../features/api');
runner.run(glob.sync(apiFeaturesDir + '/*.feature'), glob.sync(apiFeaturesDir + '/context/*.js'));
