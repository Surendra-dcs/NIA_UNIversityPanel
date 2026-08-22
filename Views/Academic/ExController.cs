using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using NIAUNIVERSITYPANEL.Models;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class ExController : Controller
    {
        private readonly ApiAuthService _api;
        private readonly IDataProtector _protector;
        public ExController(ApiAuthService api, IDataProtectionProvider protector)
        {
            _api = api;
            _protector = protector.CreateProtector("PdfIdProtection");
        }
        public string EncryptId(int id)
        {
            return _protector.Protect(id.ToString());
        }
        public long DecryptId(string encryptedId)
        {
            var decrypted = _protector.Unprotect(encryptedId);
            return Convert.ToInt64(decrypted);
        }
        public IActionResult addExaminer()
        {
            return View();
        }
        public IActionResult Dashboard()
        {
            return View();
        }
        public IActionResult P_marks()
        {
            return View();
        }
        public IActionResult special_practical()
        {
            return View();
        }
        public IActionResult P_Report()
        {
            return View();
        }
        public IActionResult V_marks()
        {
            return View();
        }
        public IActionResult P_Attendance()
        {
            return View();
        }
        public IActionResult V_Attendance()
        {
            return View();
        }
        public async Task<IActionResult> C_file()
        {
            var model = new ExaminerProfile
            {
                VoucherNo = await _api.GetVoucherNo()
            };
            model.Email = HttpContext.Session.GetString("Email")!;
            model.ExaminerName = HttpContext.Session.GetString("UserName")!;
            return View(model);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult C_file(ExaminerProfile model)
        {
            return View();
        }

        public IActionResult ExBillDetails(int subjectId)
        {
            ViewBag.SubjectId =subjectId;
            return View();
        }
        public IActionResult SubjctWiseBill()
        {           
            return View();
        }
    }
}
