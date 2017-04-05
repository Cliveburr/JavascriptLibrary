using BinaryWebSocket.Message;
using BinaryWebSocket.Message.Response;
using BinaryWebSocket.Storage;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace BinaryWebSocket
{
    public class Middleware
    {
        private readonly RequestDelegate _next;

        public Middleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.WebSockets.IsWebSocketRequest)
            {
                var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                await Connection(context, webSocket);
            }
            else
            {
                await _next.Invoke(context);
            }
        }

        private async Task Connection(HttpContext context, WebSocket webSocket)
        {
            var bwsContext = new Context
            {
                WebSocket = webSocket
            };
            while (webSocket.State == WebSocketState.Open)
            {
                var bytes = await ReadMessage(webSocket);
                ProcessMsg(bwsContext, new MessageReader(bytes));
            }
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
        }

        private async Task<byte[]> ReadMessage(WebSocket webSocket)
        {
            using (var mem = new MemoryStream())
            {
                var buffer = new byte[1024];
                WebSocketReceiveResult result;
                do
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    if (result.MessageType == WebSocketMessageType.Binary)
                    {
                        mem.Write(buffer, 0, result.Count);
                    }
                } while (!result.CloseStatus.HasValue && !result.EndOfMessage);
                return mem.ToArray();
            }
        }

        private void ProcessMsg(Context context, MessageReader msg)
        {
            context.ChannelId = msg.ReadUInt16();
            context.MethodId = msg.ReadUInt16();
            context.Msg = msg;
            if (Manager.Channels.ContainsKey(context.ChannelId))
            {
                context.ChannelStore = Manager.Channels[context.ChannelId];
                CallMethod(context);
            }
            else
            {
                //TODO: tratar
            }
        }

        private void CallMethod(Context context)
        {
            if (!context.ChannelStore.Methods.ContainsKey(context.MethodId))
            {
                //TODO: tratar
                return;
            }

            var methodInfo = context.ChannelStore.Methods[context.MethodId];
            var parms = new List<object>();
            foreach (var param in methodInfo.Params)
            {
                parms.Add(param.Read(context.Msg));
            }

            var data = new ThreadLocal<Context>();
            data.Value = context;

            var channel = context.ChannelStore.GetChannelInstance();

            if (methodInfo.Return == null)
            {
                try
                {
                    methodInfo.Method.Invoke(channel, parms.ToArray());
                }
                catch (Exception err)
                {
                    //TODO: tratar
                }
            }
            else
            {
                try
                {
                    var ret = methodInfo.Method.Invoke(channel, parms.ToArray());
                    var write = new MessageWriter();
                    write.WriteUInt16(context.ChannelId);
                    write.WriteUInt16(context.MethodId);
                    methodInfo.Return.Write(write, ret);
                    context.WebSocket.SendMessage(write.GetBytes());
                }
                catch (Exception err)
                {
                    //TODO: tratar
                }
            }
        }
    }
}