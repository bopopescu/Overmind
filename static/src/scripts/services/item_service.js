var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Item Service -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.factory('Item', ['$http', 'User', function($http, User) {

    /* getUserItem -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function getUserItem(itemID) {

        var user = User.getUserInfo();

        var requestData = {
            'secret_key': user.secretKey
        };

        var url = '/api/user/item/' + itemID + '/';

        return $http({
            method: 'POST',
            url: url,
            data: $.param(requestData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function(data) {

            return data.data.user_item;
        });
    }

    /* getUserItems -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function getUserItems(cursor, tag, limit) {

        var user = User.getUserInfo();

        var requestData = {
            'secret_key': user.secretKey,
            'cursor': cursor,
            'user_tag': tag,
            'limit': limit
        };

        var url = '/api/user/items/';

        return $http({
            method: 'POST',
            url: url,
            data: $.param(requestData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function(data) {

            return data;
        });
    }

    /* createUserItem -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function createUserItem(siteURL, title, searchTags, note, fileIDs, tags) {

        var user = User.getUserInfo();

        var requestData = {
            'secret_key': user.secretKey,
            'site_url': siteURL,
            'title': title,
            'search_tags': searchTags,
            'note': note,
            'file_ids': fileIDs,
            'tags': tags
        };

        var url = '/api/user/item/create/';

        return $http({
            method: 'POST',
            url: url,
            data: $.param(requestData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function(data) {

            return data;
        });
    }

    /* updateUserItem -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function updateUserItem(itemID, siteURL, title, searchTags, note, fileIDs, tags) {

        var user = User.getUserInfo();

        var requestData = {
            'secret_key': user.secretKey,
            'site_url': siteURL,
            'title': title,
            'search_tags': searchTags,
            'note': note,
            'file_ids': fileIDs,
            'tags': tags
        };

        var url = '/api/user/item/' + itemID + '/update/';

        return $http({
            method: 'POST',
            url: url,
            data: $.param(requestData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function(data) {

            return data;
        });
    }

    /* PUBLIC METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'createUserItem': createUserItem,
        'getUserItem': getUserItem,
        'updateUserItem': updateUserItem,
        'getUserItems': getUserItems
    };

    return publicMethods;

}]);
