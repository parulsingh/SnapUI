define(function (require) {
    var http = require('plugins/http');
    var basePath = window.BaseUrl;

    var getMyJobs = function (results) {
        return http.get(basePath + 'api/myjobs')
            .then(function (data) {
                results(data);
            });
    }


    var getAllJobs = function (results) {
        return http.get(basePath + 'api/alljobs')
            .then(function (data) {
                results(data);
            });
    }

    return {
        getMyJobs: getMyJobs,
        getAllJobs: getAllJobs
    }
});