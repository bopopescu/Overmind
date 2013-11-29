var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Signup Form Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('signupForm', ['$rootScope', 'User', function($rootScope, User) {

    // constants

    return {
        restrict: 'A',
        templateUrl: '/static/src/partials/directives/signup_form.html',
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
}]);
