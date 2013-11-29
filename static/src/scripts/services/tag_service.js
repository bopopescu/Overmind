var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Tag Service -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.factory('Tag', ['$http', 'User', function($http, User) {


    /* getUserTags -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function getUserTags() {

        var user = User.getUserInfo();

        var requestData = {
            'secret_key': user.secretKey
        };

        var url = '/api/user/tags/';

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
        'getUserTags': getUserTags
    };

    return publicMethods;

}]);
