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
        public static IDictionary<int, ChannelStorage> Channels { get; private set; }
        public static IDictionary<int, ConvertStorage> Converts { get; private set; }

        public static void Configure<C, V>(IEnumerable<C> channels, IEnumerable<V> customTypes = null) where C: Channel where V: IConvertBase
        {
            var types = new List<IConvertBase>
            {
                new UShort(),
                new String8(),
                new Bolean()
            };

            if (customTypes != null)
            {
                var instCustomTypes = customTypes.Select(c => Activator.CreateInstance(c.GetType()) as IConvertBase);
                types.AddRange(instCustomTypes);
            }

            var storageTypes = types.Select(t => new ConvertStorage { Converter = t });
            Converts = storageTypes.ToDictionary(t => t.ConvertId, t => t);

            var storageChannles = channels.Select(c => new ChannelStorage { Channel = c });
            Channels = storageChannles.ToDictionary(i => i.ChannelId, i => i);
        }

    }
}