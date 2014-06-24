define(function (require) {
    var http = require('plugins/http');

    var getMyJobs = function (results) {
        return http.get('api/myjobs')
            .then(function (data) {
                results(data);
            });
    }



    return {
        getMyJobs: getMyJobs
    }
});