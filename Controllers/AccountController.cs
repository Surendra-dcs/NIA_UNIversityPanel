using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NIAUNIVERSITYPANEL.Models;
using System.Net.Http;
using System.Text;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApiAuthService _api;

        public AccountController(ApiAuthService api)
        {
            _api = api;
        }
        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(string mobile)
        {
            var result = await _api.SendOtp(mobile);
            if (!result.success)
            {
                ViewBag.Error = result.message; 
                return View();               
            }

            ViewBag.Mobile = mobile;    
            return View();
        }
     
        [HttpPost]
        public async Task<IActionResult> VerifyOtp(string mobile, string otp)
        {
            try
            {
                var token = await _api.VerifyOtp(mobile, otp);
                if (string.IsNullOrEmpty(token))
                {
                    ViewBag.Mobile = mobile;
                    ViewBag.Error = "Invalid OTP or OTP expired!";
                    return View("Login");
                }
                HttpContext.Session.SetString("JWT", token);
                return RedirectToAction("Dashboard", "University");
            }
            catch (Exception)
            {
                ViewBag.Mobile = mobile;
                ViewBag.Error = "Something went wrong. Please try again!";
                return View("Login");
            }
        }
    }
}
