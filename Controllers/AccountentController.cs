using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NIAUNIVERSITYPANEL.Models;
using NIAUNIVERSITYPANEL.Models.NIAUNIVERSITYPANEL.Models;
using System.Net.Http;
using System.Text;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class AccountentController : Controller
    {
        private readonly ApiAuthService _api;
        public AccountentController(ApiAuthService api)
        {
            _api = api;
        }

        public IActionResult Dashboard()
        {           
            return View();
        }

        public IActionResult Payamount()
        {
            return View();
        }

    }
}
