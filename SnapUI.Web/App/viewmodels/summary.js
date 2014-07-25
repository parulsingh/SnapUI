define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        jobsService = require('services/myJobsService');

    var title = 'My Jobs',
        allJobs = ko.observableArray([]);

    var vm = {
        activate: activate,
        title: title,
        allJobs: allJobs,
        list: [],
        jobsAndQueues: ko.observableArray([]),
        allQueues: ko.observableArray([]),
        compositionComplete: compositionComplete,
        queueArray: ko.observableArray([])
    };
    return vm;

    function compositionComplete() {

        //$('#chart').highcharts({
        //    chart: {
        //        renderTo: 'container',
        //        type: 'column',
        //        backgroundColor: 'transparent',
        //        width: 500
        //    },
        //    title: {
        //        text: 'All Queues'
        //    },
        //    series: [{
        //        name: "Week",
        //        color: '#00B2EE',
        //        data: vm.allQGraphData
        //    }, {
        //        name: "24 hours",
        //        color: '#FF4C4C',
        //        data: vm.allQGraphDataDay
        //    }],
        //    xAxis: {
        //        categories: ["Aborted", "Completed", "In Progress", "Pending", "Cancelled", "woohoo"]
        //    },
        //    yAxis: {
        //        title: {
        //            text: 'Number of Jobs'
        //        }
        //    },
        //    legend: {
        //        itemStyle: {
        //            fontWeight: 'none'
        //        }
        //    },
        //}
        //)
        for (var i = 0; i < vm.allQueues().length; i++) {
            $('#chart' + i).highcharts({
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: 'container',
                    type: 'column',
                    backgroundColor: 'transparent',
                    width: 400,
                    height: 450
                },
                title: {
                    text: vm.queueArray()[i][0]
                },
                series: [{
                    showInLegend: false,
                    name: "Week",
                    color: 'red',
                    data: vm.queueArray()[i][1]
                }, {
                    showInLegend: false,
                    name: "24 hours",
                    color: 'blue',
                    data: vm.queueArray()[i][2]                
                }],
                xAxis: {
                    //categories: ["Aborted", "Completed", "In Progress", "Pending"]
                    categories: ["Completed", "Aborted", "In Progress", "Pending"]
                },
                yAxis: {
                    title: {
                        text: '# of Jobs'
                    },
                },
                legend: {
                    itemStyle: {
                        fontWeight: 'none'
                    }
                },
                plotOptions: {
                    column: {
                        borderWidth: '0',
                        dataLabels: {
                            enabled: true,
                            color: 'black',
                        },
                        colorByPoint: true,
                    }
                },
                colors: ['#4AC948', '#FF6961', '#0198E1', '#878787']
            }
        )
        }
    };

    function activate() {
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;
        self.list = [5, 20]

        return jobsService
            .getAllJobs(self.jobsAndQueues)
            .then(function () {

                self.allJobs = ko.observableArray(self.jobsAndQueues()[0]);
                //names of queues
                self.allQueues = ko.observableArray(self.jobsAndQueues()[1]);

                //objects for all queue info for a week
                var allQueueData = {       
                    Completed: 0,
                    Aborted: 0,
                    "In Progress": 0,
                    Pending: 0,                    
                    //numCheckins: self.allJobs().length
                }
                //objects for all queue info for a day
                var allQueueDataDay = {           
                    Completed: 0,
                    Aborted: 0,
                    "In Progress": 0,
                    Pending: 0,                    
                    //numCheckins: 0
                }

                // array of objects holding info for specific queues for a week and day
                var queueArray = []; 

                // populating the array with objects
                //name week day
                for (var i = 0; i < self.allQueues().length; i++) {
                    queueArray[i] = [self.allQueues()[i],[0,0,0,0,0],[0,0,0,0,0]];
/*
                        {
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
                        numCheckinsDay: 0
                    }
                    */
                }
                //var statusDict = { "Aborted": 0, "Completed": 1, "In Progress": 2, "Pending": 3, "Cancelled": 4, "numCheckins": 5 };
                var statusDict = { "Completed": 0, "Aborted": 1, "In Progress": 2, "Pending": 3, };
                var checkins = [];
                var jobs = self.allJobs();
                // counting the aborted/completed.../.. values for specific queues for weeks and days
                // and then incrementing corresponding object values
                for (var i = 0; i < jobs.length; i++) {
                    // date comparison
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
                        if (queueArray[j][0] == queue) {
                            //queueArray[j][1][5]++;
                            queueArray[j][1][4]++;
                            queueArray[j][1][statusDict[status]]++;
                            if (jobDate.getTime() == d.getTime()) {
                                //queueArray[j][2][5]++;
                                queueArray[j][2][4]++;
                                queueArray[j][2][statusDict[status]]++;
                                allQueueDataDay.numCheckins++;
                                allQueueDataDay[status]++;
                            }
                        }
                    }
                    allQueueData[status]++;

                }
                for (var j = 0; j < queueArray.length; j++) {
                    checkins.push(queueArray[j][1].pop());
                    checkins.push(queueArray[j][2].pop());
                }

                // creating observables
                self.queueArray = ko.observableArray(queueArray);
                self.allQueueData = ko.observable(allQueueData);
                self.allQueueDataDay = ko.observable(allQueueDataDay);
                
                // counting values to put in highcharts
                self.allQGraphData = [];
                for (elem in self.allQueueData()) {
                    self.allQGraphData.push(self.allQueueData()[elem]);
                }
                self.allQGraphDataDay = [];
                for (elem in self.allQueueDataDay()) {
                    self.allQGraphDataDay.push(self.allQueueDataDay()[elem]);
                }
            });


    }

});
