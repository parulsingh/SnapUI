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
        sortValue: ko.observable(),
        jobsAndQueues: ko.observableArray([]),
        sortByJobid: function () {},
        sortByCheckid: function () {},
        sortByDev: function () {},
        sortByQueue: function () {},
        sortByStatus: function () {},
        sortByPriority: function () { },
        sortBySubmitdate: function () { },
        sortByBugid: function () { },
        sortByAttempts: function () { },
        jobIdFilter: ko.observable(''),
        checkinIdFilter: ko.observable(''),
        devFilter: ko.observable(''),
        priorityFilters: ko.observableArray(["None", "High", "Low", "Normal"]),
        priorityFilter: ko.observable(''),
        queueFilter: ko.observable(''),
        statusFilters: ko.observableArray(["None", "Aborted", "Cancelled", "Completed", "In Progress", "Pending"]),
        statusFilter: ko.observable(''),
        test_date : ko.observable(new Date())
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

        /////////////////////////////////// sorting code ///////////////////////////////////////
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;

        self.sortByColumn = function (value) {
            nameDirection = -nameDirection;
            if (value == "Status") {
                self.allJobs.sort(function (a, b) {
                    if (a[value][0].toLowerCase() > b[value][0].toLowerCase()) return 1 * nameDirection;
                    if (a[value][0].toLowerCase() < b[value][0].toLowerCase()) return -1 * nameDirection;
                    return 0;
                });
            }
            else {
                self.allJobs.sort(function (a, b) {
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

        ////////////////////////////////////////////////////////////////////////////////////


        /////////////////////////// filtering stuff ////////////////////////////

        self.filteredItems = ko.computed(function () {
            var jobIdFilter = self.jobIdFilter();
            var checkinIdFilter = self.checkinIdFilter();
            var devFilter = self.devFilter();
            var priorityFilter = self.priorityFilter();
            var queueFilter = self.queueFilter();
            var statusFilter = self.statusFilter();
            var test_date = self.test_date();
            var jBool = true;
            var cBool = true;
            var dBool = true;
            var qBool = true;
            var sBool = true;
            var pBool = true;
            var daBool = true;
            var result;

            return ko.utils.arrayFilter(self.allJobs(), function (i) {
              if (jobIdFilter != "") {
                  jBool = self.jobIdFilter() == String(i.Jobid).substring(0, self.jobIdFilter().length);
              }

              if (checkinIdFilter != "") {
                  cBool = self.checkinIdFilter() == String(i.Checkid).substring(0, self.checkinIdFilter().length);
              }

              if (devFilter != "") {
                  dBool = self.devFilter() == String(i.Dev).substring(0, self.devFilter().length);
              }
              if (devFilter.substr(-1) == "*" && self.managerNames.indexOf(devFilter.substring(0, devFilter.length - 1)) != -1) {
                  var directReports;
                  
                  for (var j = 0; j < self.managers.length; j++) {
                      if (self.managers[j].Name == devFilter.substring(0, devFilter.length - 1)) {
                          directReports = self.managers[j].Reports;
                          break;
                      }
                  }
     
                  dBool = directReports.indexOf(i.Dev) != -1;
              }

              if (queueFilter != "None") {
                  qBool = i.Queue == queueFilter;
              } 

              if (statusFilter != "None") {
                  sBool = i.Status[0] == statusFilter;
              } 

              if (priorityFilter != "None") {
                  pBool = i.Priority == priorityFilter;
              }

              var today = new Date();
              if (((test_date.getDay() != today.getDay()) || (test_date.getDate() != today.getDate()) || (test_date.getFullYear() != today.getFullYear()))) {
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
        /////////////////////////////////////////////////////////////////


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
                self.queueFilters.unshift("None");   // to make None the first option
            });
    }



});
