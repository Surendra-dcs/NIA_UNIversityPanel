using Microsoft.AspNetCore.Mvc;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class ProController : Controller
    {
        public IActionResult programlist()
        {
            return View();
        }
        public IActionResult courselist()
        {
            return View();
        }
        public IActionResult subjectlist()
        {
            return View();
        }
        public IActionResult examlist()
        {
            return View();
        }
    }
}
