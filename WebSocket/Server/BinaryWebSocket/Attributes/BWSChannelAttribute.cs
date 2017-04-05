using BinaryWebSocket.Channel;
using System;

namespace BinaryWebSocket
{
    public class BWSChannelAttribute : Attribute
    {
        public ushort FixedId { get; set; }
        public string Name { get; set; }
        public InstanceType InstanceType { get; set; }
    }
}