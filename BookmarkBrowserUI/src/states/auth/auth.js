angular.module('bookmarkBrowser.states.auth', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('auth', {
        url: '/auth',
        views: {
            "main": {
                controller: 'AuthController',
                templateUrl: 'states/auth/auth.tpl.html'
            }
        }
    });
}).controller('AuthController', function AuthController($scope, $stateParams, ApplicationConfiguration, sharedService) {
    sharedService.setTitle('Authentication');



});
