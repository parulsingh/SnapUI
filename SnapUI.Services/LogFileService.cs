using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SnapUI.Common.Models;
using SnapUI.Services.Contracts;

namespace SnapUI.Services
{
    public class LogFileService: ILogFileService
    {
        public Log GetLog(int submitId)
        {
            return new Log()
            {
                SubmitID = submitId,
                Dev = "parul",
                JobID = 1234
            };
        }

    }
}
