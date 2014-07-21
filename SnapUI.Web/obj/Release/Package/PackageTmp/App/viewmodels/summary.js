define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        jobsService = require('services/myJobsService');

    var title = 'My Jobs';


    var vm = {
        activate: activate,
        title: title,
        jobs: ko.observableArray([])
    };

    return vm;



    function activate() {
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;
        //logger.log(title + ' View Activated', null, title, true);

        if (self.jobs().length > 0) {
            logger.log('Array already has data');
            return true;
        }


        return jobsService
            .getAllJobs(self.jobs)
            .then(function () {
                //// add summary calculating logic here /////
                var today = new Date();
                var jobs = self.jobs();
                self.numCheckins = jobs.length;

                for (var i = 0; i < jobs.length; i++) {

                }

                logger.log('Data loaded from server');
            });


    }

});