using BinaryWebSocket.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryWebSocket.Storage
{
    public class ConvertStorage
    {
        public int ConvertId { get; private set; }
        public IConvertBase Converter { get; set; }

        private static int _idCount = 1;

        public ConvertStorage()
        {
            ConvertId = _idCount++;
        }

    }
}