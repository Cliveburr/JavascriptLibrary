using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryWebSocket.Message
{
    public class MessageWriter
    {
        private MemoryStream _mem;
        private int _offset;

        public MessageWriter()
        {
            _mem = new MemoryStream();
            _offset = 0;
        }

        public void WriteBits(Helpers.BitByte bits)
        {
            Write(new byte[] { bits.Byte });
        }

        public void WriteUInt16(ushort value)
        {
            var bs = BitConverter.GetBytes(value);
            Write(bs);
        }

        public void WriteString8(string value)
        {
            Write(new byte[] { (byte)value.Length });

            if (value.Length > byte.MaxValue)
                throw new OverflowException();

            var bs = Encoding.UTF8.GetBytes(value);
            Write(bs);
        }

        public void WriteByte(byte value)
        {
            Write(new byte[] { value });
        }

        public byte[] GetBytes()
        {
            return _mem.ToArray();
        }

        private void Write(byte[] bytes)
        {
            var len = bytes.Length;
            _mem.Write(bytes, 0, len);
            _offset += len;
        }
    }
}