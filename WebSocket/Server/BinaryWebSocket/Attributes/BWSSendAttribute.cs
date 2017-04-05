using System;

namespace BinaryWebSocket
{
    [AttributeUsage(AttributeTargets.Method)]
    public class BWSSendAttribute : Attribute
    {
        public ushort FixedId { get; set; }
        public Type Return { get; set; }
        public Type[] Params { get; set; }
    }
}