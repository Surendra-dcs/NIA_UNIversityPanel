using Microsoft.AspNetCore.Mvc;
using NIAUNIVERSITYPANEL.Models;
using NIAUNIVERSITYPANEL.Models.NIAUNIVERSITYPANEL.Models;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class UniversityController : Controller
    {
        public IActionResult Dashboard()
        {
            var model = new DashboardViewModel();
            return View(model);
        }
    }
}
