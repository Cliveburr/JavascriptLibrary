using BinaryWebSocket.Channel.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryWebSocket.Channel
{
    [BWSChannel(FixedId = 0, InstanceType = InstanceType.Singleton)]
    public class ConfigurationChannel : ChannelBase
    {
        [BWSRequest(FixedId = 0)]
        public ConfigurationInfoResponse RequestChannelInfo()
        {
            var configuration = new ConfigurationInfoResponse
            {
                Channels = Manager.Channels.ToDictionary(c => c.Key, c => c.Value.Name),
                Converts = Manager.Converts.ToDictionary(c => c.Key, c => c.Value.Converter.Name)
            };
            return configuration;
        }

        [BWSRequest(FixedId = 1)]
        public ConfigurationChannelInfoResponse RequestChannelInfo(ushort channelId)
        {
            var channel = Manager.Channels
                .Values
                .Where(c => c.ChannelId == channelId)
                .FirstOrDefault();

            if (channel == null)
            {
                //TODO: tratar
                return null;
            }

            return channel.Info;
        }
    }
}