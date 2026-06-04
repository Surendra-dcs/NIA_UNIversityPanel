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
        public async Task<ApiResponse> Login(string mobile,string password)
        {
            var payload = new
            {
                MobileNumber = mobile,
                Password = password
            };
            var content = new StringContent(JsonConvert.SerializeObject(payload),Encoding.UTF8,"application/json");
            var response = await _http.PostAsync("Auth/login",content);
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApiResponse>(json);
            return result!;
        }
        public async Task<ApiResponse> ExLogin(string email, string password)
        {
            var payload = new
            {
                EmainId = email,
                Password = password,
                SystemId = Environment.MachineName
            };
            var content = new StringContent(
                JsonConvert.SerializeObject(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _http.PostAsync(
                "ExAuth/login",
                content);

            var json = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ApiResponse>(json);

            return result;
        }

        public async Task<ApiResponse>CheckLogin(string email)
        {
            var payload = new
            {
                Email = email,
            };
            var content = new StringContent(
                JsonConvert.SerializeObject(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _http.PostAsync(
                "ExAuth/cheklogin",
                content);

            var json = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ApiResponse>(json);

            return result;
        }

        public async Task Logout(string email)
        {
            var payload = new
            {
                Email = email
            };

            var content = new StringContent(
                JsonConvert.SerializeObject(payload),
                Encoding.UTF8,
                "application/json");

            await _http.PostAsync(
                "ExAuth/logout",
                content);
        }

        public async Task<string> GetVoucherNo()
        {
            var response = await _http.GetAsync("Examiner/get-voucher");

            if (!response.IsSuccessStatusCode)
            {
                return "PV-0001";
            }
            var json = await response.Content.ReadAsStringAsync();

            dynamic result = JsonConvert.DeserializeObject(json);

            return result.voucherNo;
        }

        //public async Task<(bool success, string message)> SendOtp(string mobile)
        //{
        //    var payload = new
        //    {
        //        MobileNumber = mobile
        //    };

        //    var content = new StringContent(
        //        JsonConvert.SerializeObject(payload),
        //        Encoding.UTF8,
        //        "application/json"
        //    );

        //    var response = await _http.PostAsync("Auth/login", content);

        //    var json = await response.Content.ReadAsStringAsync();
        //    dynamic result = JsonConvert.DeserializeObject(json);

        //    return (result.success, result.message);
        //}
        //public async Task<string> VerifyOtp(string mobile, string otp)
        //{
        //    var data = new { MobileNumber = mobile, OTP = otp };
        //    var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");

        //    var res = await _http.PostAsync("auth/verify", content);
        //    var json = await res.Content.ReadAsStringAsync();

        //    dynamic result = JsonConvert.DeserializeObject(json);
        //    return result.token;
        //}

        public async Task<VerifyOtpResponse> VerifyOtp(string mobile, string otp)
        {
            var data = new
            {
                MobileNumber = mobile,
                OTP = otp
            };

            var content = new StringContent(
                JsonConvert.SerializeObject(data),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _http.PostAsync("auth/verify", content);

            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<VerifyOtpResponse>(json);
        }
    }
}
