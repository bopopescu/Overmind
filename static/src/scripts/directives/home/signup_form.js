var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Signup Form Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('signupForm', function($rootScope, User) {
    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/partials/directives/signup_form.html',
        replace: false,
        scope: {
            'property': '='
        },

        link: function($scope, $element, $attrs) {

            // jquery elements

            // scope data
            $scope.directiveData = {};

            createEventListeners();

            initialize();

            /* initialize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initialize() {

            }

            /* createEventListeners -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createEventListeners() {

                // event-name listener
                $scope.$on('event-name', function(e, eventProperties) {

                });
            }

            /* createUser - api: /user/ [POST]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createUser(userInfo) {

                // call user service method
                User.createUser(userInfo).then(function(data) {

                });
            }

            /* Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.createUser = createUser;

        }
    };
});
