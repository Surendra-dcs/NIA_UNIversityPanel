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
        public async Task<IActionResult> Login(string mobile, string password)
        {
            var response = await _api.Login(mobile, password);
            if (!response.success)
            {
                ViewBag.Error = response.message;
                return View();
            }
            HttpContext.Session.SetString("Mobile", mobile);
            HttpContext.Session.SetInt32("Role", response.role);
            switch (response.role)
            {
                case 1:
                    return RedirectToAction(
                        "Dashboard",
                        "University");

                case 2:
                    return RedirectToAction(
                        "Dashboard",
                        "UGDeputyManager");

                case 3:
                    return RedirectToAction(
                        "Dashboard",
                        "PGDeputyManager");

                default:
                    ViewBag.Error = "Invalid Role!";
                    return View("Login");
            }
        }

        //[HttpPost]
        //public async Task<IActionResult> VerifyOtp(string mobile, string otp)
        //{
        //    try
        //    {
        //        var token = await _api.VerifyOtp(mobile, otp);
        //        if (string.IsNullOrEmpty(token))
        //        {
        //            ViewBag.Mobile = mobile;
        //            ViewBag.Error = "Invalid OTP or OTP expired!";
        //            return View("Login");
        //        }
        //        HttpContext.Session.SetString("JWT", token);
        //        return RedirectToAction("Dashboard", "University");
        //    }
        //    catch (Exception)
        //    {
        //        ViewBag.Mobile = mobile;
        //        ViewBag.Error = "Something went wrong. Please try again!";
        //        return View("Login");
        //    }
        //}


    }
}
