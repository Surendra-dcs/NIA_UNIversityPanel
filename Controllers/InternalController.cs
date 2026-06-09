using Microsoft.AspNetCore.Mvc;

namespace NIAUNIVERSITYPANEL.Controllers
{

    public class InternalController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }
        public IActionResult IA_marks()
        {
            return View();
        }        
        public IActionResult IA_Attendance()
        {
            return View();
        }
    }
}
