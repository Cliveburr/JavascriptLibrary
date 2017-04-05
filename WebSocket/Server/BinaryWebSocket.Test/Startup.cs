using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BinaryWebSocket.Test
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            Manager.SetChannels(typeof(Channels.BasicChannel));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
            }

            app.UseWebSockets();

            app.UseBinaryWebSocket();
        }
    }
}
