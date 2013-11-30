var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Item Form Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('itemForm', function($rootScope, Item) {
    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/partials/directives/item_form.html',
        replace: false,
        scope: {
            'itemForm': '=',
            'editItem': '='
        },

        link: function($scope, $element, $attrs) {

            // jquery elements

            createEventListeners();
            initialize();

            /* initialize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initialize() {
                console.log('item form');

            }

            /* createEventListeners -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createEventListeners() {

                // tags-changed
                $scope.$on('tags-changed', function(e, tags) {

                });
            }

            /* directiveFunction -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function directiveFunction() {

                // broadcast event-name event down to child scopes
                $rootScope.$broadcast('event-name', {});

                // emit event-name up towards root scope
                $scope.emit('event-name', {});
            }

            /* Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.directiveFunction = directiveFunction;

        }
    };
});
