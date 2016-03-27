using FxSyncNet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FxSyncNet.Security;
using FxSyncNet.Util;

namespace FxSyncNet
{
    public class SyncClient
    {
        private bool isSignedIn;

        private SyncKeys collectionKeys;

        private StorageClient storageClient;

        public SyncClient()
        {
        }

        public bool IsSignedIn { get { return isSignedIn; } }

        public void SignIn(string email, string password)
        {
            SignOut();

            Credentials credentials = new Credentials(email, password);

            AccountClient account = new AccountClient();
            LoginResponse response = account.Login(credentials, true).Result;

            KeysResponse keysResponse = account.Keys(response.KeyFetchToken).Result;

            string key = BinaryHelper.ToHexString(Credentials.DeriveHawkCredentials(response.KeyFetchToken, "keyFetchToken"));

            byte[] wrapKB = Credentials.UnbundleKeyFetchResponse(key, keysResponse.Bundle);

            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(2048);

            TimeSpan duration = new TimeSpan(0, 1, 0, 0);

            CertificateSignResponse certificate = account.CertificateSign(response.SessionToken, rsa, duration).Result;

            string jwtToken = JwtCryptoHelper.GetJwtToken(rsa);
            string assertion = JwtCryptoHelper.Bundle(jwtToken, certificate.Certificate);

            byte[] kB = BinaryHelper.Xor(wrapKB, credentials.UnwrapBKey);

            string syncClientState;
            using (SHA256 sha256 = new SHA256())
            {
                byte[] hash = sha256.ComputeHash(kB);
                syncClientState = BinaryHelper.ToHexString(hash.Take(16).ToArray());
            }

            TokenClient tokenClient = new TokenClient();
            TokenResponse tokenResponse = tokenClient.GetSyncToken(assertion, syncClientState);

            storageClient = new StorageClient(tokenResponse.ApiEndpoint, tokenResponse.Key, tokenResponse.Id);

            BasicStorageObject cryptoKeys = storageClient.GetStorageObject("crypto/keys").Result;

            SyncKeys syncKeys = Crypto.DeriveKeys(kB);
            collectionKeys = Crypto.DecryptCollectionKeys(syncKeys, cryptoKeys);

            isSignedIn = true;
        }

        public void SignOut()
        {
            isSignedIn = false;
            collectionKeys = null;
            storageClient = null;
        }

        public IEnumerable<Bookmark> GetBookmarks()
        {
            if (!isSignedIn)
                throw new InvalidOperationException("Please sign in first");

            if (storageClient == null || collectionKeys == null)
                throw new InvalidOperationException("Please make sure you are correctly logged in to the Sync service");

            IEnumerable<BasicStorageObject> collection = storageClient.GetCollection("bookmarks", true).Result;
            return Crypto.DecryptWbos<Bookmark>(collectionKeys, collection);
        }

        public async Task<IEnumerable<Client>> GetTabs()
        {
            if (!isSignedIn)
                throw new InvalidOperationException("Please sign in first.");

            if (storageClient == null || collectionKeys == null)
                throw new InvalidOperationException("Please make sure you are correctly logged in to the sync service.");

            IEnumerable<BasicStorageObject> collection = await storageClient.GetCollection("tabs", true);
            return Crypto.DecryptWbos<Client>(collectionKeys, collection);
        }

        public async Task<IEnumerable<HistoryRecord>> GetHistory()
        {
            if (!isSignedIn)
                throw new InvalidOperationException("Please sign in first.");

            if (storageClient == null || collectionKeys == null)
                throw new InvalidOperationException("Please make sure you are correctly logged in to the sync service.");

            IEnumerable<BasicStorageObject> collection = await storageClient.GetCollection("history", true);
            return Crypto.DecryptWbos<HistoryRecord>(collectionKeys, collection);
        }
    }
}
