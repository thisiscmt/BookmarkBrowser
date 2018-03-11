angular.module('bookmarkBrowser.services.sharedService', [
    'ngStorage'
]).service('sharedService', function ($localStorage, $sessionStorage) {
    var _pageTitle = "";
    var _currentPage = "";
    var _currentDirectory = "Root";
    var _displayMessage = "";

    var _isMobile = {
        Android: function () {
            return !!navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return !!navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return !!navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return !!navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (_isMobile.Android() || _isMobile.BlackBerry() || _isMobile.iOS() || _isMobile.Opera() || _isMobile.Windows());
        }
    };

    var _setTitle = function _setTitle(title) {
        _pageTitle = title;
    };

    var _getTitle = function _getTitle() {
        return _pageTitle;
    };

    var _setCurrentPage = function _setCurrentPage(page) {
        _currentPage = page;
    };

    var _getCurrentPage = function _getCurrentPage() {
        return _currentPage;
    };

    var _setDisplayMessage = function _setDisplayMessage(msg) {
        _displayMessage = msg;
    };

    var _getDisplayMessage = function _getDisplayMessage() {
        return _displayMessage;
    };

    var _setApplicationData = function _setApplicationData(key, value) {
        $localStorage[key] = value;
    };

    var _getApplicationData = function _getApplicationData(key) {
        return $localStorage[key];
    };

    var _removeApplicationData = function _getApplicationData(key) {
        delete $localStorage[key];
    };

    var _setSessionData = function _setSessionData(key, value) {
        $sessionStorage[key] = value;
    };

    var _getSessionData = function _getSessionData(key) {
        return $sessionStorage[key];
    };

    var _removeSessionData = function _getSessionData(key) {
        delete $sessionStorage[key];
    };

    var _getDirectoryFromPath = function _getDirectoryFromPath(path) {
        var index = path.lastIndexOf("\\");

        if (index > -1) {
            return path.substr(index + 1);
        }
        else {
            return path;
        }
    };

    return {
        isMobile              : _isMobile,
        setCurrentPage        : _setCurrentPage,
        getCurrentPage        : _getCurrentPage,
        setTitle              : _setTitle,
        getTitle              : _getTitle,
        setDisplayMessage     : _setDisplayMessage,
        getDisplayMessage     : _getDisplayMessage,
        setApplicationData    : _setApplicationData,
        getApplicationData    : _getApplicationData,
        removeApplicationData : _removeApplicationData,
        setSessionData        : _setSessionData,
        getSessionData        : _getSessionData,
        removeSessionData     : _removeSessionData,
        getDirectoryFromPath  : _getDirectoryFromPath
    };
});
