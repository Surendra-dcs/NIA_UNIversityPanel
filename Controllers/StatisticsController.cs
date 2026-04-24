using Microsoft.AspNetCore.Mvc;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class StatisticsController : Controller
    {
        public IActionResult paymentstatus()
        {
            return View();
        }
        public IActionResult stexamwisestatistics()
        {
            return View();
        }
        public IActionResult statisticsofresult()
        {
            return View();
        }
        public IActionResult resultreport()
        {
            return View();
        }
    }
}
