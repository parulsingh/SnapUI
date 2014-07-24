define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        myJobsService = require('services/myJobsService');

    var title = 'All Jobs';


    var vm = {
        activate: activate,
        title: title,
        allJobs: ko.observableArray([]),
        allQueues: ko.observableArray([]),
        jobsAndQueues: ko.observableArray([]),
    };

    return vm;


    function activate() {
        ko.bindingHandlers.datepicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                //initialize datepicker with some optional options
                var options = allBindingsAccessor().datepickerOptions || {};
                $(element).datepicker(options);

                //when a user changes the date, update the view model
                ko.utils.registerEventHandler(element, "changeDate", function (event) {
                    var value = valueAccessor();
                    if (ko.isObservable(value)) {
                        value(event.date);
                    }
                });
            },
            update: function (element, valueAccessor) {
                var widget = $(element).data("datepicker");
                if (widget) {
                    widget.date = ko.utils.unwrapObservable(valueAccessor());
                    widget.setValue();
                }
            }
        };

        //sorting stuff
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;
        //logger.log(title + ' View Activated', null, title, true);

        self.sortByJobid = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Jobid > b.Jobid) return 1 * nameDirection;
                if (a.Jobid < b.Jobid) return -1 * nameDirection;
                return 0;
            });
        };

        self.sortByCheckid = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Checkid > b.Checkid) return 1 * nameDirection;
                if (a.Checkid < b.Checkid) return -1 * nameDirection;
                return 0;
            });
        };

        self.sortByDev = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Dev.toLowerCase() > b.Dev.toLowerCase()) return 1 * nameDirection;
                if (a.Dev.toLowerCase() < b.Dev.toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortByQueue = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Queue.toLowerCase() > b.Queue.toLowerCase()) return 1 * nameDirection;
                if (a.Queue.toLowerCase() < b.Queue.toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortByStatus = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Status[0].toLowerCase() > b.Status[0].toLowerCase()) return 1 * nameDirection;
                if (a.Status[0].toLowerCase() < b.Status[0].toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortByPriority = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Priority.toLowerCase() > b.Priority.toLowerCase()) return 1 * nameDirection;
                if (a.Priority.toLowerCase() < b.Priority.toLowerCase()) return -1 * nameDirection;
                return 0;
            });
        };
        self.sortBySubmitdate = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Submitdate > b.Submitdate) return 1 * nameDirection;
                if (a.Submitdate < b.Submitdate) return -1 * nameDirection;
                return 0;
            });
        };

        self.sortByBugid = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.PreBugId > b.PreBugId) return 1 * nameDirection;
                if (a.PreBugId < b.PreBugId) return -1 * nameDirection;
                return 0;
            });
        };

        self.sortByAttempts = function () {
            nameDirection = -nameDirection;
            self.allJobs.sort(function (a, b) {
                if (a.Attempts > b.Attempts) return 1 * nameDirection;
                if (a.Attempts < b.Attempts) return -1 * nameDirection;
                return 0;
            });
        };
        // filtering stuff
        self.jobIdFilter = ko.observable('');
        self.checkinIdFilter = ko.observable('');
        self.devFilter = ko.observable('');

        self.priorityFilters = ko.observableArray(["None", "High", "Low", "Normal"]);
        self.priorityFilter = ko.observable('');


        self.queueFilter = ko.observable('');

        self.statusFilters = ko.observableArray(["None", "Aborted", "Cancelled", "Completed", "In Progress", "Pending"]);
        self.statusFilter = ko.observable('');
        self.test_date = ko.observable(new Date());




        self.filteredItems = ko.computed(function () {
            var jobIdFilter = self.jobIdFilter();
            var checkinIdFilter = self.checkinIdFilter();
            var devFilter = self.devFilter();
            var priorityFilter = self.priorityFilter();
            var queueFilter = self.queueFilter();
            var statusFilter = self.statusFilter();
            var test_date = self.test_date();



            var jBool;
            var cBool;
            var dBool;
            var qBool;
            var sBool;
            var pBool;
            var daBool;
            var result;

            return ko.utils.arrayFilter(self.allJobs(), function (i) {
                console.log("THIS IS DEV " + i.Dev);

              if (!jobIdFilter || jobIdFilter == "") {
                  jBool = true;
              }
              else {

                  jBool = self.jobIdFilter() == String(i.Jobid).substring(0, self.jobIdFilter().length);

              }

              if (!checkinIdFilter || checkinIdFilter == "") {
                  cBool = true;
              }
              else {
                  cBool = self.checkinIdFilter() == String(i.Checkid).substring(0, self.checkinIdFilter().length);

              }
              if (!devFilter || devFilter == "") {
                  dBool = true;
              }
              else if (devFilter.substr(-1) == "*" && self.managerNames.indexOf(devFilter.substring(0, devFilter.length - 1)) != -1) {
                  var directReports;
                  
                  for (var j = 0; j < self.managers.length; j++) {
                      if (self.managers[j].Name == devFilter.substring(0, devFilter.length - 1)) {
                          directReports = self.managers[j].Reports;
                          break;
                      }
                  }
                  
                  
                  dBool = directReports.indexOf(i.Dev) != -1;
                  console.log("dev " + i.Dev + " this is dbool " + dBool);
              }
              else {
                  dBool = self.devFilter() == String(i.Dev).substring(0, self.devFilter().length);
              }
                
              if (!queueFilter || queueFilter == "None") {
                  qBool = true;
              } 
              else {
                  qBool = i.Queue == queueFilter;
            
              }

              if (!statusFilter || statusFilter == "None") {
                  sBool = true;
              } 
              else {
                  sBool = i.Status[0] == statusFilter;
            
              }
              if (!priorityFilter || priorityFilter == "None") {
                  pBool = true;
              }
              else {
                  pBool = i.Priority == priorityFilter;

              }
              var today = new Date();
              if (!test_date || ((test_date.getDay() == today.getDay()) && (test_date.getDate() == today.getDate()) && (test_date.getFullYear() == today.getFullYear()))) {
                  daBool = true;
              }
              else {
                  var dateString = i.Submitdate.substring(0, 10);
                  var split = dateString.split("-");
                  var dateString2 = split[0] + "/" + split[1] + "/" + split[2];

                  var jobDate = new Date(dateString2);
                  jobDate.setHours(0);
                  test_date.setHours(0);
                  daBool = test_date.getTime() == jobDate.getTime();

              }


              result = jBool && cBool && dBool && pBool && qBool && sBool && daBool;

              return result;

            });
        });


        if (self.allJobs().length > 0) {
            logger.log('Array already has data');
            return true;
        }

        return myJobsService
            .getAllJobs(self.jobsAndQueues)
            .then(function () {
                self.allJobs = ko.observableArray(self.jobsAndQueues()[0]);
                self.allQueues = ko.observableArray(self.jobsAndQueues()[1]);
                self.managers = self.jobsAndQueues()[2];
                self.managerNames = self.jobsAndQueues()[3];
                self.queueFilters = self.allQueues();
                self.queueFilters.reverse();
                self.queueFilters.push("None");
                self.queueFilters.reverse();
                console.log(self.allQueues());
                logger.log('Data loaded from server');

                ////////// Top Failuire Logic //////
                var failureDict = {};
                var jobsLength = self.allJobs().length;
                var jobs = self.allJobs();
                for (var i = 0; i < jobsLength; i++) {
                    if (jobs[i].Status[0] == "Aborted") {
                        var failure = jobs[i].Status[1];
                        if (typeof failureDict[failure] == "number") {
                            failureDict[failure]++;
                        }
                        else {
                            failureDict[failure] = 1;
                        }
                    }
                }
                var sortable = [];
                for (var failure in failureDict) {
                    sortable.push([failure, failureDict[failure]])
                }

                sortable.sort(function (a, b) { return a[1] - b[1] });
                self.firstFailure = sortable[0][0];
                self.secondFailure = sortable[1][0];
                self.thirdFailure = sortable[2][0];
                ///////////////////////////////////
            });
    }



});
