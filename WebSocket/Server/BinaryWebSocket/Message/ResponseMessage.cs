using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryWebSocket.Message
{
    public abstract class MessageBase
    {
        public int ChannelId { get; set; }
        public int MethodId { get; set; }

        public MessageBase(int channelId, int methodId)
        {
            ChannelId = channelId;
            MethodId = methodId;
        }

        public abstract void GetContent(MessageWriter msg);

        public byte[] GetBytes()
        {
            var msg = new MessageWriter();
            msg.WriteUInt16((ushort)ChannelId);
            msg.WriteUInt16((ushort)MethodId);
            GetContent(msg);
            return msg.GetBytes();
        }
    }
}