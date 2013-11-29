/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Overmind Controller - main site controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var OvermindController = function($rootScope, $scope, $http, $routeParams, $location, User) {

    // constants

    // scope data
    // status of app - visibility classes
    $scope.state = {
        'showImagePanel': false,
        'homePage': false
    };
    $scope.overmindData = {};

    initialize();

    /* getItems -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function initialize() {

        // check user logged in
        if (User.isUserLoggedIn()) {

        } else {
            // return to home page
            $location.url('/');
        }

        createEventHandlers();
    }

    /* createEventHandlers -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function createEventHandlers() {

        $scope.$on('image-editor-enabled', function(e, data) {
            $scope.state.showImagePanel = true;
        });

        $scope.$on('image-editor-disabled', function(e, data) {
            $scope.state.showImagePanel = false;
        });

        $scope.$on('$routeChangeSuccess', function (scope, next, current) {

            if ($location.path() == '/') {
                $scope.state.homePage = true;
            } else {
                $scope.state.homePage = false;
            }
        });
    }
};


var App = angular.module('overmind');
App.controller('OvermindController', OvermindController);

OvermindController.$inject = ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'User'];
