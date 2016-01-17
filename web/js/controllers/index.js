'use strict';

module.exports = function (app) {
    require('./navigation')(app);
    require('./login')(app);
    require('./logout')(app);
    require('./registration')(app);
    require('./accounts')(app);
    require('./spendings')(app);
    require('./bluebird')(app);
};
