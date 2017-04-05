using BinaryWebSocket.Channel;
using BinaryWebSocket.Channel.Response;
using BinaryWebSocket.Message.Response;
using BinaryWebSocket.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace BinaryWebSocket.Storage
{
    public class ChannelStorage
    {
        public ushort ChannelId { get; private set; }
        public Type Channel { get; set; }
        public ChannelBase ChannelSingleton { get; set; }

        private static ushort _idCount = 1;
        private IDictionary<ushort, ChannelMethodInvoke> _methods;
        private ConfigurationChannelInfoResponse _info;
        private BWSChannelAttribute _channelAttribute;
        private string _name;

        public ChannelStorage()
        {
            ChannelId = _idCount++;
        }

        public IDictionary<ushort, ChannelMethodInvoke> Methods
        {
            get
            {
                if (_methods == null)
                    GenerateChannelInfo();
                return _methods;
            }
        }

        public ConfigurationChannelInfoResponse Info
        {
            get
            {
                if (_info == null)
                    GenerateChannelInfo();
                return _info;
            }
        }

        public BWSChannelAttribute ChannelAttribute
        {
            get
            {
                if (_channelAttribute == null)
                {
                    _channelAttribute = Channel.GetTypeInfo().GetCustomAttribute<BWSChannelAttribute>() ?? new BWSChannelAttribute();
                }
                return _channelAttribute;
            }
        }

        public string Name
        {
            get
            {
                if (_name == null)
                {
                    _name = ChannelAttribute.Name == null ?
                        Channel.Name :
                        ChannelAttribute.Name;
                }
                return _name;
            }
        }

        private void GenerateChannelInfo()
        {
            _info = new ConfigurationChannelInfoResponse
            {
                InfoChannelId = ChannelId,
                Methods = new List<ConfigurationChannelInfoMethodResponse>()
            };
            _methods = new Dictionary<ushort, ChannelMethodInvoke>();

            var id = (ushort)1;
            foreach (var method in Channel.GetType().GetMethods())
            {
                var reqAttrb = method.GetCustomAttribute<BWSRequestAttribute>();
                var sendAttrb = method.GetCustomAttribute<BWSSendAttribute>();

                if (reqAttrb == null && sendAttrb == null)
                    continue;

                if (reqAttrb != null && sendAttrb != null)
                    throw new Exception("Methods can only be request or send type!");

                if (reqAttrb != null)
                {
                    var rtrn = GetTransform(method.ReturnType, reqAttrb.Return);
                    var prms = GetTransformParams(method.GetParameters(), reqAttrb.Params);
                    _info.Methods.Add(new ConfigurationChannelInfoMethodResponse
                    {
                        MethodId = id,
                        Name = method.Name,
                        ReturnId = rtrn == null ? (ushort)0 : rtrn.ConvertId,
                        ParamsId = prms.Select(p => p.ConvertId).ToArray(),
                        IsRequest = true
                    });
                    _methods.Add(id, new ChannelMethodInvoke
                    {
                        Method = method,
                        Return = rtrn?.Converter,
                        Params = prms.Select(p => p.Converter).ToArray()
                    });
                }
                else
                {
                    var rtrn = GetTransform(method.ReturnType, sendAttrb.Return);
                    var prms = GetTransformParams(method.GetParameters(), sendAttrb.Params);
                    _info.Methods.Add(new ConfigurationChannelInfoMethodResponse
                    {
                        MethodId = id,
                        Name = method.Name,
                        ReturnId = rtrn == null ? (ushort)0 : rtrn.ConvertId,
                        ParamsId = prms.Select(p => p.ConvertId).ToArray(),
                        IsRequest = false
                    });
                    _methods.Add(id, new ChannelMethodInvoke
                    {
                        Method = method,
                        Return = rtrn?.Converter,
                        Params = prms.Select(p => p.Converter).ToArray()
                    });
                }

                id++;
            }
        }

        private ConvertStorage[] GetTransformParams(ParameterInfo[] originTypes, Type[] attrTypes)
        {
            var tr = new List<ConvertStorage>();
            for (var i = 0; i < originTypes.Length; i++)
            {
                tr.Add(GetTransform(originTypes[i].ParameterType, i > attrTypes.Length ? null : attrTypes[i]));
            }
            return tr.ToArray();
        }

        private ConvertStorage GetTransform(Type originType, Type attrType)
        {
            if (originType == null && attrType == null)
                return null;

            if (attrType != null)
            {
                if (!attrType.GetInterfaces().Contains(typeof(IConvertBase)))
                {
                    throw new Exception("Invalid type!");   //TODO: improve
                }

                var has = Manager.Converts
                    .Values
                    .Where(t => t.Converter.GetType() == attrType)
                    .FirstOrDefault();

                if (has == null)
                {
                    throw new Exception("Type not registred!");   //TODO: improve
                }

                return has;
            }
            else
            {
                var has = Manager.Converts
                    .Values
                    .Where(t => t.Converter.IsDefaultType(originType))
                    .FirstOrDefault();

                if (has == null)
                {
                    throw new Exception("Type not registred!");
                }

                return has;
            }
        }

        public ChannelBase GetChannelInstance()
        {
            switch (ChannelAttribute.InstanceType)
            {
                case InstanceType.Singleton:
                    {
                        if (ChannelSingleton == null)
                        {
                            ChannelSingleton = Activator.CreateInstance(Channel) as ChannelBase;
                        }
                        return ChannelSingleton;
                    }
                default:
                    throw new Exception("Invalid InstanceType");
            }
        }

    }
}