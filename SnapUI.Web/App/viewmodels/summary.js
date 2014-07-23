define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        jobsService = require('services/myJobsService');

    var title = 'My Jobs';


    var vm = {
        activate: activate,
        title: title,
        allJobs: ko.observableArray([]),
        jobsAndQueues: ko.observableArray([]),
        allQueues: ko.observableArray([]),
        header: ko.observable('head'),
        stacked: ko.observable(false),
        seriesList: ko.observableArray(),
        changeSeries1: function () {
            var series_1 = [{
                label: 'US',
                legendEntry: true,
                data: {
                    x: ['PS3', 'XBOX360', 'Wii'],
                    y: [12.35, 21.50, 30.56]
                }
            }];
            this.seriesList(series_1);
        },
        changeSeries2: function () {
            var series_2 = [{
                label: 'US',
                legendEntry: true,
                data: {
                    x: ['UNIX', 'WINDOWS', 'Wii'],
                    y: [30, 30, 10]
                }
            }];
            this.seriesList(series_2);
        }
    };

    return vm;



    function activate() {
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;
        //logger.log(title + ' View Activated', null, title, true);



        return jobsService
            .getAllJobs(self.jobsAndQueues)
            .then(function () {
                
                var init_series_1 = [{
                    label: 'US',
                    legendEntry: true,
                    data: {
                        x: ['PS3', 'XBOX360', 'Wii'],
                        y: [12.35, 21.50, 30.56]
                    }
                }];

                self.seriesList(init_series_1);

                self.allJobs = ko.observableArray(self.jobsAndQueues()[0]);
                self.allQueues = ko.observableArray(self.jobsAndQueues()[1]);
                
                var allQueueData = {
                    name: "All Queues",
                    Aborted: 0,
                    Completed: 0,
                    "In Progress": 0,
                    Pending: 0,
                    Cancelled: 0,
                    numCheckins: self.allJobs().length
                }
                var allQueueDataDay = {
                    name: "All Queues",
                    Aborted: 0,
                    Completed: 0,
                    "In Progress": 0,
                    Pending: 0,
                    Cancelled: 0,
                    numCheckins: 0
                }

                var queueArray = []; //week
                var queueArrayDay = [];

                for (var i = 0; i < self.allQueues().length; i++) {
                    queueArray[i] = {
                        name: self.allQueues()[i],
                        Aborted: 0,
                        Completed: 0,
                        "In Progress": 0,
                        Pending: 0,
                        Cancelled: 0,
                        numCheckins: 0,
                        AbortedDay: 0,
                        CompletedDay: 0,
                        "In ProgressDay": 0,
                        PendingDay: 0,
                        CancelledDay: 0,
                        numCheckinsDay:0
                    }

                }

                var jobs = self.allJobs();

                for (var i = 0; i < jobs.length; i++) {
                    
                    var dateString = jobs[i].Submitdate.substring(0, 10);
                    var split = dateString.split("-");
                    var dateString2 = split[0] + "/" + split[1] + "/" + split[2];
                    var jobDate = new Date(dateString2);
                    jobDate.setHours(0);
                    var d = new Date();
                    d.setHours(0);
                    d.setMinutes(0);
                    d.setSeconds(0);
                    d.setMilliseconds(0);

       
                    var status = jobs[i].Status[0];
                    var queue = jobs[i].Queue;
                    for (var j = 0; j < queueArray.length; j++) {
                        if (queueArray[j].name == queue) {
                            queueArray[j].numCheckins++;
                            queueArray[j][status]++;
                            
                            //console.log(jobDate.getTime());
                            //console.log(d.getTime());
                            if (jobDate.getTime() == d.getTime()) {
                              
                                queueArray[j]['numCheckinsDay']++;
                                queueArray[j][status + 'Day']++;
                                allQueueDataDay.numCheckins++;
                                allQueueDataDay[status]++;
                            }
                        }

                    }

                    allQueueData[status]++;
                }
                



                self.queueArray = ko.observableArray(queueArray);
                self.queueArrayDay = ko.observableArray(queueArrayDay);
                self.allQueueData = ko.observable(allQueueData);
                self.allQueueDataDay = ko.observable(allQueueDataDay);
            });


    }

});
