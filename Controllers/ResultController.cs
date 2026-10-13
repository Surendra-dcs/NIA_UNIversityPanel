using Microsoft.AspNetCore.Mvc;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class ResultController : Controller
    {
        public IActionResult ProvisionalMarksheet()
        {
            return View();
        }
        [HttpPost]
        public IActionResult ProvisionalMarksheetMDMS(string rollNumber, string dob, int exId)
        {
            ViewBag.RollNumber = rollNumber;
            ViewBag.Dob = dob;
            ViewBag.ExId = exId;
            return View();
        }
     }
}
