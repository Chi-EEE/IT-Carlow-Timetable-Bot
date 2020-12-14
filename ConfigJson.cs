using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

/// <summary>
/// Get config.json in bin\Debug\netcoreapp3.1
/// </summary>
namespace DiscordBot
{
    public struct ConfigJson
    {
        [JsonProperty("token")]
        public string Token { get; private set; }
        [JsonProperty("prefix")]
        public string Prefix { get; private set; }
        [JsonProperty("website")]
        public string Website { get; private set; }
        [JsonProperty("serverId")]
        public string ServerId { get; private set; }
        [JsonProperty("channelId")]
        public string ChannelId { get; private set; }
    }
}
