angular.module('bookmarkBrowser.states.bookmarks', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('bookmarks', {
        url: '/bookmarks',
        views: {
            "main": {
                controller: 'BookmarksController',
                templateUrl: 'states/bookmarks/bookmarks.tpl.html'
            }
        }
    });
}).controller('BookmarksController', function BookmarksController($scope, $stateParams, ApplicationConfiguration, sharedService) {
    sharedService.setTitle('Bookmarks');



});
