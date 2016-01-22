'use strict';

module.exports = function ($location) {
    /**
     * @param {object} model
     * @returns {string}
     */
    return function (model) {
        // Remove to local hostname from the url (if present) to save characters
        return btoa(model.$id.replace($location.absUrl().match(/^(https?:\/\/[^\/]+)/)[1], ''));
    };
};
