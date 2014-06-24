using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SnapUI.Common.Models;

namespace SnapUI.Services.Contracts
{
    //contains interfaces 
    public interface ILogFileService
    {
        Log GetLog(int submitId);

       
    }
}
