'use strict';

require('should');

describe('util.date', function () {
    it('should W3C format a date', function (done) {
        require('../../../util/date').W3C(new Date('2015-01-03')).should.be.exactly('2015-01-03T00:00:00+00:00');
        done();
    });
});
