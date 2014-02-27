using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CloudFox.Weave
{
    public class QuotaInformation
    {
        public QuotaInformation(int quota, bool hasQuota, int currentUsage)
        {
            Quota = quota;
            HasQuota = hasQuota;
            CurrentUsage = currentUsage;
        }

        public int Quota { get; private set; }
        public bool HasQuota { get; private set; }
        public int CurrentUsage { get; private set; }
    }
}
