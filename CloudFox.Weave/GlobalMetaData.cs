using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace CloudFox.Weave
{
    public class GlobalMetaData
    {
        [JsonProperty("syncID")]
        public string SyncId { get; set; }

        [JsonProperty("storageVersion")]
        public int StorageVersion { get; set; }  
    }
}
