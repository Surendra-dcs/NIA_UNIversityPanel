using System.Text;
using Newtonsoft.Json;
namespace NIAUNIVERSITYPANEL.Models
{
 
    public class ApiAuthService
    {
        private readonly HttpClient _http;

        public ApiAuthService(HttpClient http)
        {
            _http = http;
        }

        public async Task SendOtp(string mobile)
        {
            var data = new { MobileNumber = mobile };
            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");

            await _http.PostAsync("auth/login", content);
        }

        public async Task<string> VerifyOtp(string mobile, string otp)
        {
            var data = new { MobileNumber = mobile, OTP = otp };
            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");

            var res = await _http.PostAsync("auth/verify", content);
            var json = await res.Content.ReadAsStringAsync();

            dynamic result = JsonConvert.DeserializeObject(json);
            return result.token;
        }
    }
}
