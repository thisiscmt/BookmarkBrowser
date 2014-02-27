using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using System.Security.Cryptography;
using CloudFox.Weave.Util;
using System.Text.RegularExpressions;

namespace CloudFox.Weave
{
    public class WeaveProxy
    {
        private const string DefaultUserServerUrl = "https://auth.services.mozilla.com/user";
        private const string ApiVersion = "1.1";

        private ICommunicationChannel communicationChannel;
        private string userServerUrl;
        private string userName;
        private byte[] passphraseData;
        private byte[] defaultAesKey;
        private byte[] defaultHmacKey;

        #region Constructors
        public WeaveProxy(ICommunicationChannel communicationChannel, string userName, string password, string passphrase)
            : this(communicationChannel, userName, password, passphrase, DefaultUserServerUrl)
        { 
        }

        public WeaveProxy(ICommunicationChannel communicationChannel, string userName, string password, string passphrase, 
                          string userServerUrl)
        {
            if(communicationChannel == null)
                throw new ArgumentNullException("communicationChannel");

            if (userName == null)
                throw new ArgumentException("Please provide a valid userName.", "userName");

            if (password == null)
                throw new ArgumentException("Please provide a valid password.", "password");

            if(string.IsNullOrEmpty(passphrase))
                throw new ArgumentException("Please provide a valid passphrase.", "passphrase");

            if (string.IsNullOrEmpty(userServerUrl))
                throw new ArgumentException("Please provide a valid user server url.", "userServerUrl");

            if (userName.Contains('@'))
                userName = EncodeEmailAddress(userName);

            if (passphrase.Length != 26 && Regex.IsMatch(passphrase, @"^(?i)[A-Z2-9]{1}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}$"))
                passphrase = passphrase.Replace("-", "");

            this.communicationChannel = communicationChannel;
            this.communicationChannel.Initialize(userName, password);

            this.userServerUrl = userServerUrl;
            this.userName = userName;
            this.passphraseData = Base32Convert.UserfriendlyBase32Decoding(passphrase);

            DetectWeaveNode();
            DownloadGlobalMetaData();

            if(ServerStorageVersion != 5)
                throw new UnsupportedServerStorageVersionException("Data on the server is in an old and unsupported format. Please update Firefox Sync on your computer.");

            DownloadCryptoKeys();
        }
        #endregion

        #region Methods
        public Dictionary<string, string> GetCollections()
        {
            string result = communicationChannel.Execute(GetWeaveNodeOperationAddress("info/collections"), RestOperation.Get);
            return JsonConvert.DeserializeObject<Dictionary<string, string>>(result);
        }

        public Dictionary<string, int> GetCollectionUsage()
        {
            string url = GetWeaveNodeOperationAddress("info/collection_usage");

            string result = communicationChannel.Execute(url, RestOperation.Get);
            return JsonConvert.DeserializeObject<Dictionary<string, int>>(result);
        }

        public Dictionary<string, int> GetCollectionCounts()
        {
            string url = GetWeaveNodeOperationAddress("info/collection_counts");

            string result = communicationChannel.Execute(url, RestOperation.Get);
            return JsonConvert.DeserializeObject<Dictionary<string, int>>(result);
        }

        public QuotaInformation GetQuota()
        {
            string result = communicationChannel.Execute(GetWeaveNodeOperationAddress("info/quota"),
                RestOperation.Get, "");
            string[] data = JsonConvert.DeserializeObject<string[]>(result);

            string quota = data[1] != "null" ? data[1] : null;
            string currentUssage = data[0];
            bool hasQuota = quota != null;

            return new QuotaInformation(hasQuota ? int.Parse(quota) : -1, hasQuota, int.Parse(currentUssage));
        }

        public IEnumerable<WeaveBasicObject> GetCollection(string collectionName)
        {
            return GetCollection(collectionName, -1, -1);
        }

        public IEnumerable<WeaveBasicObject> GetCollection(string collectionName, SortOrder sortOrder)
        {
            return GetCollection(collectionName, -1, -1, sortOrder);
        }

        public IEnumerable<WeaveBasicObject> GetCollection(string collectionName, int limit, int offset)
        {
            return GetCollection(collectionName, null, null, null, limit, offset, null);
        }

        public IEnumerable<WeaveBasicObject> GetCollection(string collectionName, int limit, int offset, SortOrder sortOrder)
        {
            return GetCollection(collectionName, null, null, null, limit, offset, sortOrder);
        }

        public IEnumerable<WeaveBasicObject> GetCollection(string collectionName, IEnumerable<string> ids, string indexAbove, 
            string indexBelow, int limit, int offset, SortOrder? sortOrder)
        {
            if (string.IsNullOrEmpty(collectionName))
                throw new ArgumentException("collectionName");

            string url = string.Format("{0}/1.1/{1}/storage/{2}?full=true", WeaveNode, userName, collectionName);

            if (ids != null && ids.Count() > 0)
                url += "&ids=" + string.Join(",", ids.ToArray());
            if (indexAbove != null)
                url += "&index_above=" + indexAbove;
            if (indexBelow != null)
                url += "&index_below=" + indexBelow;
            if (limit > -1)
                url += "&limit=" + limit;
            if(offset > -1)
                url += "&offset=" + offset;
            if (sortOrder.HasValue)
            {
                string value = GetSortOrderValue(sortOrder.Value);
                url += "&sort=" + value;
            }

            string result = communicationChannel.Execute(url, RestOperation.Get);
            if (result != string.Empty)
                return JsonConvert.DeserializeObject<IEnumerable<WeaveBasicObject>>(result);
            else
                return new WeaveBasicObject[0];
        }

        public WeaveBasicObject GetCryptoKeys()
        {
            string url = GetWeaveNodeOperationAddress("storage/crypto/keys");
            string result = communicationChannel.Execute(url, RestOperation.Get);

            return JsonConvert.DeserializeObject<WeaveBasicObject>(result); ;
        }

        public IEnumerable<T> DecryptPayload<T>(IEnumerable<WeaveBasicObject> enumerable) where T : class
        {
            foreach(WeaveBasicObject weaveBasicObject in enumerable)
            {
                yield return DecryptPayload<T>(weaveBasicObject);
            }
        }

        /// <summary>
        /// Decrypt the payload of a <see cref="WeaveBasicObject"/>. Before decrypting the HMACSHA256 hash
        /// is also calculated to verify that the data is valid.
        /// </summary>
        /// <typeparam name="T">The type of the payload object.</typeparam>
        /// <param name="weaveBasicObject">The <see cref="WeaveBasicObject"/> who's payload need to be decrypted.</param>
        /// <returns>The decrypted payload object of the given type.</returns>
        public T DecryptPayload<T>(WeaveBasicObject weaveBasicObject) where T : class
        {
            EncryptedDataObject encryptedDataObject = 
                JsonConvert.DeserializeObject<EncryptedDataObject>(weaveBasicObject.Payload);

            HMACSHA256 hmacSha256 = new HMACSHA256(defaultHmacKey);

            byte[] hmacCalculated = hmacSha256.ComputeHash(Encoding.UTF8.GetBytes(encryptedDataObject.CipherText));

            // Check the HMAC value to see if the data is authentic
            byte[] hmacReceived = encryptedDataObject.Hmac;

            if (!AreEqual(hmacCalculated, hmacReceived))
            {
                throw new DataVerificationException("The downloaded data is not authentic.");
            }

            return DecryptCipherText<T>(defaultAesKey, encryptedDataObject.InitialisationVector,
                encryptedDataObject.CipherText);
        }

        public string EncryptPayload(WeaveBasicObject weaveBasicObject)
        {
            // TODO: Complete implementation

            return "";

        //    EncryptedDataObject encryptedDataObject;

        //    string payload;


        //    encryptedDataObject = new EncryptedDataObject();
        //    encryptedDataObject.CipherText = EncryptPlainText(this.defaultAesKey, "");  // TODO
        //    encryptedDataObject.InitialisationVector = aes.IV;
        //    encryptedDataObject.Hmac = this.defaultHmacKey;

        //    return JsonConvert.SerializeObject(encryptedDataObject);
        }

        /// <summary>
        /// Adds a bookmark to the given Sync repository.
        /// </summary>
        /// <param name="url">URL of the site being bookmarked</param>
        /// <param name="dir">Directory where the bookmark should be added</param>
        /// <param name="title">Title of the site</param>
        public void AddBookmark(string url, string title, string dir)
        {
            Bookmark bm;
            WeaveBasicObject bmWBO;
            List<string> lstParentID;
            string bmJSON;

            lstParentID = new List<string>();
            lstParentID.Add(dir);
            var lstParent = DecryptPayload<Bookmark>(GetCollection("bookmarks", lstParentID, null, null, -1, -1, SortOrder.Index));

            if (lstParent == null || lstParent.Count() == 0)
            {
                throw new Exception("Could not find selected parent directory.");
            }

            bm = new Bookmark();
            bm.BookmarkType = BookmarkType.Bookmark;
            bm.Description = "";
            bm.ParentName = dir;
            bm.ParentId = lstParent.First().Id;
            bm.Title = title;
            bm.Uri = url;
            bmJSON = JsonConvert.SerializeObject(bm);

            bmWBO = new WeaveBasicObject();
            bmWBO.Id = GetNextBookmarkID();
            bmWBO.Modified = DateTime.Now;
            bmWBO.SortIndex = GetNextSortIndex(dir);
            bmWBO.Payload = bmJSON;

            // TODO
        }
        #endregion

        #region Private functions
        private T DecryptCipherText<T>(byte[] symetricKey, byte[] iv, string cipherString) where T : class
        {
            byte[] cipherData = Convert.FromBase64String(cipherString);

            using (AesManaged aes = new AesManaged())
            {
                ICryptoTransform decryptor = aes.CreateDecryptor(symetricKey, iv);
                byte[] plaintextData = decryptor.TransformFinalBlock(cipherData, 0, cipherData.Length);

                // Convert to UTF8 and parse the JSON data
                string plaintext = Encoding.UTF8.GetString(plaintextData, 0, plaintextData.Length);
                return JsonConvert.DeserializeObject<T>(plaintext);
            }  
        }

        private string EncryptPlainText(byte[]symetricKey, string plainString)
        {
            return "";

            // TODO: Complete implementation

        //    using (AesManaged aes = new AesManaged())
        //    {
        //        ICryptoTransform encryptor = aes.CreateEncryptor();
        //        encryptor.TransformFinalBlock(null, 0, 1);

        //    }
        }

        /// <summary>
        /// Download the crypto/keys object from the server. Then decrypt and verify it using the crypto and hmac
        /// keys that were generated from the sync key. This method will throw an exception in case of failure.
        /// There is currently no way to see the difference between a network error or a crypto error.
        /// </summary>
        private void DownloadCryptoKeys()
        {
            // Download the keys record
            WeaveBasicObject cryptoKeys = GetCryptoKeys();
            EncryptedDataObject encryptedDataObject = JsonConvert.DeserializeObject<EncryptedDataObject>(cryptoKeys.Payload);

            // Generate the keys
            WeaveKeys keys = new WeaveKeys(passphraseData, userName);

            HMACSHA256 hmacSha256 = new HMACSHA256(keys.HmacKey);

            byte[] hmacCalculated = hmacSha256.ComputeHash(Encoding.UTF8.GetBytes(encryptedDataObject.CipherText));

            // Check the HMAC value to see if the data is authentic
            byte[] hmacReceived = encryptedDataObject.Hmac;

            if (!AreEqual(hmacCalculated, hmacReceived))
            {
                throw new DataVerificationException("The downloaded crypto data is not authentic.");
            }

            // Decrypt the payload
            DecryptedCryptoKeys decryptedCryptoKeys = DecryptCipherText<DecryptedCryptoKeys>(keys.CryptoKey,
                encryptedDataObject.InitialisationVector, encryptedDataObject.CipherText);

            this.defaultAesKey = Convert.FromBase64String(decryptedCryptoKeys.Default[0]);
            this.defaultHmacKey = Convert.FromBase64String(decryptedCryptoKeys.Default[1]);
        }

        private static bool AreEqual<T>(T[] array1, T[] array2)
        {
            if (array1.Length == array2.Length)
            {
                for (int i = 0; i < array1.Length; i++)
                {
                    if (!array1[i].Equals(array2[i]))
                        return false;
                }

                return true;
            }
            else
            {
                return false;
            }
        }

        private string EncodeEmailAddress(string email)
        {
            SHA1 sha1 = new SHA1Managed();
            byte[] hashedEmail = sha1.ComputeHash(Encoding.UTF8.GetBytes(email.ToLowerInvariant()));
            string base32Email = Base32Convert.ToBase32String(hashedEmail);

            return base32Email.ToLowerInvariant();
        }

        /// <summary>
        /// Returns the Weave Node that the client is located on. Weave-specific calls should be directed to that node. 
        /// If the value is the string "null", the user hasn't been assigned a node yet (probably due to sign up throttling). 
        /// </summary>
        /// <returns>The Weave Node where the client is located on.</returns>
        private void DetectWeaveNode()
        {
            try
            {
                string weaveNode = communicationChannel.Execute(GetOperationAddress("node/weave"), RestOperation.Get);
                if (weaveNode == "null")
                    this.WeaveNode = null;
                else
                {
                    if (weaveNode.EndsWith("/"))
                        this.WeaveNode = weaveNode.Substring(0, weaveNode.Length - 1);
                    else
                        this.WeaveNode = weaveNode;
                }
            }
            catch (DataNotFoundException ex)
            {
                // This means that the account was not found on the server
                throw new UnauthorizedAccessException("The provided username and/or password are incorrect.", ex);
            }
        }

        /// <summary>
        /// Detect the global meta data from the server.
        /// </summary>
        private void DownloadGlobalMetaData()
        {
            string url = GetWeaveNodeOperationAddress("storage/meta/global");
            string result = communicationChannel.Execute(url, RestOperation.Get);

            WeaveBasicObject wbo = JsonConvert.DeserializeObject<WeaveBasicObject>(result);
            GlobalMetaData metaData = JsonConvert.DeserializeObject<GlobalMetaData>(wbo.Payload);

            ServerStorageVersion = metaData.StorageVersion;
        }

        private string GetWeaveNodeOperationAddress(string operation)
        {
            return this.WeaveNode + "/" + ApiVersion + "/" + this.userName + "/" + operation;
        }

        private string GetOperationAddress(string operation)
        {
            return this.userServerUrl + "/1.0/" + this.userName + "/" + operation;
        }

        private string GetSortOrderValue(SortOrder sortOrder)
        {
            switch (sortOrder)
            {
                case SortOrder.NewestFirst:
                    return "newest";
                case SortOrder.OldestFirst:
                    return "oldest";
                case SortOrder.Index:
                    return "index";
                default:
                    return null;
            }
        }

        private string GetNextBookmarkID()
        {
            return "";

            // TODO: Complete implementation
        }

        private int GetNextSortIndex(string dir)
        {
            return 0;

            // TODO: Complete implementation
        }
        #endregion

        #region Properties
        public int ServerStorageVersion { get; private set; }

        public string WeaveNode { get; private set; }
        #endregion
    }
}
