using MarksheetApp.Models;
using Microsoft.AspNetCore.Mvc;
using System;

namespace NIAUNIVERSITYPANEL.Controllers
{
   
    public class MarksheetController : Controller
    {
      
        [HttpGet]
        public IActionResult MS()
        {
            return View();
        }
    }
}
