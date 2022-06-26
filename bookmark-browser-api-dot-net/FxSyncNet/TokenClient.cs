using FxSyncNet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FxSyncNet
{
    public class TokenClient : ProxyBase
    {
        public TokenClient() : base("https://token.services.mozilla.com/1.0/")
        {
        }

        public TokenResponse GetSyncToken(string browerIdAssertion, string clientState)
        {
            return Get<TokenResponse>("sync/1.5", browerIdAssertion, clientState).Result;
        }
    }
}
