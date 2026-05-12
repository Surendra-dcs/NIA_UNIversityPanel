using Microsoft.AspNetCore.Mvc;
using NIAUNIVERSITYPANEL.Models;
using NIAUNIVERSITYPANEL.Models.NIAUNIVERSITYPANEL.Models;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class PGDeputyManagerController : Controller
    {
        public IActionResult Dashboard()
        {
            var model = new DashboardViewModel();
            return View(model);
        }

        public IActionResult enrollmentform()
        {
            return View();
        }

        public IActionResult studentadmissiondetails()
        {
            return View();
        }

        public IActionResult rolllist()
        {
            return View();
        }

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
