using BinaryWebSocket.Message;
using System;

namespace BinaryWebSocket.Types
{
    public interface IConvertBase
    {
        string Name { get; }
        object Read(MessageReader msg);
        void Write(MessageWriter msg, object value);
        bool IsDefaultType(Type type);
    }
}