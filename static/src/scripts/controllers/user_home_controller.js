/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* User Home Controller - user logged in, home
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var UserHomeController = function($rootScope, $scope, $http, $routeParams, $location, User, Tag) {

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

    }

    /* createEventHandlers -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function createEventHandlers() {

    }
};


var App = angular.module('overmind');
App.controller('UserHomeController', UserHomeController);

UserHomeController.$inject = ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'User', 'Tag'];
