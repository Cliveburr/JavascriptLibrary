using System.Collections.Generic;

namespace BinaryWebSocket.Channel.Response
{
    [BWSSerializable]
    public class ConfigurationChannelInfoResponse
    {
        public ushort InfoChannelId { get; set; }
        public List<ConfigurationChannelInfoMethodResponse> Methods { get; set; }
    }
}