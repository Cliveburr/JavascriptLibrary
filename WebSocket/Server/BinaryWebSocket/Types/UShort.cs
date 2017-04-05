using BinaryWebSocket.Message;
using System;

namespace BinaryWebSocket.Types
{
    public class UShort : IConvertBase
    {
        public string Name { get; } = "ushort";

        public bool IsDefaultType(Type type)
        {
            return type.Equals(typeof(ushort)) || type.Equals(typeof(UShort));
        }

        public object Read(MessageReader msg)
        {
            return msg.ReadUInt16();
        }

        public void Write(MessageWriter msg, object value)
        {
            msg.WriteUInt16((ushort)value);
        }
    }
}