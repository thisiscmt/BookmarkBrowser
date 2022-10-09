using FxSyncNet.Models;
using FxSyncNet.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FxSyncNet
{
    public class StorageClient : ProxyBase
    {
        private readonly HawkNet.HawkCredential credential;

        public StorageClient(string apiEndpoint, string key, string id) : base (apiEndpoint + "/")
        {
            credential = new HawkNet.HawkCredential() { Algorithm = "sha256", Id = id, Key = BinaryHelper.ToHexString(Encoding.UTF8.GetBytes(key)) };
        }

        public void GetQuotaInfo()
        {
            Get("info/quota", credential);
        }

        public void GetCollectionInfo()
        {
            Get("info/collections", credential);
        }

        public void GetCollectionUsage()
        {
            Get("info/collection_usage", credential);
        }

        public void GetCollectionCounts()
        {
            Get("info/collection_counts", credential);
        }

        public Task<IEnumerable<BasicStorageObject>> GetCollection(string collection, bool full)
        {
            return Get<IEnumerable<BasicStorageObject>>("storage/" + collection + ((full) ? "?full" : ""), credential);
        }

        public Task<BasicStorageObject> GetStorageObject(string storageObject)
        {
            return Get<BasicStorageObject>("storage/" + storageObject, credential);
        }

        public Task WriteStorageObject(string collection, BasicStorageObject storageObject)
        {
            return Put("storage/" + collection + "/" + storageObject.Id, storageObject, credential);
        }
    }
}
