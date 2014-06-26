define(function (require) {
    var logger = require('services/logger'),
        ko = require('knockout'),
        myJobsService = require('services/myJobsService');

    var title = 'All Jobs';


    var vm = {
        activate: activate,
        title: title,
        allJobs: ko.observableArray([]),
    };

    return vm;


    function activate() {
        var self = this;
        var nameDirection = -1;
        var qtyDirection = -1;
        logger.log(title + ' View Activated', null, title, true);
        // filtering stuff
        self.jobIdFilter = ko.observable('');

        self.checkinIdFilter = ko.observable('');

        self.devFilter = ko.observable('');

        self.priorityFilters = ko.observableArray(["None", "High", "Low", "Normal"]);
        self.priorityFilter = ko.observable('');

        self.queueFilters = ko.observableArray(["None", "CAS", "CMPreCacheWorkflow", "CMPreCacheWorkflow_test",
                "InfraSandbox01", "InfraSandbox02", "intune_ctip1", "intune_ctip1_test",
                "intune_dev_infra", "intune_dev_office", "intune_dev_office_test",
                "intune_dev_test", "intune_dev_wcs", "intune_dev_wcs_test",
                "intune_rel", "intune_rel_prod", "intune_rel_prod_live", "intune_rel_prod_live_test",
                "intune_rel_prod_test", "intune_rel_test", "intune_tools_vnext", "IntuneTools",
                "JupiterSnapILDC1", "JupiterSnapMobileTest", "JupiterSnapMobileTest2",
                "JupiterSnapVM3", "JupiterSnapVM5", "JupiterSnapVM7",
                "Sandbox3", "Sandbox4", "Sandbox5",
                "SCCM_Office", "SccmMain", "SccmTest", "SCCM-WEH2-CVP"]);
        self.queueFilter = ko.observable('');

        self.statusFilters = ko.observableArray(["None", "In Progress", "Cancelled", "Aborted"]);
        self.statusFilter = ko.observable('');

        self.filteredItems = ko.computed(function () {
            var jobIdFilter = self.jobIdFilter();
            var checkinIdFilter = self.checkinIdFilter();
            var devFilter = self.devFilter();
            var priorityFilter = self.priorityFilter();
            var queueFilter = self.queueFilter();
            var statusFilter = self.statusFilter();
            var jBool;
            var cBool;
            var dBool;
            var qBool;
            var sBool;
            var pBool;

          return ko.utils.arrayFilter(self.allJobs(), function (i) {
              if (!jobIdFilter || jobIdFilter == "") {
                  jBool = true;
              }
              else {
                  jBool = i.Jobid == jobIdFilter;

              }

              if (!checkinIdFilter || checkinIdFilter == "") {
                  cBool = true;
              }
              else {
                  cBool = i.Checkid == checkinIdFilter;

              }
              if (!devFilter || devFilter == "") {
                  dBool = true;
              }
              else {
                  dBool = i.Dev == devFilter;

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
                    sBool = i.Status == statusFilter;
            
                }
                if (!priorityFilter || priorityFilter == "None") {
                    pBool = true;
                }
                else {
                    pBool = i.Priority == priorityFilter;

                }
                return  jBool && cBool && dBool && pBool && qBool && sBool;

            });
        });


        // filtering stuff


        if (self.allJobs().length > 0) {
            logger.log('Array already has data');
            return true;
        }

        return myJobsService
            .getAllJobs(self.allJobs)
            .then(function () {
                logger.log('Data loaded from server');
            });
    }
    


});