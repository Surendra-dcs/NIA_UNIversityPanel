using Microsoft.AspNetCore.Mvc;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class ResultController : Controller
    {
        public IActionResult ProvisionalMarksheet()
        {
            return View();
        }
    }
}
