using BinaryWebSocket.Message;
using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace BinaryWebSocket
{
    public static class Extension
    {
        public static IApplicationBuilder UseBinaryWebSocket(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<Middleware>();
        }

        public static void SendMessage(this WebSocket webSocket, byte[] message)
        {
            if (webSocket.State == WebSocketState.Open)
            {
                webSocket.SendAsync(new ArraySegment<byte>(message), WebSocketMessageType.Binary, true, CancellationToken.None);
            }
            else
            {
                //TODO: throw some error
            }
        }
    }
}