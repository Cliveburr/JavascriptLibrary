using BinaryWebSocket.Message;
using System;

namespace BinaryWebSocket.Types
{
    public class String8 : IConvertBase
    {
        public string Name { get; } = "string8";

        public bool IsDefaultType(Type type)
        {
            return type.Equals(typeof(string)) || type.Equals(typeof(String));
        }

        public object Read(MessageReader msg)
        {
            return msg.ReadString8();
        }

        public void Write(MessageWriter msg, object value)
        {
            msg.WriteString8((string)value);
        }
    }
}