define(function (require) {
    var http = require('plugins/http');

    var getMyPrefs = function (results) {
        return http.get('api/UserPref')
            .then(function (data) {
                results(data);
            });
    }

    return {
        getMyPrefs: getMyPrefs
    }
});