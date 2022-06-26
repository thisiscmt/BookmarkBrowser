using FxSyncNet.Util;
using Medo.Security.Cryptography;
using RFC5869;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace FxSyncNet.Models
{
    [DataContract]
    public class LoginRequest
    {
        public LoginRequest(Credentials credentials)
        {
            this.Email = credentials.Email;
            this.AuthPW = BinaryHelper.ToHexString(credentials.AuthPW);
            this.VerificationMethod = "email";
            this.Reason = credentials.Reason;
        }

        [DataMember(Name="email")]
        public string Email { get; private set; }

        [DataMember(Name="authPW")]
        public string AuthPW  { get; private set; }

        [DataMember(Name="verificationMethod")]
        public string VerificationMethod { get; private set; }

        [DataMember(Name="reason")]
        public string Reason { get; private set; }
    }
}
