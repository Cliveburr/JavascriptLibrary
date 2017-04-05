using BinaryWebSocket.Channel;
using BinaryWebSocket.Storage;
using BinaryWebSocket.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryWebSocket
{
    public static class Manager
    {
        public static IDictionary<ushort, ChannelStorage> Channels { get; private set; }
        public static IDictionary<ushort, ConvertStorage> Converts { get; private set; }

        static Manager()
        {
            Channels = new Dictionary<ushort, ChannelStorage>();

            var defaultTypes = new List<IConvertBase>
            {
                new UShort(),
                new String8(),
                new Bolean()
            };
            var storageTypes = defaultTypes.Select(t => new ConvertStorage { Converter = t });
            Converts = storageTypes.ToDictionary(t => t.ConvertId, t => t);
        }

        public static void SetChannels(params Type[] channels)
        {
            var storageChannles = channels.Select(c => new ChannelStorage { Channel = c });
            storageChannles.ToList().ForEach(s => Channels.Add(s.ChannelId, s));
        }

        public static void SetConverts(params Type[] converts)
        {
            var storageTypes = converts.Select(t => new ConvertStorage { Converter = (IConvertBase)Activator.CreateInstance(t) });
            Converts = storageTypes.ToDictionary(t => t.ConvertId, t => t);
        }
    }
}