var data1 = [{ Jobid: 11111, Checkid: 1111, Dev: 'AABLE', Queue: "intune_dev", Submitdate: "2014-07-17T14:55:53.92", SubmitdateString: "7/17/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'AARON', Queue: "intune_dev", Submitdate: "2014-07-18T14:55:53.92", SubmitdateString: "7/18/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'BGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T13:55:53.92", SubmitdateString: "7/18/2014  1:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'AGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T17:55:53.92", SubmitdateString: "7/18/2014  5:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Zeus', Queue: "intune_dev", Submitdate: "2014-07-19T10:55:53.92", SubmitdateString: "7/19/2014  10:55 AM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Mathew', Queue: "intune_dev", Submitdate: "2014-07-18T16:55:53.92", SubmitdateString: "7/18/2014  4:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Kerwin', Queue: "intune_dev", Submitdate: "2014-07-18T20:55:53.92", SubmitdateString: "7/18/2014  8:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Bello', Queue: "intune_dev", Submitdate: "2014-07-18T13:53:53.92", SubmitdateString: "7/18/2014  1:53 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" }];

var failureData = [{ Jobid: 11111, Checkid: 1111, Dev: 'AABLE', Queue: "intune_dev", Submitdate: "2014-07-17T14:55:53.92", SubmitdateString: "7/17/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'AARON', Queue: "intune_dev", Submitdate: "2014-07-18T14:55:53.92", SubmitdateString: "7/18/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'BGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T13:55:53.92", SubmitdateString: "7/18/2014  1:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'AGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T17:55:53.92", SubmitdateString: "7/18/2014  5:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Zeus', Queue: "intune_dev", Submitdate: "2014-07-19T10:55:53.92", SubmitdateString: "7/19/2014  10:55 AM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Mathew', Queue: "intune_dev", Submitdate: "2014-07-18T16:55:53.92", SubmitdateString: "7/18/2014  4:55 PM", Status: ["Aborted", "BuildAndVerify"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Kerwin', Queue: "intune_dev", Submitdate: "2014-07-18T20:55:53.92", SubmitdateString: "7/18/2014  8:55 PM", Status: ["Aborted", "BuildAndVerify"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Bello', Queue: "intune_dev", Submitdate: "2014-07-18T13:53:53.92", SubmitdateString: "7/18/2014  1:53 PM", Status: ["Aborted", "BuildAndVerify"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'AABLE', Queue: "intune_dev", Submitdate: "2014-07-17T14:55:53.92", SubmitdateString: "7/17/2014  2:55 PM", Status: ["Aborted", "BuildAndVerify"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'AARON', Queue: "intune_dev", Submitdate: "2014-07-18T14:55:53.92", SubmitdateString: "7/18/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'BGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T13:55:53.92", SubmitdateString: "7/18/2014  1:55 PM", Status: ["Aborted", "RunUnitTests"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'AGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T17:55:53.92", SubmitdateString: "7/18/2014  5:55 PM", Status: ["Aborted", "RunUnitTests"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Zeus', Queue: "intune_dev", Submitdate: "2014-07-19T10:55:53.92", SubmitdateString: "7/19/2014  10:55 AM", Status: ["Aborted", "PerformProductInstall"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Mathew', Queue: "intune_dev", Submitdate: "2014-07-18T16:55:53.92", SubmitdateString: "7/18/2014  4:55 PM", Status: ["Aborted", "PerformProductInstall"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Kerwin', Queue: "intune_dev", Submitdate: "2014-07-18T20:55:53.92", SubmitdateString: "7/18/2014  8:55 PM", Status: ["Aborted", "SubmitChanges"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
{ Jobid: 11111, Checkid: 1111, Dev: 'Bello', Queue: "intune_dev", Submitdate: "2014-07-18T13:53:53.92", SubmitdateString: "7/18/2014  1:53 PM", Status: ["Aborted", "SubmitChanges"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" }];


QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});

//// This tests our sorting function against a simple input
QUnit.test("simple sorting test", function (assert) {
    var value = -1;
    value = -value;
    data1.sort(function (a, b) {
        if (a.Dev.toLowerCase() > b.Dev.toLowerCase()) return 1 * value;
        if (a.Dev.toLowerCase() < b.Dev.toLowerCase()) return -1 * value;
        return 0;
    });
    var sortedData = [{ Jobid: 11111, Checkid: 1111, Dev: 'AABLE', Queue: "intune_dev", Submitdate: "2014-07-17T14:55:53.92", SubmitdateString: "7/17/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'AARON', Queue: "intune_dev", Submitdate: "2014-07-18T14:55:53.92", SubmitdateString: "7/18/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'AGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T17:55:53.92", SubmitdateString: "7/18/2014  5:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Bello', Queue: "intune_dev", Submitdate: "2014-07-18T13:53:53.92", SubmitdateString: "7/18/2014  1:53 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'BGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T13:55:53.92", SubmitdateString: "7/18/2014  1:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Kerwin', Queue: "intune_dev", Submitdate: "2014-07-18T20:55:53.92", SubmitdateString: "7/18/2014  8:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Mathew', Queue: "intune_dev", Submitdate: "2014-07-18T16:55:53.92", SubmitdateString: "7/18/2014  4:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Zeus', Queue: "intune_dev", Submitdate: "2014-07-19T10:55:53.92", SubmitdateString: "7/19/2014  10:55 AM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" }
    ]

    assert.ok(JSON.stringify(data1) == JSON.stringify(sortedData), "Passed!")

});



//// This tests our sorting function against dates
QUnit.test("date sorting test", function (assert) {
    var value = -1;
    value = -value;

    data1.sort(function (a, b) {
        if (a.Submitdate > b.Submitdate) return 1 * value;
        if (a.Submitdate < b.Submitdate) return -1 * value;
        return 0;
    });

    var sortedData = [{ Jobid: 11111, Checkid: 1111, Dev: 'AABLE', Queue: "intune_dev", Submitdate: "2014-07-17T14:55:53.92", SubmitdateString: "7/17/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Bello', Queue: "intune_dev", Submitdate: "2014-07-18T13:53:53.92", SubmitdateString: "7/18/2014  1:53 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'BGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T13:55:53.92", SubmitdateString: "7/18/2014  1:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'AARON', Queue: "intune_dev", Submitdate: "2014-07-18T14:55:53.92", SubmitdateString: "7/18/2014  2:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Mathew', Queue: "intune_dev", Submitdate: "2014-07-18T16:55:53.92", SubmitdateString: "7/18/2014  4:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'AGeorge', Queue: "intune_dev", Submitdate: "2014-07-18T17:55:53.92", SubmitdateString: "7/18/2014  5:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Kerwin', Queue: "intune_dev", Submitdate: "2014-07-18T20:55:53.92", SubmitdateString: "7/18/2014  8:55 PM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" },
        { Jobid: 11111, Checkid: 1111, Dev: 'Zeus', Queue: "intune_dev", Submitdate: "2014-07-19T10:55:53.92", SubmitdateString: "7/19/2014  10:55 AM", Status: ["Aborted", "RunBVT"], StatusString: ["Aborted: RunBVTs"], Priority: "Normal", RunBVTfailure: false, PreBugId: ['1234', '534'], Description: "This is test Data" }
    ];
    assert.ok(JSON.stringify(data1) == JSON.stringify(sortedData), "Passed!")

});

//// This tests our top failures calculation
QUnit.test("top failures test", function (assert) {
    var firstFailure,
        secondFailure,
        thirdFailure;
    var failureDict = {};

    for (var i = 0; i < failureData.length; i++) {
        if (failureData[i].Status[0] == "Aborted") {
            var failure = failureData[i].Status[1];
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

    sortable.sort(function (a, b) { return b[1]-a[1] });
    firstFailure = sortable[0][0];
    secondFailure = sortable[1][0];
    thirdFailure = sortable[2][0];
    console.log('top falure: ' + firstFailure);
    console.log(sortable);
    assert.ok(firstFailure == "RunBVT", "Passed!")

});
