using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace FxSyncNet.Models
{
    [DataContract]
    public class VerificationRequest
    {
        public VerificationRequest(string userId, string verificationCode)
        {
            this.UserId = userId;
            this.VerificationCode = verificationCode;
        }

        [DataMember(Name="uid")]
        public string UserId { get; private set; }

        [DataMember(Name="code")]
        public string VerificationCode { get; private set; }
    }
}
