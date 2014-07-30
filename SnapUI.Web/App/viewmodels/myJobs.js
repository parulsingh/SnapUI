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

        self.sortByColumn = function (value) {
            nameDirection = -nameDirection;
            if (value == "Status") {
                self.myJobs.sort(function (a, b) {
                    if (a[value][0].toLowerCase() > b[value][0].toLowerCase()) return 1 * nameDirection;
                    if (a[value][0].toLowerCase() < b[value][0].toLowerCase()) return -1 * nameDirection;
                    return 0;
                });
            }
            else {
                self.myJobs.sort(function (a, b) {
                    if (typeof a[value] == "string") {
                        a[value] = a[value].toLowerCase();
                        b[value] = b[value].toLowerCase();
                    }

                    if (a[value] > b[value]) return 1 * nameDirection;
                    if (a[value] < b[value]) return -1 * nameDirection;
                    return 0;
                });
            }


        };

        return myJobsService
            .getMyJobs(self.jobsAndQueues)
            .then(function () {
                self.myJobs = ko.observableArray(self.jobsAndQueues()[0]);

            });


    }

});
