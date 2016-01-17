'use strict';

var Yadda = require('yadda'),
    toposort = require('toposort'),
    _ = require('lodash');
Yadda.plugins.mocha.StepLevelPlugin.init();

function importLibrary(stepdefs, stepdef) {
    var fileName = stepdef.replace('.js', '');
    var library = require(fileName);
    return stepdefs.concat(library);
}

function run(featureFiles, featureLibraries) {
    // Sort the features by @After annotation
    var featureGraph = _.map(featureFiles, function (f) {
        var featureNameAndFile;
        featureFile(f, function (feature) {
            var name = f.match(/\/([^\/\.]+)\.feature$/);
            featureNameAndFile = [feature.annotations.after, name[1]];
        });
        return featureNameAndFile;
    });

    var sortedFeatures = _.filter(toposort(featureGraph), function (feature) {
        return feature !== undefined;
    });

    // Init Yadda
    var y = new Yadda.Yadda(featureLibraries.reduce(importLibrary, []), {ctx: {}});
    _.map(sortedFeatures, function (featureName) {
        var file = _.filter(featureFiles, function (file) {
            return new RegExp('\/' + featureName + '.feature$').test(file);
        })[0];
        featureFile(file, function (feature) {
            if (feature.annotations.pending) {
                console.log('Skipped pending feature: ' + feature.title);
                return;
            }
            scenarios(feature.scenarios, function (scenario) {
                steps(scenario.steps, function (step, done) {
                    y.run(step, done);
                });
            });
        });
    });
}

module.exports = {
    run: run
};
