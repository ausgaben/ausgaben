'use strict';

module.exports = function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (viewValue) {
                var parent = element.parent('.form-group');
                if (modelCtrl.$valid) {
                    element.addClass('form-control-success');
                    element.removeClass('form-control-danger');
                    if (parent) {
                        parent.addClass('has-success');
                        parent.removeClass('has-danger');
                    }
                } else {
                    element.addClass('form-control-danger');
                    element.removeClass('form-control-success');
                    if (parent && modelCtrl.$dirty) {
                        parent.addClass('has-danger');
                        parent.removeClass('has-success');
                    }
                }
                return viewValue;
            });
        }
    };
};
