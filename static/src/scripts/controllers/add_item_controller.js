/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Add Item Controller - add user items
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var AddItemController = function($rootScope, $scope, Item, File, Tag) {

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
        activeUserFiles: {}
    };

    $scope.imageEditor = {};

    initialize();

    /* getItems -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function initialize() {

        // get user tags
        getUserTags();
        createEventHandlers();
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

    /* saveItem - save as user item
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function saveItem() {

        $scope.state.saving = true;

        // item form data
        var title = $scope.itemForm.title,
            siteURL = $scope.itemForm.url,
            searchTags = $scope.itemForm.searchTags,
            tags = [],
            note = $scope.itemForm.notes.read;

        Object.extended($scope.itemForm.userTags.selectedTags).each(function(tag, value) {
            tags.push(tag);
        });

        // get file IDs as array
        var fileIDs = [];

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
        Item.createUserItem(siteURL, title, searchTags, note, fileIDList, tags).then(function(data) {

            $scope.state.saving = false;
        });
    }

    /* showImagePanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function showImagePanel() {
        $rootScope.$broadcast('show-image-editor', {});
    }

    /* closeImagePanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function closeImagePanel() {
    }

    /* Scope Methods
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    $scope.saveItem = saveItem;
    $scope.showImagePanel = showImagePanel;
};


var App = angular.module('overmind');
App.controller('AddItemController', AddItemController);

AddItemController.$inject = ['$rootScope', '$scope', 'Item', 'File', 'Tag'];
