var App = angular.module('overmind');

// Routes
App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.

        // home view (logged out)
        when('/', {templateUrl: '/static/src/partials/views/home_view.html', controller: HomeController}).

        // home view (logged in)
        when('/add', {templateUrl: '/static/src/partials/views/add_item_view.html', controller: AddItemController}).

        // item detail
        when('/item/:itemID', {templateUrl: '/static/src/partials/views/item_detail_view.html', controller: ItemDetailController}).

        when('/:username', {templateUrl: '/static/src/partials/views/user_home_view.html', controller: UserHomeController});
}]);
