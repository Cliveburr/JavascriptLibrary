using BinaryWebSocket.Message;
using BinaryWebSocket.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace BinaryWebSocket.Channel
{
    public abstract class ChannelBase
    {
        public Context Context
        {
            get
            {
                return new ThreadLocal<Context>().Value;
            }
        }

        public void SendMessage(MessageBase message)
        {
            var webSocket = Context.WebSocket;
            if (webSocket.State == WebSocketState.Open)
            {
                var buffer = message.GetBytes();
                webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Binary, true, CancellationToken.None);
            }
        }
    }
}