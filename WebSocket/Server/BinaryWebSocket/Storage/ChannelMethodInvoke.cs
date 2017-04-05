using BinaryWebSocket.Types;
using System.Reflection;

namespace BinaryWebSocket.Storage
{
    public class ChannelMethodInvoke
    {
        public MethodInfo Method { get; set; }
        public IConvertBase Return { get; set; }
        public IConvertBase[] Params { get; set; }
    }
}