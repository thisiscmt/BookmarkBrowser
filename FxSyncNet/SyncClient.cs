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
        #region Private members

        private bool _isSignedIn;

        private SyncKeys _collectionKeys;

        private StorageClient _storageClient;

        #endregion

        #region Constructors

        public SyncClient()
        {
        }

        #endregion

        #region Public methods

        public LoginResponse Login(string email, string password)
        {
            CloseSyncAccount();

            Credentials credentials = new Credentials(email, password);
            AccountClient account = new AccountClient();

            return account.Login(credentials, true).Result;
        }

        public void VerifyLogin(string uid, string verificationCode)
        {
            AccountClient account = new AccountClient();
            account.Verify(uid, verificationCode);
        }

        public void OpenSyncAccount(string email, string password, string keyFetchToken, string sessionToken)
        {
            AccountClient account = new AccountClient();
            Credentials credentials = new Credentials(email, password);
            KeysResponse keysResponse = account.Keys(keyFetchToken).Result;

            string key = BinaryHelper.ToHexString(Credentials.DeriveHawkCredentials(keyFetchToken, "keyFetchToken"));

            byte[] wrapKB = Credentials.UnbundleKeyFetchResponse(key, keysResponse.Bundle);

            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(2048);

            TimeSpan duration = new TimeSpan(0, 1, 0, 0);

            CertificateSignResponse certificate = account.CertificateSign(sessionToken, rsa, duration).Result;

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

            _storageClient = new StorageClient(tokenResponse.ApiEndpoint, tokenResponse.Key, tokenResponse.Id);

            BasicStorageObject cryptoKeys = _storageClient.GetStorageObject("crypto/keys").Result;

            SyncKeys syncKeys = Crypto.DeriveKeys(kB);
            _collectionKeys = Crypto.DecryptCollectionKeys(syncKeys, cryptoKeys);

            _isSignedIn = true;
        }

        public void CloseSyncAccount()
        {
            _isSignedIn = false;
            _collectionKeys = null;
            _storageClient = null;
        }

        public IEnumerable<Bookmark> GetBookmarks()
        {
            if (!_isSignedIn)
                throw new InvalidOperationException("Please sign in first");

            if (_storageClient == null || _collectionKeys == null)
                throw new InvalidOperationException("Please make sure you are correctly logged in to the Sync service");

            IEnumerable<BasicStorageObject> collection = _storageClient.GetCollection("bookmarks", true).Result;
            return Crypto.DecryptWbos<Bookmark>(_collectionKeys, collection);
        }

        public async Task<IEnumerable<Client>> GetTabs()
        {
            if (!_isSignedIn)
                throw new InvalidOperationException("Please sign in first.");

            if (_storageClient == null || _collectionKeys == null)
                throw new InvalidOperationException("Please make sure you are correctly logged in to the sync service.");

            IEnumerable<BasicStorageObject> collection = await _storageClient.GetCollection("tabs", true);
            return Crypto.DecryptWbos<Client>(_collectionKeys, collection);
        }

        public async Task<IEnumerable<HistoryRecord>> GetHistory()
        {
            if (!_isSignedIn)
                throw new InvalidOperationException("Please sign in first.");

            if (_storageClient == null || _collectionKeys == null)
                throw new InvalidOperationException("Please make sure you are correctly logged in to the sync service.");

            IEnumerable<BasicStorageObject> collection = await _storageClient.GetCollection("history", true);
            return Crypto.DecryptWbos<HistoryRecord>(_collectionKeys, collection);
        }

        #endregion

        #region Properties

        public bool IsSignedIn { get { return _isSignedIn; } }

        #endregion
    }
}
