using BinaryWebSocket.Message;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace BinaryWebSocket.Storage
{
    public class Context
    {
        public WebSocket WebSocket { get; set; }
        public ushort ChannelId { get; set; }
        public ushort MethodId { get; set; }
        public MessageReader Msg { get; set; }
        public ChannelStorage ChannelStore { get; set; }
    }
}