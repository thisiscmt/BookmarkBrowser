var BMB = BMB || {};

BMB.Common = function () {
    curInstance = this;

    /* From http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript */
    curInstance.getUrlParms = function () {
        var urlParams = {};

        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.search.substring(1);

        while (e = r.exec(q))
            urlParams[d(e[1])] = d(e[2]);

        return urlParams;
    }

    return curInstance;
}();
