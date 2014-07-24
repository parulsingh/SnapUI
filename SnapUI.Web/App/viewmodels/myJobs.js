define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        myJobsService = require('services/myJobsService');

    var title = 'My Jobs';


    var vm = {
        activate: activate,
        title: title,
        myJobs: ko.observableArray([]),
        jobsAndQueues: ko.observableArray([])
    };

    return vm;



    function activate() {
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;
        //logger.log(title + ' View Activated', null, title, true);

        if (self.myJobs().length > 0) {
            logger.log('Array already has data');
            return true;
        }
        self.sortByJobid = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Jobid > b.Jobid) return 1 * nameDirection;
                if (a.Jobid < b.Jobid) return -1 * nameDirection;
                return 0;
            });
        };

        self.sortByCheckid = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Checkid > b.Checkid) return 1 * nameDirection;
                if (a.Checkid < b.Checkid) return -1 * nameDirection;
                return 0;
            });
        };

        self.sortByDev = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Dev.toLowerCase() > b.Dev.toLowerCase()) return 1 * nameDirection;
                if (a.Dev.toLowerCase() < b.Dev.toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortByQueue = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Queue.toLowerCase() > b.Queue.toLowerCase()) return 1 * nameDirection;
                if (a.Queue.toLowerCase() < b.Queue.toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortByStatus = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Status[0].toLowerCase() > b.Status[0].toLowerCase()) return 1 * nameDirection;
                if (a.Status[0].toLowerCase() < b.Status[0].toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortByPriority = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Priority.toLowerCase() > b.Priority.toLowerCase()) return 1 * nameDirection;
                if (a.Priority.toLowerCase() < b.Priority.toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortBySubmitdate = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Submitdate > b.Submitdate) return 1 * nameDirection;
                if (a.Submitdate < b.Submitdate) return -1 * nameDirection;
                return 0;
            });
        };

        self.sortByBugid = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.PreBugId > b.PreBugId) return 1 * nameDirection;
                if (a.PreBugId < b.PreBugId) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortByAttempts = function () {
            nameDirection = -nameDirection;
            self.myJobs.sort(function (a, b) {
                if (a.Attempts > b.Attempts) return 1 * nameDirection;
                if (a.Attempts < b.Attempts) return -1 * nameDirection;
                return 0;
            });
        };
        //$(function () {

        //    $('#jobid-filter').change(function () {
        //        var filterValue = $(this).val();

        //        $('tbody tr').each(function () {
        //            var $tr = $(this);
        //            if ($tr.find('td:eq(1)').html() != filterValue) {
        //                $tr.hide();
        //            } else {
        //                $tr.show();
        //            }
        //        });
        //    });

        //});

        return myJobsService
            .getMyJobs(self.jobsAndQueues)
            .then(function () {
                self.myJobs = ko.observableArray(self.jobsAndQueues()[0]);
          
            });


    }

});