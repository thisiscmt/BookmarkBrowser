angular.module('bookmarkBrowser.states.preferences', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('preferences', {
        url: '/preferences',
        views: {
            "main": {
                controller: 'PreferencesController',
                templateUrl: 'states/preferences/preferences.tpl.html'
            }
        }
    });
}).controller('PreferencesController', function PreferencesController($scope, $stateParams, ApplicationConfiguration, sharedService) {
    sharedService.setTitle("Preferences");



});
