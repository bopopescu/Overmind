var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Image Grid Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('imageGrid', function($rootScope) {
    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/partials/directives/ui/image_grid.html',
        replace: false,
        scope: {
            'imageGridName': '@imageGrid',
            'imageList': '='
        },

        link: function($scope, $element, $attrs) {

            // properties
            var layoutInitialized = false,
                layoutInitStarted = false;

            // jquery elements
            var $imageGrid = $element;

            // scope data
            $scope.directiveData = {};

            createEventListeners();

            // wait for scope data before intialization
            $scope.$watch('imageList', function(imageList, oldValue) {
                initialize(imageList);
            });

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            * initialize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initialize(imageList) {

                if (imageList && Object.size(imageList) > 0) {
                    initializeLayout();
                }
            }

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            * createEventListeners -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createEventListeners() {

                // add-image
                $scope.$on('add-image', function(e, image) {

                    if (image.name === $scope.imageGridName) {
                        addImage(image);
                    }
                });
            }

            /* addImage -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function addImage(imageData) {

                // iterate image urls
                var image = new Image();
                image.src = imageData.url;

                // add active property
                if (!Object.has(imageData, 'active')) {
                    imageData.active = false;
                }

                // image loaded
                image.onload = function() {

                    $rootScope.safeApply(function() {
                        // add to imageList
                        $scope.imageList[imageData.id] = imageData;
                    });

                    initializeLayout();
                };
            }

            /* initializeLayout -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initializeLayout() {

                if (!layoutInitialized && !layoutInitStarted) {

                    layoutInitStarted = true;

                    layoutInitialized = true;
                    layoutInitStarted = false;

                    // initialize masonry
                    $imageGrid.imagesLoaded(function() {
                      $imageGrid.masonry({
                        itemSelector : '.image-container',
                        columnWidth : 206
                      });
                    });

                } else if (layoutInitialized && !layoutInitStarted) {

                    $imageGrid.imagesLoaded(function() {
                        $imageGrid.masonry('reload');
                    });
                }
            }

            /* toggleItemFile - toggle file to list of item files
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function toggleItemFile(fileID, e) {

                var file = $scope.imageList[fileID];

                // toggle active state
                file.active = !file.active;
            }

            /* viewImage - view full image
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function viewImage(fileID, e) {

                var file = $scope.imageList[fileID];
                $rootScope.$broadcast('view-image', file);

                e.preventDefault();
                e.stopPropagation();
            }

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            * Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.toggleItemFile = toggleItemFile;
            $scope.viewImage = viewImage;

        }
    };
});
