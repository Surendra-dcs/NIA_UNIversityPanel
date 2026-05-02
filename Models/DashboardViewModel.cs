namespace NIAUNIVERSITYPANEL.Models
{
    namespace NIAUNIVERSITYPANEL.Models
    {
        public class DashboardViewModel
        {
            public int TotalStudents { get; set; }
            public int TotalCourses { get; set; }
            public int TotalPrograms { get; set; }
            public int TotalNewAdmissions { get; set; }
            public List<RecentAdmission> RecentAdmissions { get; set; } = new();
        }

        public class RecentAdmission
        {
            public string StudentName { get; set; } = "";
            public string CourseName { get; set; } = "";
            public string ProgramName { get; set; } = "";  // semesterName from rolllist
            public string ExamName { get; set; } = "";
            public string RollNumber { get; set; } = "";
            public string EnrollmentNumber { get; set; } = "";
            public string Email { get; set; } = "";
            public DateTime AdmissionDate { get; set; }
            public string Status { get; set; } = "Active";
        }
    }
}
