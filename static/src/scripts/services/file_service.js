var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* File Service -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.factory('File', function($http, User) {
    'use strict';

    /* getUserFiles -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function getUserFiles(cursor) {

        var user = User.getUserInfo();

        var requestData = {
            'secret_key': user.secretKey,
            'cursor': cursor
        };

        var url = '/api/user/files/';

        return $http({
            method: 'POST',
            url: url,
            data: $.param(requestData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
    }

    /* uploadBase64Image -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function uploadBase64Image(base64Image) {

        var user = User.getUserInfo();

        var requestData = {
            'file': base64Image,
            'secret_key': user.secretKey
        };

        var url = '/api/files/upload/base64/';

        return $http({
            method: 'POST',
            url: url,
            data: $.param(requestData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        });

    }

    /* PUBLIC METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'getUserFiles': getUserFiles,
        'uploadBase64Image': uploadBase64Image
    };

    return publicMethods;

});
