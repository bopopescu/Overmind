var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Login Form Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('loginForm', ['$rootScope', 'User', function($rootScope, User) {

    // constants

    return {
        restrict: 'A',
        templateUrl: '/static/src/partials/directives/login_form.html',
        replace: false,
        scope: {
            'property': '='
        },

        link: function($scope, $element, $attrs) {

            // jquery elements

            // scope data
            $scope.directiveData = {};

            createEventListeners();

            // wait for scope data before intialization
            $scope.$watch('property', function(property, oldValue) {
                initialize();
            });


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

            /* login - api: /user/login/ [POST]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function login(userInfo) {

                // call user service method
                User.login(userInfo).then(function(data) {

                    // broadcast logged-in event
                    $rootScope.$broadcast('logged-in', data.data);
                });
            }


            /* Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.login = login;

        }
    };
}]);
