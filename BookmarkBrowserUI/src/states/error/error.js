angular.module('bookmarkBrowser.states.error', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('error', {
        url: '/error',
        views: {
            "main": {
                controller: 'ErrorController',
                templateUrl: 'states/error/error.tpl.html'
            }
        },
        data: {
            title: "Error"
        }
    });
}).controller('ErrorController', function ErrorController($scope, $stateParams, applicationConfiguration, sharedService) {
    sharedService.setTitle('Error');

});
