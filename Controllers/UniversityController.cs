using Microsoft.AspNetCore.Mvc;
using NIAUNIVERSITYPANEL.Models;

namespace NIAUNIVERSITYPANEL.Controllers
{
    public class UniversityController : Controller
    {
        public IActionResult Dashboard()
        {
            var model = new DashboardViewModel
            {
                TotalStudents = 1800,
                TotalCourses = 43,
                TotalPrograms = 5,
                TotalNewAdmissions = 0,
                RecentAdmissions = new List<RecentAdmission>
                {
                    new() { StudentName = "Ravi Sharma",   CourseName = "B.Tech CSE",       ProgramName = "Engineering",     AdmissionDate = DateTime.Now.AddDays(-1),  Status = "Active"  },
                    new() { StudentName = "Priya Singh",   CourseName = "MBA Finance",      ProgramName = "Management",      AdmissionDate = DateTime.Now.AddDays(-2),  Status = "Active"  },
                    new() { StudentName = "Arjun Mehta",   CourseName = "BCA",              ProgramName = "Computer Apps",   AdmissionDate = DateTime.Now.AddDays(-3),  Status = "Pending" },
                    new() { StudentName = "Sneha Gupta",   CourseName = "M.Sc Physics",     ProgramName = "Science",         AdmissionDate = DateTime.Now.AddDays(-4),  Status = "Active"  },
                    new() { StudentName = "Rohan Verma",   CourseName = "B.Com Hons",       ProgramName = "Commerce",        AdmissionDate = DateTime.Now.AddDays(-5),  Status = "Active"  },
                    new() { StudentName = "Aarti Joshi",   CourseName = "PGDM Marketing",   ProgramName = "Management",      AdmissionDate = DateTime.Now.AddDays(-6),  Status = "Review"  },
                }
            };
            return View(model);
        }        
    }
}
