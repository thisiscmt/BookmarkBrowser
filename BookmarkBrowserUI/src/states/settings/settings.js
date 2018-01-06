angular.module('bookmarkBrowser.states.settings', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        views: {
            "main": {
                controller: 'SettingsController',
                templateUrl: 'states/settings/settings.tpl.html'
            }
        }
    });
}).controller('SettingsController', function SettingsController($scope, $stateParams, ApplicationConfiguration, sharedService) {
    sharedService.setTitle("Options");



});
