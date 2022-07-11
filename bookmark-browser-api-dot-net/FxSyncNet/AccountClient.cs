﻿using FxSyncNet.Models;
using FxSyncNet.Security;
using FxSyncNet.Util;

namespace FxSyncNet
{
    public class AccountClient : ProxyBase
    {
        public AccountClient() : base("https://api.accounts.firefox.com/v1/")
        {
        }

        public Task<LoginResponse> Login(Credentials credentials)
        {
            return Login(credentials, false);
        }

        public Task<LoginResponse> Login(Credentials credentials, bool keys)
        {
            var loginRequest = new LoginRequest(credentials);
            return Post<LoginRequest, LoginResponse>("account/login" + (keys ? "?keys=true" : ""), loginRequest);
        }

        public Task<Object> Verify(string userId, string verificationCode)
        {
            return Post<VerificationRequest, Object>("recovery_email/verify_code", new VerificationRequest(userId, verificationCode));
        }

        public Task<DevicesResponse> Devices(string sessionToken)
        {
            return Get<DevicesResponse>("account/devices", sessionToken, "sessionToken", 2 * 32);
        }

        public Task<KeysResponse> Keys(string keyFetchToken)
        {
            return Get<KeysResponse>("account/keys", keyFetchToken, "keyFetchToken", 3 * 32);
        }

        public Task SessionStatus(string sessionToken)
        {
            return Get("session/status", sessionToken, "sessionToken", 2 * 32);
        }

        public Task<CertificateSignResponse> CertificateSign(string sessionToken, RSACryptoServiceProvider rsa, TimeSpan duration)
        {
            RSAParameters keyInfo = rsa.ExportParameters(false);

            string n = BinaryHelper.BigIntegerFromBigEndian(keyInfo.Modulus).ToString();
            string e = BinaryHelper.BigIntegerFromBigEndian(keyInfo.Exponent).ToString();

            CertificateSignRequest signRequest = new CertificateSignRequest();
            signRequest.PublicKey = new PublicKey() { Algorithm = "RS", E = e, N = n };
            signRequest.Duration = (long)duration.TotalMilliseconds;

            return Post<CertificateSignRequest, CertificateSignResponse>("certificate/sign", signRequest, sessionToken, "sessionToken", 2 * 32);
        }
    }
}
