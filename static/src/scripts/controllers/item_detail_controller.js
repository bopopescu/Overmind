/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Item Detail Controller - item detail
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var ItemDetailController = function($rootScope, $scope, $http, $routeParams, $location, $q, User, Item, File, Tag) {

    // constants

    // scope data
    // status of app - visibility classes
    $scope.state = {
        'saving': false,
        'imageEditorActive': false
    };

    $scope.itemForm = {
        // notes editor interface
        notes: {
            'read': '',
            'write': ''
        },
        userTags: {
            allTags: [],
            selectedTags: {}
        }
    };

    $scope.itemDetail = {
        'itemID': $routeParams.itemID,
        'activeUserFiles': null
    };

    $scope.imageEditor = {};

    // promises
    var userItemsDeferred = $q.defer();

    initialize();
    createEventHandlers();

    /* getItems -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function initialize() {

        var activeUserFiles = {};

        // get user tags
        getUserTags();

        // get item detail
        getUserItem($scope.itemDetail.itemID);

        // wait for UserItems to load
        userItemsDeferred.promise.then(function(arrayOfResults) {

            // set active files
            $scope.itemForm.itemFiles.each(function(itemFile) {

                activeUserFiles[itemFile.id] = true;
            });

            $scope.itemDetail.activeUserFiles = activeUserFiles;
        });
    }

    /* createEventHandlers -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function createEventHandlers() {

        $scope.$on('image-editor-enabled', function(e, data) {
            $scope.state.imageEditorActive = true;
        });

        $scope.$on('image-editor-disabled', function(e, data) {
            $scope.state.imageEditorActive = false;
        });

        // watch: activeFiles
        $scope.$watch('itemDetail.activeUserFiles', function(activeUserFiles, oldValue) {

            if (activeUserFiles) {
                Object.extended(activeUserFiles).each(function(key, active) {

                    var itemProperties = {
                        'id': key,
                        'active': active
                    };

                    $scope.$broadcast('masonry-grid:set-item-active-state', itemProperties);
                });
            }
        }, true);

        // image editor: save-image
        $scope.$on('save-image', function(e, file) {

            // upload as base64
            File.uploadBase64Image(file).then(function(data) {

                var file = {
                    'name': 'uploaded-files',
                    'id': data.data.user_file_id,
                    'url': data.data.url,
                    'active': true
                };

                // convert to object
                var itemFiles = {
                    'name': 'item-files',
                    'list': {}
                };

                itemFiles.list[file.id] = file;

                $rootScope.safeApply(function() {
                    // set as active
                    $scope.itemDetail.activeUserFiles[file.id] = true;
                });

                // masonry-grid:add-items
                $scope.$broadcast('masonry-grid:add-items', itemFiles);
            });

            $rootScope.$broadcast('hide-image-editor', {});
        });

        // masonry-grid:item-toggled
        $scope.$on('masonry-grid:item-toggled', function(e, item) {

            // item is active
            if (item.active) {
               $scope.itemDetail.activeUserFiles[item.id] = true;
            } else {
               $scope.itemDetail.activeUserFiles[item.id] = false;
            }
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

            $scope.itemForm.userTags.allTags = userTags;
        });
    }

    /* getUserItem - edit existing item
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function getUserItem(itemID) {

        // get user item by item ID
        Item.getUserItem(itemID).then(function(userItem) {

            // set fields
            $scope.itemForm.title = userItem.title;
            $scope.itemForm.searchTags = userItem.search_tags;
            $scope.itemForm.url = userItem.site;
            $scope.itemForm.notes.write = userItem.note;

            // set selected tags
            userItem.item_tags.each(function(itemTag) {
                $scope.itemForm.userTags.selectedTags[itemTag.title] = itemTag.title;
            });

            // load item files into masonry grid
            loadItemFiles(userItem.item_files);

            // set item files
            $scope.itemForm.itemFiles = userItem.item_files;

            userItemsDeferred.resolve('User Items Loaded');
        });
    }

    /* loadItemFiles - load item files into masonry grid
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function loadItemFiles(itemFiles) {

        // convert to object
        var masonryItems = {
            'name': 'item-files',
            'list': {}
        };

        // iterate grid items
        itemFiles.each(function(item) {

            // add grid item url to item
            item.active = true;

            masonryItems.list[item.id] = item;
        });

        $scope.$broadcast('masonry-grid:replace-items', masonryItems);
    }


    /* saveItem - save as user item
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function saveItem() {

        $scope.state.saving = true;

        // item form data
        var itemID = $scope.itemDetail.itemID,
            title = $scope.itemForm.title,
            siteURL = $scope.itemForm.url,
            searchTags = $scope.itemForm.searchTags,
            tags = [],
            note = $scope.itemForm.notes.read;

        // add tags list
        Object.extended($scope.itemForm.userTags.selectedTags).each(function(tag, value) {
            tags.push(tag);
        });

        // get file IDs as array
        var fileIDs = {};

        // set active status
        Object.extended($scope.itemDetail.activeUserFiles).each(function(key, active) {
            fileIDs[key] = active;
        });

        // add active fileIDs to list
        var fileIDList = [];
        Object.extended(fileIDs).each(function(key, active) {

            if (active) {
                fileIDList.push(key);
            }
        });

        // create user item
        Item.updateUserItem(itemID, siteURL, title, searchTags, note, fileIDList, tags).then(function(data) {

            $scope.state.saving = false;
        });
    }

    /* showImagePanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function showImagePanel() {
        $rootScope.$broadcast('show-image-editor', {});
    }

    /* Scope Methods
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    $scope.saveItem = saveItem;
    $scope.showImagePanel = showImagePanel;
};


var App = angular.module('overmind');
App.controller('ItemDetailController', ItemDetailController);

ItemDetailController.$inject = ['$rootScope', '$scope', '$http', '$routeParams', '$location', '$q', 'User', 'Item', 'File', 'Tag'];
