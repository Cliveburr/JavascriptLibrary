using System.Collections.Generic;

namespace BinaryWebSocket.Channel.Response
{
    [BWSSerializable]
    public class ConfigurationInfoResponse
    {
        public IDictionary<ushort, string> Channels { get; set; }
        public IDictionary<ushort, string> Converts { get; set; }
    }
}