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
        public IActionResult IAReport()
        {
            return View();
        }

        public IActionResult IntBillDetails()
        {
            return View();
        }
    }
}
