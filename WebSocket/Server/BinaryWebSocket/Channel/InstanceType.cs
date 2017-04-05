using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryWebSocket.Channel
{
    public enum InstanceType
    {
        Singleton = 0,
        PerConnection = 1,
        PerCall = 2
    }
}