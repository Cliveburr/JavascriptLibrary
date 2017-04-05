using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryWebSocket.Helpers
{
    public class BitByte
    {
        public byte Byte { get; private set; }

        public BitByte(byte bt = 0)
        {
            Byte = bt;
        }

        public void Set(int index, bool value)
        {
            if (value)
                Byte |= (byte)(1 << index);
            else
                Byte &= (byte)(~(1 << index));
        }

        public void Togle(int index)
        {
            Byte ^= (byte)(1 << index);
        }

        public bool Get(int index)
        {
            return ((Byte >> index) & 1) > 0;
        }
    }
}