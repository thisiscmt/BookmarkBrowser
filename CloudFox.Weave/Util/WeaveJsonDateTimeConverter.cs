using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace CloudFox.Weave.Util
{
    public class WeaveJsonDateTimeConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(DateTime);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            Type type = reader.ValueType;

            if(type == typeof(double))
                return Convert((double)reader.Value);
            else if(type == typeof(long))
                return Convert((long)reader.Value);
            else
                throw new InvalidOperationException("Cannot convert " + type.FullName + " to a datetime.");
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            DateTime dateTime = (DateTime)value;
            double totalSeconds = (dateTime - new DateTime(1970, 1, 1)).TotalSeconds;
            writer.WriteValue(totalSeconds);
        }

        private static DateTime Convert(double value)
        {
            DateTime dateTime = new DateTime(1970, 1, 1);
            return dateTime.AddSeconds(value);
        }
    }
}
