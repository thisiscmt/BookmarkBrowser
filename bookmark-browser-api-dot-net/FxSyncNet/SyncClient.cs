using FxSyncNet.Models;
using FxSyncNet.Security;
using FxSyncNet.Util;
using Newtonsoft.Json.Linq;

namespace FxSyncNet
{
    public class SyncClient
    {
        #region Private members

        private bool _isSignedIn;

        private SyncKeys? _collectionKeys;

        private StorageClient? _storageClient;

        #endregion

        #region Constructors

        public SyncClient()
        {
        }

        #endregion

        #region Public methods

        public LoginResponse Login(string email, string password, string reason)
        {
            CloseSyncAccount();

            Credentials credentials = new Credentials(email, password, reason);
            AccountClient accountClient = new AccountClient();

            var loginResponse = accountClient.Login(credentials, true);
            return loginResponse.Result;
        }

        public void Verify(string userId, string verificationCode)
        {
            AccountClient accountClient = new AccountClient();
            accountClient.Verify(userId, verificationCode);
        }

        public void OpenSyncAccount(string email, string password, string keyFetchToken, string sessionToken)
        {
            AccountClient accountClient = new AccountClient();
            Credentials credentials = new Credentials(email, password);
            KeysResponse keysResponse = accountClient.Keys(keyFetchToken).Result;

            string key = BinaryHelper.ToHexString(Credentials.DeriveHawkCredentials(keyFetchToken, "keyFetchToken"));

            byte[] wrapKB = Credentials.UnbundleKeyFetchResponse(key, keysResponse.Bundle);

            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(2048);

            TimeSpan duration = new TimeSpan(0, 1, 0, 0);

            CertificateSignResponse certificate = accountClient.CertificateSign(sessionToken, rsa, duration).Result;

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
            {
                throw new InvalidOperationException("Please sign in first.");
            }

            if (_storageClient == null || _collectionKeys == null)
            {
                throw new InvalidOperationException("Please make sure you are correctly logged in to the Sync service");
            }

            IEnumerable<BasicStorageObject> collection = _storageClient.GetCollection("bookmarks", true).Result;
            return Crypto.DecryptWbos<Bookmark>(_collectionKeys, collection);
        }

        public void AddBookmark(JObject data)
        {
            if (!_isSignedIn)
            {
                throw new InvalidOperationException("Please sign in first.");
            }

            if (_storageClient == null || _collectionKeys == null)
            {
                throw new InvalidOperationException("Please make sure you are correctly logged in to the Sync service");
            }

            var bookmark = JObject.Parse(data.ToString());

//            dynamic payload = new JObject();
//            payload.type = "bookmark";
//            payload.id = bookmark.Id;
//            payload.title = bookmark.Title;
//            payload.bmkUri = bookmark.Uri;
////            payload.description = null;
////            payload.loadInSidebar = false;
////            payload.tags = null;
////            payload.keyword = null;
//            payload.parentId = bookmark.ParentId;
//            payload.parentName = bookmark.ParentName;

            var bookmarkStorageObject = new BasicStorageObject();
            bookmarkStorageObject.Id = GetBsoId(bookmark["uri"].ToString());
            bookmarkStorageObject.Payload = data.ToString();

            _storageClient.WriteStorageObject("bookmark", bookmarkStorageObject);
        }

        #endregion

        private string GetBsoId(string seed)
        {
            var encodedUrl = Base64UrlEncode(seed);

            if (encodedUrl.Length < 12)
            {
                encodedUrl = encodedUrl.PadRight(12, '-');
            }

            return encodedUrl.Substring(encodedUrl.Length - 12);
        }

        private string Base64UrlEncode(string input)
        {
            var inputBytes = System.Text.Encoding.UTF8.GetBytes(input);

            // Special "url-safe" base64 encode.
            return Convert.ToBase64String(inputBytes)
              .Replace('+', '-') // replace URL unsafe characters with safe ones
              .Replace('/', '_') // replace URL unsafe characters with safe ones
              .Replace("=", ""); // no padding
        }

        #region Properties

        public bool IsSignedIn { get { return _isSignedIn; } }

        #endregion
    }
}
