'use strict';

module.exports = function (app) {
    require('./navigation')(app);
    require('./login')(app);
    require('./registration')(app);
    require('./bluebird')(app);
};
