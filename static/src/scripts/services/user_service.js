var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* User Service -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.factory('User', function($http) {
    'use strict';

    // service data
    var user = {};      // logged in user data

    // properties
    var loggedIn = false;


    /* isUserLoggedIn
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function isUserLoggedIn() {
        return loggedIn;
    }

    /* getUserInfo
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function getUserInfo() {
        return angular.copy(user);
    }

    /* login - /user/login/ [POST]
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function login(userInfo) {

        var requestData = {
            'username': userInfo.username,
            'password': userInfo.password
        };

        var url = 'api/user/login/';

        return $http({
            method: 'POST',
            url: url,
            data: $.param(requestData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function(data) {

            // set logged in status
            loggedIn = true;

            // set user info
            user.userID = data.data.user_id;
            user.userName = data.data.username;
            user.secretKey = data.data.secret_key;
            user.timeStamp = data.data.time_stamp;

            return data;
        });
    }

    /* createUser - /user/ [POST]
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function createUser(userInfo) {

        var requestData = {
            'username': userInfo.username,
            'password': userInfo.password
        };

        var url = 'api/user/';

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
        'isUserLoggedIn': isUserLoggedIn,
        'getUserInfo': getUserInfo,
        'login': login,
        'createUser': createUser
    };

    return publicMethods;
});
