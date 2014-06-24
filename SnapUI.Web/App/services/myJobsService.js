define(function (require) {
    var http = require('plugins/http');

    var getMyJobs = function (results) {
        return http.get('api/myjobs')
            .then(function (data) {
                results(data);
            });
    }


    var getAllJobs = function (results) {
        return http.get('api/alljobs')
            .then(function (data) {
                results(data);
            });
    }

    return {
        getMyJobs: getMyJobs,
        getAllJobs: getAllJobs
    }
});