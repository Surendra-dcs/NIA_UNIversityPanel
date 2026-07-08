namespace NIAUNIVERSITYPANEL.Models
{
    public class ApiResponse
    {
        public bool success { get; set; }
        public string message { get; set; } = "";
        public int role { get; set; }
        public int CourseId { get; set; }
        public string stringrole { get; set; } = "";
        public string username { get; set; } = "";
        public string email { get; set; } = "";
        public string course_name { get; set; } = "";
        public string semyearcode { get; set; } = "";
        public string subject_name { get; set; } = "";
        public string Examname { get; set; } = "";
    }
}
