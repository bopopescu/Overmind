/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Home Controller - logged out home controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var HomeController = function($rootScope, $scope, $http, $routeParams, $location, $timeout) {

    // constants

    // scope data
    // status of app - visibility classes
    $scope.state = {
    };

    createEventHandlers();

    initialize();

    /* getItems -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function initialize() {

        $rootScope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
    }

    /* createEventHandlers -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function createEventHandlers() {

        // logged-in listener
        $scope.$on('logged-in', function(e, data) {

            // change location

            $timeout(function() {
                $location.path('/' + data.username);
            }, 500);
        });
    }

};


var App = angular.module('overmind');
App.controller('HomeController', HomeController);

HomeController.$inject = ['$rootScope', '$scope', '$http', '$routeParams', '$location', '$timeout'];
