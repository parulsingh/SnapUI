﻿define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        jobsService = require('services/myJobsService');

    var title = 'My Jobs';


    var vm = {
        activate: activate,
        title: title,
        jobs: ko.observableArray([]),
        jobsAndQueues: ko.observableArray([]),
        allQueues: ko.observableArray([])
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
            .getAllJobs(self.jobsAndQueues)
            .then(function () {
                //// add summary calculating logic here /////
                /// "intune_dev_office" 1, "intune_dev_office_test" 2, "JupiterSnapVM5" 3, "Sandbox4" 4, "SCCM_Office" 5, "SccmMain" 6, "SCCM-WEH2-CVP" 7 })
                self.jobs = ko.observableArray(self.jobsAndQueues[0]);
                var today = new Date();
                var jobs = self.jobs();
                self.numCheckins = jobs.length;
                var allQueues = {};

            });


    }

});
