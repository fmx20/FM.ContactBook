using System.Text.Json;

namespace FM.ContactBook.Server.Dto
{
    public class ResponseBase
    {
        public int ErrorCode { get; set; }
        public string ErrorMsg { get; set; }
        public bool IsError { get; set; }

        public void SetError(int code, string message)
        {
            ErrorCode = code;
            ErrorMsg = message;

            IsError = true;
        }

        public string ToJsonString()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }
    }
}
