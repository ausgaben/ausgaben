'use strict';

function EntityNotFoundError(type, search) {
    this.name = 'EntityNotFoundError';
    this.type = type;
    this.search = search;
}
EntityNotFoundError.prototype = Object.create(Error.prototype);
EntityNotFoundError.prototype.constructor = EntityNotFoundError;
EntityNotFoundError.prototype.toString = function () {
    return 'Entity not found: ' + this.type + ' ' + this.search;
};

function AccessDeniedError(resource) {
    this.name = 'AccessDeniedError';
    this.resource = resource;
}
AccessDeniedError.prototype = Object.create(Error.prototype);
AccessDeniedError.prototype.constructor = AccessDeniedError;
AccessDeniedError.prototype.toString = function () {
    return 'Access denied: ' + this.resource;
};

module.exports = {
    EntityNotFoundError: EntityNotFoundError,
    AccessDeniedError: AccessDeniedError
};
