define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        jobsService = require('services/myJobsService');

    var title = 'My Jobs', 
        allJobs = ko.observableArray([]);

    function setData(data) {
        for (var i = 0, l = data.length; i < l; i++)
            data[i].y = parseFloat(data[i].price); //modify this

        chart.series[0].setData(data);
    }

    var GiftModel = function (gifts) {
        var self = this;
        self.gifts = ko.observableArray(gifts);

    };
    
    var vm = {
        activate: activate,
        title: title,
        allJobs: allJobs,
        list: [],
        jobsAndQueues: ko.observableArray([]),
        allQueues: ko.observableArray([]),
        compositionComplete: compositionComplete,
        dummyGraph: ko.observableArray([
        { name: "Tall Hat", price: "39.95" },
        { name: "Long Cloak", price: "120.00" }
        ])
    };
    return vm;

    function compositionComplete() {

        $('#chart').highcharts({
            chart: {
                type: 'column'
            },
            series: [{
                data: vm.list
            }]
        }

        )
    };

    function activate() {
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;
        self.list = [5,20]

        return jobsService
            .getAllJobs(self.jobsAndQueues)
            .then(function () {
                //// add summary calculating logic here /////
                /// "intune_dev_office" 1, "intune_dev_office_test" 2, "JupiterSnapVM5" 3, "Sandbox4" 4, "SCCM_Office" 5, "SccmMain" 6, "SCCM-WEH2-CVP" 7 })
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
