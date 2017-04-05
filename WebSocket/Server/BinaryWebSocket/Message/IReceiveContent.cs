namespace BinaryWebSocket.Message
{
    public interface IReceiveContent
    {
        void WriteContent(MessageWriter msg);
    }
}