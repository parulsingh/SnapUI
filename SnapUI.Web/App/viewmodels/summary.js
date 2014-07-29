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
        durationWeekCheckID: ko.observableArray([]),
        durationDayCheckID: ko.observableArray([]),
        durationWeek: ko.observableArray([]),
        allQGraphData: ko.observableArray([]),
        allQGraphDataDay: ko.observableArray([]),
        weekCheckins: ko.observableArray([]),
        dayCheckins: ko.observableArray([]),
        totalWeekCheckins: ko.observable([])
    };
    return vm;

    function compositionComplete() {
        $('#allqueues').highcharts({
            credits: {
                enabled: false
            },
            chart: {
   
                type: 'column',
                backgroundColor: 'transparent',
                width: 800,
                height: 450
            },
            title: {
                text: "All Queues"
            },
            labels: {
                items: [{
                    html: 'Total Checkins ' + vm.totalWeekCheckins(),
                    style: {
                        left: '10px',
                        top: '360px',
                        color: 'black',
                        //zIndex : 100
                    }
                }]
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
      
                type: 'column',
                backgroundColor: 'transparent',
                width: 800,
                height: 450
            },
            title: {
                text: "Average Time to Completion (per Job)" 
            },
            series: [{

                showInLegend: true,
                name: "Week",
                color: 'green',
                data: vm.durationWeek()
            }, {
                showInLegend: true,
                name: "24 hours",
                color: '#4AC948',
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
                   
                }
            },
            
        }
)
        $('#duration2').highcharts({
            credits: {
                enabled: false
            },
            chart: {

                type: 'column',
                backgroundColor: 'transparent',
                width: 800,
                height: 450
            },
            title: {
                text: "Average Time to Completion (per Changelist)"
            },
            series: [{

                showInLegend: true,
                name: "Week",
                color: 'green',
                data: vm.durationWeekCheckID()

            }, {
                showInLegend: true,
                name: "24 hours",
                color: '#4AC948',
                data: vm.durationDayCheckID()
            }],
            xAxis: {
                categories: vm.allQueues()
            },
            yAxis: {
                title: {
                    text: 'Time to Completion (minutes)'
                },
            },
            /*tooltip: {
                enabled: true,
                formatter: function () {
                    return "# of Submits: " +_ ;
                }
            },*/
            plotOptions: {
                column: {
                    borderWidth: '0',
                    dataLabels: {
                        enabled: true,
                        color: 'black'

                    },

                }
            },

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
                    width: 375,
                    height: 450
                },
                title: {
                    text: vm.queueArray()[i][0] 
                },
                labels: {
                    items: [{
                        html: 'Total Checkins ' + vm.weekCheckins()[i],
                        style: {
                            left: '10px',
                            top: '350px',
                            color: 'black',
                            //zIndex : 100
                        }
                    }]
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
                    numCheckins: self.allJobs().length
                }
                //objects for all queue info for a day
                var allQueueDataDay = {
                    Completed: 0,
                    Aborted: 0,
                    "In Progress": 0,
                    Pending: 0,
                    numCheckins: 0
                }

                // array of objects holding info for specific queues for a week and day
                var queueArray = [];

                // populating the array with objects
                //name week day durationjobID numcompletedJOBID durationcheckinID numCompletedCHECKinID 
                for (var i = 0; i < self.allQueues().length; i++) {
                    //                     0                     1              2             3       4      5     6
                    queueArray[i] = [self.allQueues()[i], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0], [0,0], [0,0],[0,0]];
                }

     
                var statusDict = { "Completed": 0, "Aborted": 1, "In Progress": 2, "Pending": 3 };
                
                var jobs = self.allJobs();
                

                // counting the aborted/completed.../.. values for specific queues for weeks and days
                // and then incrementing corresponding object values
                for (var i = 0; i < jobs.length; i++) {
                    console.log("THis is dict " + JSON.stringify(jobs[i].Dict));
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
                    var checkinId = jobs[i].Checkid;
                    var durationDict = jobs[i].Dict;
                    for (var j = 0; j < queueArray.length; j++) {

                        if (queueArray[j][0] == queue) {                 
                            queueArray[j][1][4]++;
                            queueArray[j][1][statusDict[status]]++;                                                
                            if (status == "Completed") {                          
                                queueArray[j][3][0] += jobs[i].Duration;
                                queueArray[j][4][0]++;
                                queueArray[j][5][0] += durationDict[checkinId]["Duration"];
                                queueArray[j][6][0]++;
                            }
                            if (jobDate.getTime() == d.getTime()) {                         
                                queueArray[j][2][4]++;
                                queueArray[j][2][statusDict[status]]++;
                                //allQueueDataDay.numCheckins++;
                                allQueueDataDay[status]++;                              
                                if (status == "Completed") {
                                    queueArray[j][3][1] += jobs[i].Duration;
                                    queueArray[j][4][1]++;
                                    queueArray[j][5][1] += durationDict[checkinId]["Duration"];
                                    queueArray[j][6][1]++;
                                }
                            }
                        }
                    }

                    allQueueData[status]++;

                }
              

                // more duration stuff
                var weekCheckins = [];
                var dayCheckins = [];
                var durationWeek = [];
                var durationDay = [];
                var durationWeekCheckID = [];
                var durationDayCheckID = [];
                for (var j = 0; j < queueArray.length; j++) {
                    weekCheckins.push(queueArray[j][1].pop());
                    dayCheckins.push(queueArray[j][2].pop());
                    if (queueArray[j][4][0] == 0) {
                        queueArray[j][3][0] = 0;
                    } else {
                        queueArray[j][3][0] = queueArray[j][3][0] / queueArray[j][4][0];
                    }
                    if (queueArray[j][4][1] == 0) {
                        queueArray[j][3][1] = 0;
                    } else {
                        queueArray[j][3][1] = queueArray[j][3][1] / queueArray[j][4][1];
                    }
                    if (queueArray[j][6][0] == 0) {
                        queueArray[j][5][0] = 0;
                    } else {
                        queueArray[j][5][0] = queueArray[j][5][0] / queueArray[j][6][0];
                    }
                    if (queueArray[j][6][1] == 0) {
                        queueArray[j][5][1] = 0;
                    } else {
                        queueArray[j][5][1] = queueArray[j][5][1] / queueArray[j][6][1];
                    }
                    
                    durationWeek.push(Math.round(queueArray[j][3][0]));
                    durationDay.push(Math.round(queueArray[j][3][1]));
                    durationWeekCheckID.push(Math.round(queueArray[j][5][0]));
                    durationDayCheckID.push(Math.round(queueArray[j][5][1]));
                }

                // creating observables
                self.queueArray = ko.observableArray(queueArray);
                self.allQueueData = ko.observable(allQueueData);
                self.allQueueDataDay = ko.observable(allQueueDataDay);
                self.durationWeek = ko.observable(durationWeek);
                self.durationDay = ko.observable(durationDay);
                self.durationWeekCheckID = ko.observable(durationWeekCheckID);
                self.durationDayCheckID = ko.observable(durationDayCheckID);
                self.weekCheckins = ko.observable(weekCheckins);
                self.dayCheckins = ko.observable(dayCheckins);
                
                // counting values to put in highcharts
                allQGraphData = [];
                for (elem in self.allQueueData()) {
                    allQGraphData.push(self.allQueueData()[elem]);
                }
                var totalWeekCheckins = allQGraphData.pop();

                allQGraphDataDay = [];
                for (elem in self.allQueueDataDay()) {
                    allQGraphDataDay.push(self.allQueueDataDay()[elem]);
                }
                self.allQGraphData = ko.observable(allQGraphData);
                self.allQGraphDataDay = ko.observable(allQGraphDataDay);
                self.totalWeekCheckins = ko.observable(totalWeekCheckins);

            });


    }

});
