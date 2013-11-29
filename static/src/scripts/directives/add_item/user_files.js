var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* User Files Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('userFiles', ['$rootScope', 'User', 'File', function($rootScope, User, File) {

    // constants

    return {
        restrict: 'A',
        templateUrl: '/static/src/partials/directives/user_files.html',
        replace: false,
        scope: {
            activeFiles: '='
        },

        link: function($scope, $element, $attrs) {

            // properties
            var initialized = false,
                moreItems = true,
                cursorList = [''],
                currentCursor = 0;

            // jquery elements

            // scope data

            $scope.state = {
                'loading': false
            };

            createEventListeners();

            /* initialize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initialize() {

                initialized = true;

                // load user files
                loadUserFiles(cursorList[currentCursor]);
            }

            /* createEventListeners -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createEventListeners() {

                // watch: activeFiles
                $scope.$watch('activeFiles', function(activeFiles, oldValue) {

                    // intialized with current active
                    if (!initialized && activeFiles) {
                        initialize();
                    }
                }, true);

                // masonry-grid:item-toggled
                $scope.$on('masonry-grid:item-toggled', function(e, item) {

                    // item is active
                    if (item.active) {
                        $scope.activeFiles[item.id] = true;
                    } else {
                        $scope.activeFiles[item.id] = false;
                    }
                });
            }

            /* loadUserFiles -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function loadUserFiles(cursor) {

                $scope.state.loading = true;

                File.getUserFiles(cursor).then(function(xhr) {

                    $scope.state.loading = false;

                    // add new cursor to list
                    cursorList.push(xhr.data.user_files.cursor);
                    moreItems = xhr.data.user_files.more;

                    // convert to object
                    var userFiles = {
                        'name': 'user-files',
                        'list': {}
                    };

                    xhr.data.user_files.user_files_list.each(function(item) {

                        if (Object.has($scope.activeFiles, item.id) && $scope.activeFiles[item.id] === true) {
                            item.active = true;
                        }
                        userFiles.list[item.id] = item;
                    });

                    $scope.$broadcast('masonry-grid:replace-items', userFiles);
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
                    loadUserFiles(cursorList[++currentCursor]);
                }
            }

            /* previousPage -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function previousPage() {

                if (currentCursor > 0) {
                    loadUserFiles(cursorList[--currentCursor]);
                }
            }

            /* Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.viewItem = viewItem;
            $scope.nextPage = nextPage;
            $scope.previousPage = previousPage;
        }
    };
}]);
