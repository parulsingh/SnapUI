using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SnapUI.Common.Models;
using SnapUI.Services.Contracts;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Xml;
using System.Xml.XPath;

namespace SnapUI.Services
{
    public class GetQueueService : IGetQueueService
    {
        public GetQueueService()
        {            
        }
        public List<string> GetQueues()
        {
            var queueList = new List<string>();

            XmlTextReader reader = new XmlTextReader(@"C:\Users\t-serhe\Desktop\queues.xml");
            
            while (reader.Read())
            {                
                if (reader.IsStartElement())
                {               
                    switch (reader.Name)
                    {
                        case "QUEUE_LIST":                                             
                        case "QUEUE":
                            if (reader.Read())
                            {
                                queueList.Add(reader.Value);
                            }                        
                            break;
                    }
                }
            }            
            return queueList;
        }
    }
}