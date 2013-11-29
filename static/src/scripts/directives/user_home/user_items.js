var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* User Items Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('userItems', ['$rootScope', '$location', 'User', 'Item', 'Tag', function($rootScope, $location, User, Item, Tag) {

    // constants
    var ALL_TAG_NAME = '! All Tags',
        ITEMS_PER_PAGE = 20;

    return {
        restrict: 'A',
        templateUrl: '/static/src/partials/directives/user_items.html',
        replace: true,
        scope: {
        },

        link: function($scope, $element, $attrs) {

            // properties
            var moreItems = true,
                currentCursor = '',
                currentTag = '';

            // jquery elements

            // scope data

            $scope.state = {
                'loading': false
            };

            $scope.userTags = {
                allTags: [],
                selectedTag: ''
            };

            createEventHandlers();
            initialize();

            /* initialize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initialize() {

                getUserTags();
                loadUserItems(currentCursor, currentTag, false);
            }

             /* createEventHandlers -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createEventHandlers() {

                // watch selected tag
                $scope.$watch('userTags.selectedTag', function(selectedTag, oldValue) {

                    if (selectedTag && selectedTag !== 'Select Tag') {

                        currentTag = (selectedTag === ALL_TAG_NAME) ? '' : selectedTag;
                        currentCursor = '';

                        loadUserItems(currentCursor, currentTag, true);
                    }
                });

                // masonry-grid:item-clicked
                $scope.$on('masonry-grid:item-clicked', function(e, item) {

                    viewItem(item.id);
                });
            }

            /* getUserTags -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function getUserTags() {

                // Tag service
                Tag.getUserTags().then(function(xhr) {

                    var userTags = [];

                    // parse user tags
                    xhr.data.user_tags.each(function(tag) {
                        userTags.push(tag.title);
                    });

                    // Add All Tags
                    userTags.push(ALL_TAG_NAME);

                    $scope.userTags.allTags = userTags;
                });
            }

            /* loadUserItems -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function loadUserItems(cursor, tag, replace) {

                $scope.state.loading = true;

                Item.getUserItems(cursor, tag, ITEMS_PER_PAGE).then(function(xhr) {

                    $scope.state.loading = false;

                    // set cursor
                    currentCursor = xhr.data.user_items.cursor;
                    moreItems = xhr.data.user_items.more;

                    // convert to object
                    var userItems = {
                        'name': 'userItems',
                        'list': {}
                    };
                    xhr.data.user_items.user_items_list.each(function(item) {

                        // add grid item url to item
                        item.url = item.item_files[0].url;

                        // add to userItems
                        userItems.list[item.id] = item;
                    });

                    if (replace) {
                        $scope.$broadcast('masonry-grid:replace-items', userItems);
                    } else {
                        $scope.$broadcast('masonry-grid:add-items', userItems);
                    }
                });
            }

            /* viewItem -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function viewItem(itemID) {

                $location.url('/item/' + itemID);
            }

            /* nextPage -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function nextPage() {

                if (moreItems) {
                    loadUserItems(currentCursor, currentTag, false);
                }
            }


            /* Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.viewItem = viewItem;
            $scope.nextPage = nextPage;
        }
    };
}]);
