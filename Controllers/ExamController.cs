using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace NIAUNIVERSITYPANEL.Controllers
{   
    public class ExamController : Controller
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            int? role = HttpContext.Session.GetInt32("Role");
            if (role == null)
            {
                context.Result = new RedirectToActionResult(
                    "Login",
                    "Account",
                    null);

                return;
            }
            if (role != 1)
            {
                context.Result = new RedirectToActionResult(
                    "Logout",
                    "Account",
                    null);

                return;
            }

            base.OnActionExecuting(context);
        }

        public IActionResult rolllist()
        {
            return View();
        }
        public IActionResult admitcard()
        {
            return View();
        }
        public IActionResult bulkadmitcard()
        {
            return View();
        }
        public IActionResult resultsheet()
        {
            return View();
        }
        public IActionResult resulttr()
        {
            return View();
        }
        public IActionResult resultReports()
        {
            return View();
        }
        public IActionResult revaltr()
        {
            return View();
        }
        public IActionResult re_revaltr()
        {
            return View();
        }
        public IActionResult result()
        {
            return View();
        }
        public IActionResult examinerlist()
        {
            return View();
        }

        public IActionResult ExaminerCreate()
        {
            return View();
        }

        public IActionResult AssignedPaperExaminer()
        {
            return View();
        }
        public IActionResult ansbooklist()
        {
            return View();
        }
        public IActionResult revallist()
        {
            return View();
        }
        public IActionResult billprint()
        {
            return View();
        }
        public IActionResult AttendanceSeet ()
        {
            return View();
        }
        public IActionResult StudentAttendance()
        {
            return View();
        }
        public IActionResult P_Report()
        {
            return View();
        }
        public IActionResult IAReport()
        {
            return View();
        }
        public IActionResult ElectiveMarksReport()
        {
            return View();
        }

    }
}
