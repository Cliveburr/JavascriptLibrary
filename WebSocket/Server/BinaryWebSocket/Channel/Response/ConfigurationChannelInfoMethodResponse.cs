namespace BinaryWebSocket.Channel.Response
{
    [BWSSerializable]
    public class ConfigurationChannelInfoMethodResponse
    {
        public ushort MethodId { get; set; }
        public ushort ReturnId { get; set; }
        public ushort[] ParamsId { get; set; }
        public bool IsRequest { get; set; }
        public string Name { get; set; }
    }
}