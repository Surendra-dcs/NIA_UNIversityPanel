using System.ComponentModel.DataAnnotations;

namespace NIAUNIVERSITYPANEL.Models
{
    public class ExaminerProfile
    {
            public int Id { get; set; }

            [Required(ErrorMessage = "Voucher No. required hai")]
            [Display(Name = "Voucher No.")]
            public string VoucherNo { get; set; } = string.Empty;

            [Required(ErrorMessage = "Bank ka naam required hai")]
            [Display(Name = "Name of Bank")]
            public string BankName { get; set; } = string.Empty;

            [Required(ErrorMessage = "Account No. required hai")]
            [Display(Name = "Bank A/C No")]
            public string BankAccountNo { get; set; } = string.Empty;

            [Required(ErrorMessage = "IFSC Code required hai")]
            [Display(Name = "IFSC Code")]
            public string IFSCCode { get; set; } = string.Empty;

            [Required(ErrorMessage = "Mobile No. required hai")]
            [StringLength(15)]
            [Display(Name = "Mobile No")]
            public string MobileNo { get; set; } = string.Empty;

            [Required(ErrorMessage = "Email required hai")]
            [EmailAddress(ErrorMessage = "Valid email daalna")]
            [Display(Name = "Email ID")]
            public string Email { get; set; } = string.Empty;

            [Required(ErrorMessage = "PAN No. required hai")]
            [Display(Name = "PAN No")]
            public string PANNo { get; set; } = string.Empty;

            [Required(ErrorMessage = "Examiner ka naam required hai")]
            [Display(Name = "Name of Examiner")]
            public string ExaminerName { get; set; } = string.Empty;

            [Display(Name = "Qualification")]
            public string? Qualification { get; set; }

            [Display(Name = "Specialization")]
            public string? Specialization { get; set; }

            [Display(Name = "Teaching Exp. UG")]
            public string? TeachingUG { get; set; }

            [Display(Name = "Teaching Exp. PG")]
            public string? TeachingPG { get; set; }

            [Display(Name = "College Address")]
            public string? CollegeAddress { get; set; }

            public string? CollegeCity { get; set; }
            public string? CollegeDistrict { get; set; }
            public string? CollegeState { get; set; }
            public string? CollegePinCode { get; set; }

            [Display(Name = "Residential Address")]
            public string? ResidentialAddress { get; set; }

            public string? ResidentialCity { get; set; }
            public string? ResidentialDistrict { get; set; }
            public string? ResidentialState { get; set; }
            public string? ResidentialPinCode { get; set; }

            [Display(Name = "Name of Examination")]
            public string? ExaminationtextName { get; set; }

            [Display(Name = "Course Type")]
            public string? CourseType { get; set; }
            public string? CourseTextName { get; set; }
            public string? SubjectTextName { get; set; }
            public string? SubjectCode { get; set; }

            public IFormFile ExaminnerSignature { get; set; }
            public string ExaSignature { get; set; } = "Signature";

    }

}
