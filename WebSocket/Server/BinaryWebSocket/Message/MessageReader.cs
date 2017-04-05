using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryWebSocket.Message
{
    public class MessageReader
    {
        private byte[] _buffer;
        private int _offset;

        public MessageReader(byte[] buffer)
        {
            _buffer = buffer;
            _offset = 0;
        }

        public Helpers.BitByte ReadBits()
        {
            var tr = _buffer[_offset];
            _offset++;
            return new Helpers.BitByte(tr);
        }

        public ushort ReadUInt16()
        {
            var tr = BitConverter.ToUInt16(_buffer, _offset);
            _offset += 2;
            return tr;
        }

        public string ReadString8()
        {
            var len = _buffer[_offset];
            _offset += 1;
            var tr = Encoding.UTF8.GetString(_buffer, _offset, len);
            _offset += len;
            return tr;
        }

        public byte ReadByte()
        {
            return _buffer[_offset++];
        }
    }
}