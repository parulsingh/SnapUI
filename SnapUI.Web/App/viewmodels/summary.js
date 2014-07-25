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
        queueArray: ko.observableArray([]),
        durationDay: ko.observableArray([]),
        durationWeek: ko.observableArray([]),
        allQGraphData: ko.observableArray([]),
        allQGraphDataDay: ko.observableArray([])
    };
    return vm;

    function compositionComplete() {
        $('#allqueues').highcharts({
            credits: {
                enabled: false
            },
            chart: {
                //renderTo: 'container',
                type: 'column',
                backgroundColor: 'transparent',
                width: 800,
                height: 450
            },
            title: {
                text: "All Queues"
            },
            series: [{
                showInLegend: true,
                name: "Week",
                color: 'red',
                data: vm.allQGraphData()
            }, {
                showInLegend: true,
                name: "24 hours",
                color: 'blue',
                data: vm.allQGraphDataDay()
            }],
            xAxis: {
                categories: ["Completed", "Aborted", "In Progress", "Pending"]
            },
            yAxis: {
                title: {
                    text: '# of Jobs'
                },
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
        $('#duration').highcharts({
            credits: {
                enabled: false
            },
            chart: {
                //renderTo: 'container',
                type: 'column',
                backgroundColor: 'transparent',
                width: 800,
                height: 450
            },
            title: {
                text: "Time to Success" 
            },
            series: [{
                showInLegend: true,
                name: "Week",
                color: 'red',
                data: vm.durationWeek()
            }, {
                showInLegend: true,
                name: "24 hours",
                color: 'blue',
                data: vm.durationDay()
            }],
            xAxis: {
                categories: vm.allQueues()
            },
            yAxis: {
                title: {
                    text: 'Time to Completion (minutes)'
                },
            },

            plotOptions: {
                column: {
                    borderWidth: '0',
                    dataLabels: {
                        enabled: true,
                        color: 'black'
                        
                    },
                    colorByPoint: true,
                }
            },
            colors: ['#4AC948', '#FF6961', '#0198E1', '#878787']
        }
)

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
                    showInLegend: true,
                    name: "Week",
                    color: 'red',
                    data: vm.queueArray()[i][1]
                }, {
                    showInLegend: true,
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
                //name week day duration
                for (var i = 0; i < self.allQueues().length; i++) {
                    queueArray[i] = [self.allQueues()[i], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0]];
                }

                //var statusDict = { "Aborted": 0, "Completed": 1, "In Progress": 2, "Pending": 3, "Cancelled": 4, "numCheckins": 5 };
                var statusDict = { "Completed": 0, "Aborted": 1, "In Progress": 2, "Pending": 3, };
                var checkins = [];
                var jobs = self.allJobs();
                var numCompletedWeek = 0;
                var numCompletedDay = 0;
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
                            
                            console.log("status " + status + " jobid " + jobs[i].Jobid + " duration " + jobs[i].Duration);
                            if (status == "Completed") {
                                queueArray[j][3][0] += jobs[i].Duration;
                                numCompletedWeek++;
                            }
                            if (jobDate.getTime() == d.getTime()) {
                                //queueArray[j][2][5]++;
                                queueArray[j][2][4]++;
                                queueArray[j][2][statusDict[status]]++;
                                //allQueueDataDay.numCheckins++;
                                allQueueDataDay[status]++;
                                
                                if (status == "Completed") {
                                    queueArray[j][3][1] += jobs[i].Duration;
                                    numCompletedDay++;
                                }
                            }
                        }
                    }
                    allQueueData[status]++;

                }

                for (var j = 0; j < queueArray.length; j++) {
                    var weekCheckins = checkins.push(queueArray[j][1].pop());
                    var dayCheckins = checkins.push(queueArray[j][2].pop());
                    queueArray[j][3][0] = queueArray[j][3][0] / numCompletedWeek;
                    queueArray[j][3][1] = queueArray[j][3][1] / numCompletedDay;
                }

                //duration stuff
                var durationWeek = [];
                var durationDay = [];
                for (var j = 0; j < queueArray.length; j++) {
                    durationWeek.push(Math.round(queueArray[j][3][0]));
                    durationDay.push(Math.round(queueArray[j][3][1]));
                }
              

                // creating observables
                self.queueArray = ko.observableArray(queueArray);
                self.allQueueData = ko.observable(allQueueData);
                self.allQueueDataDay = ko.observable(allQueueDataDay);
                self.durationWeek = ko.observable(durationWeek);
                self.durationDay = ko.observable(durationDay);

                // counting values to put in highcharts
                allQGraphData = [];
                for (elem in self.allQueueData()) {
                    allQGraphData.push(self.allQueueData()[elem]);
                }
                allQGraphDataDay = [];
                for (elem in self.allQueueDataDay()) {
                    allQGraphDataDay.push(self.allQueueDataDay()[elem]);
                }
                console.log("All Q grpah data " + allQGraphData);
                self.allQGraphData = ko.observable(allQGraphData);
                self.allQGraphDataDay = ko.observable(allQGraphDataDay);
            });


    }

});
