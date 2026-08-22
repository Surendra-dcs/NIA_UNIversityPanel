using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarksheetApp.Models
{
    // ================== STUDENT MASTER TABLE ==================
    [Table("Students")]
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        public string SerialNo { get; set; }          // क्रम संख्या
        public string FolioNo { get; set; }            // फोलियों संख्या

        public string StudentName { get; set; }        // नाम
        public string FatherName { get; set; }         // पिता का नाम
        public string MotherName { get; set; }         // माता का नाम

        public string RollNo { get; set; }              // अनुक्रमांक
        public string EnrollmentNo { get; set; }         // नामांकन संख्या
        public string Attempt { get; set; }              // प्रयास (1st/2nd..)

        public string CourseName { get; set; }           // B.A.M.S. II Professional
        public string ExamSession { get; set; }           // Examination Held in Jan-Feb 2025
        public string Result { get; set; }                 // उत्तीर्ण / अनुत्तीर्ण
        public string ResultDate { get; set; }

        public string DistinctionSubjects { get; set; }
        public string FirstClassSubjects { get; set; }
        public string GraceSubjects { get; set; }
        public string FailedSubjects { get; set; }

        public int GrandTotal { get; set; }

        public ICollection<SubjectMark> SubjectMarks { get; set; } = new List<SubjectMark>();
    }

    // ================== SUBJECT-WISE MARKS TABLE ==================
    [Table("SubjectMarks")]
    public class SubjectMark
    {
        [Key]
        public int SubjectMarkId { get; set; }

        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        public string SubjectCode { get; set; }      // A-1, A-2 ...
        public string SubjectName { get; set; }        // Dravyaguna Vigyan

        public int MaxMarks { get; set; }                // 400
        public int MinMarks { get; set; }                 // 200

        public int TheoryPart1 { get; set; }               // सैद्धांतिक प्रथम
        public int TheoryPart2 { get; set; }                // सैद्धांतिक द्वितीय

        public int Practical { get; set; }                    // व्यावहारिक/नैदानिक
        public int Viva { get; set; }                           // साक्षात्कार
        public int Elective { get; set; }                        // ऐच्छिक
        public int InternalAssessment { get; set; }               // आई.ए.

        public int SubjectTotal { get; set; }
        public string Remark { get; set; }                          // I / D / G / F
    }

    // ================== VIEWMODEL FOR THE MARKSHEET VIEW ==================
    public class MarksheetViewModel
    {
        public Student StudentInfo { get; set; }
        public List<SubjectMark> Subjects { get; set; } = new List<SubjectMark>();
    }
}
