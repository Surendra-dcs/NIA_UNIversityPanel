using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using NIAUNIVERSITYPANEL.Models;
using System.Data;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class Ex_AccountController : Controller
    {
        private readonly ApiAuthService _api;
        public Ex_AccountController(ApiAuthService api)
        {
            _api = api;
        }
        public IActionResult login()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(string Email, string password)
        {
            var response = await _api.ExLogin(Email, password);
            if (!response.success)
            {
                ViewBag.Error = response.message;
                return View();
            }
            if (response.stringrole.ToLower() == "extenalexaminer")
            {
                var response2 = await _api.CheckLogin(Email);
                HttpContext.Session.Clear();
                HttpContext.Session.SetString("UserName", response.username ?? "");
                HttpContext.Session.SetString("Email", response.email ?? "");
                HttpContext.Session.SetString("Role", response.stringrole ?? "");
                HttpContext.Session.SetString("course_name", response.course_name ?? "");
                HttpContext.Session.SetString("semyearcode", response.semyearcode ?? "");
                HttpContext.Session.SetString("subject_name", response.subject_name ?? "");
                HttpContext.Session.SetString("Examname", response.Examname ?? "");
                if (!response2.success)
                {
                    return RedirectToAction("C_file", "Ex");
                }
                return RedirectToAction("Dashboard", "Ex");
            }
            else if (response.stringrole.ToLower() == "intenalexaminer")
            {
                var response2 = await _api.CheckLogin(Email);
                HttpContext.Session.Clear();
                HttpContext.Session.SetString("UserName", response.username ?? "");
                HttpContext.Session.SetString("Email", response.email ?? "");
                HttpContext.Session.SetString("Role", response.stringrole ?? "");
                HttpContext.Session.SetString("course_name", response.course_name ?? "");
                HttpContext.Session.SetString("semyearcode", response.semyearcode ?? "");
                HttpContext.Session.SetString("subject_name", response.subject_name ?? "");
                HttpContext.Session.SetString("Examname", response.Examname ?? "");
                if (!response2.success)
                {
                    return RedirectToAction("C_file", "Ex");
                }
                return RedirectToAction("Dashboard", "Internal");
            }
            ViewBag.Error = "Invalid Email or Password";
            return View();
        }
        public async Task<IActionResult> Logout()
        {
            string email = HttpContext.Session.GetString("Email")!;
            if (!string.IsNullOrEmpty(email))
            {
                await _api.Logout(email);
            }
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Ex_Account");
        }
    }
}
