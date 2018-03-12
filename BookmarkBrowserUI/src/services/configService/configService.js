angular.module('bookmarkBrowser.services.configService', [
//    'ngStorage',

    'bookmarkBrowser.config'
]).service('configService', function ($http, $q, applicationConfiguration) {
    //#region API methods
    var _uploadBookmarkData = function _uploadBookmarkData(bookmarkData, authHeader) {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: applicationConfiguration.apiURL + "/api/bookmark",
            headers: { "Authorization": authHeader },
            data: { "bookmarkData": bookmarkData, "uploadTimestamp": new Date().getTime().toString() }
        }).then(function (data) {
            deferred.resolve(data);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _downloadBookmarkData = function _downloadBookmarkData(authHeader) {
        var deferred = $q.defer();

        $http({
            method: "get",
            url: applicationConfiguration.apiURL + "/api/bookmark",
            headers: { "Authorization": authHeader }
        }).then(function (data) {
            deferred.resolve(data.data);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };
    //#endregion

    return {
        uploadBookmarkData     : _uploadBookmarkData,
        downloadBookmarkData   : _downloadBookmarkData
    };
});
