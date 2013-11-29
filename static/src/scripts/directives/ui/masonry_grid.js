var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Masonry Grid Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('masonryGrid', ['$rootScope', '$q', function($rootScope, $q) {

    // constants

    return {
        restrict: 'A',
        templateUrl: '/static/src/partials/directives/ui/masonry_grid.html',
        replace: true,
        scope: {
            'masonryGridName': '@masonryGrid',
            'mode': '@'
        },

        link: function($scope, $element, $attrs) {

            // scope data
            $scope.gridItems = {};

            // properties

            // jquery elements
            var $masonryGrid = $element.find('.masonry-grid-container');

            // scope data
            $scope.state = {
                'loading': false
            };

            initialize();
            createEventListeners();

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            * initialize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initialize() {
                initializeIsotope();
            }

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            * createEventListeners -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createEventListeners() {

                // add-items
                $scope.$on('masonry-grid:add-items', function(e, items) {

                    if (items.name === $scope.masonryGridName) {
                        addItems(items.list);
                    }
                });

                // replace-items
                $scope.$on('masonry-grid:replace-items', function(e, items) {

                    if (items.name === $scope.masonryGridName) {

                        // reset isotope and add items
                        resetIsotope().then(function() {
                            addItems(items.list);
                        });
                    }
                });

                // set-item-active-state
                $scope.$on('masonry-grid:set-item-active-state', function(e, itemProperties) {

                    // set active state
                    if ($scope.gridItems && Object.size($scope.gridItems) > 0 && Object.has($scope.gridItems, itemProperties.id)) {

                        $scope.gridItems[itemProperties.id].active = itemProperties.active;
                    }
                });
            }

            /* addItems -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function addItems(gridItems) {

                if (gridItems && Object.size(gridItems) > 0) {

                    $scope.state.loading = true;

                    var fileCount = Object.size(gridItems);
                    var filesLoaded = 0;

                    // iterate grid items
                    Object.extended(gridItems).each(function(key, gridItem) {

                        // iterate image urls
                        var image = new Image();
                        image.src = gridItem.url;

                        // image loaded
                        image.onload = function() {
                            filesLoaded++;

                            var insertGridItem = {};
                            insertGridItem[gridItem.id] = gridItem;

                            // merge local item with grid items
                            $rootScope.safeApply(function() {
                                angular.extend($scope.gridItems, insertGridItem);

                                if (filesLoaded === fileCount) {
                                    $scope.state.loading = false;
                                }
                            });

                            addIsotopeItem(gridItem);
                        };
                    });
                }
            }

            /* resetIsotope - async remove isotope items - clear $scope.gridItem
            @return - promise
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function resetIsotope() {

                var deferred = $q.defer();

                // destroy existing isotope
                $masonryGrid.isotope('remove', $element.find('.isotope-item'), function() {

                    deferred.resolve();

                    $rootScope.safeApply(function() {
                        $scope.gridItems = {};
                    });
                });

                return deferred.promise;
            }

            /* initializeIsotope - create isotope on element
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initializeIsotope() {

                $masonryGrid.isotope({
                    itemSelector : '.grid-item',
                    masonry: {
                        columnWidth: 210
                    }
                });
            }

            /* addIsotopeItems -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function addIsotopeItems(gridItems) {

                var itemList = [];
                Object.extended(gridItems).each(function(key, item) {
                    itemList.push('.' + item.id);
                });

                var queryString = itemList.join(',');
                var $newGridItems = $element.find(queryString);

                $masonryGrid.isotope('appended', $newGridItems, function() {
                    // items appended
                });
            }

            /* addIsotopeItem - append grid items
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function addIsotopeItem(gridItem) {

                var $newGridItem = $element.find('.' + gridItem.id);

                $masonryGrid.isotope('appended', $newGridItem, function() {
                    // item appended
                });
            }

            /* selectItem -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function selectItem(itemID, e) {

                if ($scope.mode === 'toggle') {
                    toggleItem(itemID);

                } else {
                    viewItem(itemID);
                }
            }

            /* toggleItem - toggle item
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function toggleItem(itemID) {

                var item = $scope.gridItems[itemID];

                // toggle active state
                item.active = !item.active;

                $scope.$emit('masonry-grid:item-toggled', item);
            }

            /* viewItem - view full image
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function viewItem(itemID) {

                var item = $scope.gridItems[itemID];

                $scope.$emit('masonry-grid:item-clicked', item);
            }

            /* viewImage - view full image
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function viewImage(itemID, e) {

                var item = $scope.gridItems[itemID];

                $rootScope.$broadcast('image-viewer:view-image', item);

                e.preventDefault();
                e.stopPropagation();
            }

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            * Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.selectItem = selectItem;
            $scope.viewImage = viewImage;
        }
    };
}]);
