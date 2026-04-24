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
                TotalStudents = 0,
                TotalCourses = 0,
                TotalPrograms = 0,
                TotalNewAdmissions = 0,
                RecentAdmissions = new List<RecentAdmission>
                {
                    new() { StudentName = "Ravi Sharma",   CourseName = "AYURVEDACHARYA (B.A.M.S) - SCHEME - 2020 - Upto Batch 2020",       ProgramName = "Under Graduate (UG)",     AdmissionDate = DateTime.Now.AddDays(-1),  Status = "Active"  },
                    new() { StudentName = "Priya Singh",   CourseName = "AYURVEDACHARYA (B.A.M.S) - SCHEME - 2020 - Upto Batch 2020",      ProgramName = "Under Graduate (UG)",      AdmissionDate = DateTime.Now.AddDays(-2),  Status = "Active"  },
                    new() { StudentName = "Arjun Mehta",   CourseName = "AYURVEDACHARYA (B.A.M.S) - SCHEME - 2021 - Batch 2021 onwards",   ProgramName = "Under Graduate (UG)",   AdmissionDate = DateTime.Now.AddDays(-3),  Status = "Pending" },
                    new() { StudentName = "Sneha Gupta",   CourseName = "Master of Science in Ayurveda Diet and Nutrition",     ProgramName = "Post Graduate (PG) IDS",         AdmissionDate = DateTime.Now.AddDays(-4),  Status = "Active"  },
                    new() { StudentName = "Rohan Verma",   CourseName = "Master of Science in Ayur-Yoga Preventive Cardiology",       ProgramName = "Post Graduate (PG) IDS",        AdmissionDate = DateTime.Now.AddDays(-5),  Status = "Active"  },
                    new() { StudentName = "Aarti Joshi",   CourseName = "Master of Science in Marmalogy and Sports Medicine",   ProgramName = "Post Graduate (PG) IDS",      AdmissionDate = DateTime.Now.AddDays(-6),  Status = "Review"  },
                }
            };
            return View(model);
        }        
    }
}
