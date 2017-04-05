using BinaryWebSocket.Message;
using System;

namespace BinaryWebSocket.Types
{
    public class Bolean : IConvertBase
    {
        public string Name { get; } = "bolean";

        public bool IsDefaultType(Type type)
        {
            return type.Equals(typeof(bool)) || type.Equals(typeof(Bolean));
        }

        public object Read(MessageReader msg)
        {
            return msg.ReadByte() == 255;
        }

        public void Write(MessageWriter msg, object value)
        {
            msg.WriteByte((byte)((bool)value ? 255 : 0));
        }
    }
}