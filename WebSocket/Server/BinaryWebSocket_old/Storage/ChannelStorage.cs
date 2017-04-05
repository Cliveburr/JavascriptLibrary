using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryWebSocket.Storage
{
    public class ChannelStorage
    {
        public int ChannelId { get; private set; }
        public Channel Channel { get; set; }

        private static int _idCount = 1;

        public ChannelStorage()
        {
            ChannelId = _idCount++;
        }
    }
}