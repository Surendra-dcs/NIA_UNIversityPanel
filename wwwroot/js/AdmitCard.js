// ── enrollmentAdmitCard.js ───────────────────────────────────────
// Place at: wwwroot/js/enrollmentAdmitCard.js
// Used by:
//   1. Academic/enrollmentform  → printEnrollment(rowData)
//   2. Exam/rolllist            → printRollAdmitCard(rowData)
// ─────────────────────────────────────────────────────────────────

// ── CSS shared by both admit card types ───────────────────────────
function _admitCardCss() {
    return '' +
        '@import url(\'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap\');' +
        '* { margin:0; padding:0; box-sizing:border-box; }' +
        'body { background:#f0f0f0; font-family:Arial,sans-serif; font-size:11px; }' +
        '.page { width:210mm; margin:10mm auto; background:#fff; }' +
        '.container { border:2px solid #000; }' +

        /* Header */
        '.header { display:flex; align-items:center; border-bottom:3px solid #000; padding:0 8px; gap:8px; }' +
        '.header-logo { width:60px; height:60px; flex-shrink:0; display:flex; align-items:center; justify-content:center; padding:6px; }' +
        '.header-logo img { width:60px; height:auto; }' +
        '.header-center { flex:1; text-align:center; border-right:3px solid #000; padding:6px; }' +
        '.header-center .inst-name { font-size:18px; font-weight:bold; letter-spacing:0.5px; }' +
        '.header-center .inst-sub { font-size:11px; margin-top:1px; }' +
        '.header-center .inst-ministry { font-size:10px; }' +
        '.header-center .inst-address { font-size:10px; }' +
        '.header-center .perm-title { font-size:11px; font-weight:bold; margin-top:4px; display:inline-block; padding:1px 6px; }' +
        '.header-right { width:150px; flex-shrink:0; font-size:12px; margin-right:10px; }' +
        '.header-right table { width:100%; border-collapse:collapse; }' +
        '.header-right td { padding:2px 2px; }' +
        '.header-right .label { font-weight:bold; white-space:nowrap; }' +
        '.header-right .roll-value { font-size:14px; font-weight:bold; }' +

        /* Exam title */
        '.exam-title-box { border-bottom:2px solid #000; text-align:center; padding:4px 6px; }' +
        '.exam-title-box .main-title { font-size:12px; font-weight:bold; letter-spacing:0.3px; }' +
        '.exam-title-box .sub-title { font-size:11px; font-style:italic; margin-top:1px; }' +

        /* Info + photo row */
        '.info-photo-row { display:flex; border-bottom:1px solid #000; }' +
        '.info-table { flex:1; }' +
        '.info-table table { width:100%; border-collapse:collapse; }' +
        '.info-table tr td { padding:4px 8px; vertical-align:middle; border-bottom:1px solid #eee; }' +
        '.info-table .lbl { font-weight:bold; font-size:11px; width:140px; white-space:nowrap; border-right:1px solid #ddd; }' +
        '.info-table .val { font-size:11px; }' +
        '.info-table .name { font-size:14px; font-weight:bold; }' +

        /* Photo/sig column */
        '.photo-sig-box { width:160px; flex-shrink:0; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:6px; gap:6px; border-left:2px solid #000; }' +
        '.photo-box { width:120px; height:140px; border:1px solid #999; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#f5f5f5; font-size:10px; color:#888; text-align:center; }' +
        '.sig-box { width:120px; height:40px; border:1px solid #aaa; display:flex; align-items:center; justify-content:center; font-size:9px; color:#888; }' +

        /* Notes */
        '.notes-row { border-top:1px solid #000; border-bottom:2px solid #000; padding:3px 8px; }' +
        '.notes-row p { font-size:10.5px; margin:1px 0; }' +

        /* Exam programme */
        '.exam-prog-box { border-bottom:2px solid #000; }' +
        '.exam-prog-title { font-size:11px; font-weight:bold; padding:3px 8px; border-bottom:1.5px solid #000; background:#f9f9f9; }' +
        '.exam-prog-table { width:100%; border-collapse:collapse; font-size:11px; }' +
        '.exam-prog-table th { border:1px solid #000; padding:4px 6px; font-weight:bold; text-align:center; background:#f0f0f0; }' +
        '.exam-prog-table td { border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle; }' +
        '.exam-prog-table td.subject-col { text-align:left; }' +

        /* Confirm */
        '.confirm-row { border-bottom:2px solid #000; padding:4px 8px; font-size:12px; font-weight:bold; }' +

        /* Signature row */
        '.sig-row { border-bottom:2px solid #000; display:flex; justify-content:space-between; align-items:flex-end; padding:8px 20px; }' +
        '.sig-col { text-align:center; font-size:12px; }' +
        '.sig-line { border-bottom:1px solid #000; min-width:140px; margin-bottom:3px; height:22px; }' +
        '.sig-col-right { text-align:right; font-size:12px; }' +
        '.sig-col-right .prof-name { font-weight:bold; font-size:14px; }' +

        /* Important notes */
        '.important-notes { border-bottom:2px solid #000; padding:5px 8px; }' +
        '.important-notes .note-heading { font-size:13px; font-weight:bold; color:#000; margin-bottom:5px; }' +
        '.important-notes ol { padding-left:18px; margin:0; }' +
        '.important-notes ol li { font-size:9px; margin-bottom:2.5px; line-height:1.4; }' +

        /* Action bar */
        '.action-bar { background:#f8f8f8; border:1px solid #ddd; border-radius:6px; padding:10px 16px; margin:0 auto 16px; max-width:820px; display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap; }' +
        '.btn-action { padding:8px 20px; border:2px solid #7B1C1C; border-radius:4px; font-size:13px; font-weight:600; cursor:pointer; font-family:Arial,sans-serif; display:inline-flex; align-items:center; gap:6px; }' +
        '.btn-dl { background:#7B1C1C; color:#fff; }' +
        '.btn-dl:hover { background:#5a1414; }' +
        '.btn-pr { background:#fff; color:#7B1C1C; }' +
        '.btn-pr:hover { background:#f5f5f5; }' +
        '@page { size:A4; }' +
        '@media print {' +
        '  body { background:#fff; zoom:0.9; }' +
        '  .no-print { display:none !important; }' +
        '  .page { margin:0; box-shadow:none; }' +
        '  * { -webkit-print-color-adjust:exact; print-color-adjust:exact; }' +
        '}';
}

// ── Shared: build the header block ───────────────────────────────
function _buildHeader(rollNo, enrollNo, semester, gender) {
    return '' +
        '<div class="header">' +
        '<div class="header-logo">' +
        '<img src="/images/nia_logo.png" alt="NIA Logo" onerror="this.style.display=\'none\'" />' +
        '</div>' +
        '<div class="header-center">' +
        '<div class="inst-name">NATIONAL INSTITUTE OF AYURVEDA</div>' +
        '<div class="inst-sub">Deemed to be University</div>' +
        '<div class="inst-ministry">(Ministry of AYUSH, Govt. of India)</div>' +
        '<div class="inst-address">Jorawar Singh Gate, Amer Road, Jaipur-302002</div>' +
        '<div class="perm-title"><b>(PROVISIONALLY ALLOWED)</b> PERMISSION LETTER CUM ADMISSION CARD</div>' +
        '</div>' +
        '<div class="header-right">' +
        '<table>' +
        '<tr><td class="label">ROLL NO.:</td><td class="roll-value">' + (rollNo || '&mdash;') + '</td></tr>' +
        '<tr><td class="label">ENROL NO.:</td><td style="font-weight:bold;font-size:10px;">' + (enrollNo || '&mdash;') + '</td></tr>' +
        '<tr><td class="label">SEMESTER:</td><td style="font-weight:bold;font-size:10px;">' + (semester || '&mdash;') + '</td></tr>' +
        '<tr><td class="label">GENDER:</td><td style="font-weight:bold;font-size:10px;">' + (gender || '&mdash;') + '</td></tr>' +
        '</table>' +
        '</div>' +
        '</div>';
}

// ── Shared: build important notes ────────────────────────────────
function _buildImportantNotes() {
    return '' +
        '<div class="important-notes">' +
        '<div class="note-heading">Note:-</div>' +
        '<ol>' +
        '<li style="font-size:12px;font-weight:bold;color:#ff1111;margin-bottom:4px;font-family:\'Noto Sans Devanagari\',Arial,sans-serif;">यदि आपके हिंदी व अंग्रेजी नाम में कोई त्रुटि है तो परीक्षा अनुभाग से संपर्क कर उसे सही करवाएं</li>' +
        '<li>This admit card is being issued as per the existing details filled earlier by you in the examination form. Later if your entitlement is found against/beyond the scheme of examination, your result will not be declared considering your provisional appearance in examination as null and void. However, if you find any error in your admit card, you are advised to contact the University within <b>03 days</b> of issue of admit card and get corrected your details as per existing rules and regulations.</li>' +
        '<li>Examination dates may be changed due to unavoidable circumstances.</li>' +
        '<li>Candidate must ensure that he/she fulfills the requirements of attendance (minimum 75%) &amp; failing which his University examination shall be cancelled.</li>' +
        '<li>Candidate is advised to bring his/her Valid ID Card (like Aadhar/Pan Card/Voter ID Card) along with this admit card.</li>' +
        '<li>On the first day of examination, the examination hall will open half an hour before the scheduled time and in the remaining days it will open 15 minutes before and will be closed after the scheduled time of commencement of the examination. After this no candidate will be given admission.</li>' +
        '<li>Each candidate will have to sit at the designated place where he will get an answer book for writing answers to the questions.</li>' +
        '<li>Within the examination period, every candidate will be under the discipline and authority of the Superintendent (Examination Centre) and will follow all the instructions related to the examination.</li>' +
        '<li>Candidates should read the question paper and the instructions written on it carefully before writing the answers.</li>' +
        '<li>No guarantee is given to the candidates regarding the order of question papers.</li>' +
        '<li>Complaint against question paper(s) if any, should be submitted along with Question Paper to the University through the Center Superintendent concerned within <b>24 hours</b> from the date of examination, after which no complaint will be entertained.</li>' +
        '<li>Candidates are warned not to mark their Roll Number, Name or any other mark anywhere on the inside of their Answer Book other than the answers. Violators will be liable for punishment for adopting unfair means.</li>' +
        '<li>No candidate will leave his seat before the end of the examination without special permission of the Centre Superintendent.</li>' +
        '<li>Candidates found using unfair means will be liable for serious action as per rules.</li>' +
        '</ol>' +
        '</div>';
}

// ── Shared: open window with full HTML ───────────────────────────
function _openAdmitCardWindow(titleLabel, bodyHtml) {
    var css = _admitCardCss();

    var actionBar =
        '<div class="action-bar no-print">' +
        '<button class="btn-action btn-dl" onclick="window.print()">&#128190; Download / Print Admit Card</button>' +
        '<button class="btn-action btn-pr" onclick="window.print()">&#128424; Print</button>' +
        '<span style="font-size:11px;color:#888;margin-left:8px;">or press Ctrl+P to save as PDF</span>' +
        '</div>';

    var html =
        '<!DOCTYPE html><html lang="en"><head>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>Admit Card &mdash; ' + titleLabel + '</title>' +
        '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap" rel="stylesheet">' +
        '<style>' + css + '</style>' +
        '</head><body>' +
        actionBar +
        '<div class="page"><div class="container">' +
        bodyHtml +
        '</div></div>' +
        actionBar +
        '</body></html>';

    var w = window.open('', '_blank');
    if (w) {
        w.document.write(html);
        w.document.close();
    } else {
        alert('Pop-up blocked. Please allow pop-ups to download the admit card.');
    }
}

// ═══════════════════════════════════════════════════════════════════
// 1. ENROLLMENT FORM — printEnrollment(data)
//    data comes directly from DataTable row (StudentEnrollmentModel)
// ═══════════════════════════════════════════════════════════════════
function printEnrollment(data) {

    var studentName = data.studentName || '—';
    var fatherName = data.fatherName || '—';
    var motherName = data.motherName || '—';
    var enrollNo = data.enrollmentNumber || '—';
    var collegeName = data.collegeName || '—';
    var programName = data.programName || '—';
    var courseName = data.courseName || '—';
    var email = data.email || '—';
    var mobile = data.mobile || '—';

    // Enrollment admit card has no roll number yet — show enrollment number as reference
    var header = _buildHeader('—', enrollNo, '—', '—');

    var examTitleBox =
        '<div class="exam-title-box">' +
        '<div class="main-title">ENROLLMENT ADMISSION CARD</div>' +
        '<div class="sub-title">' + courseName + ' &nbsp;|&nbsp; ' + programName + '</div>' +
        '</div>';

    var infoRows =
        '<tr><td class="lbl">NAME</td><td class="val name">' + studentName + '</td></tr>' +
        '<tr><td class="lbl">FATHER\'S NAME</td><td class="val">' + fatherName + '</td></tr>' +
        '<tr><td class="lbl">MOTHER\'S NAME</td><td class="val">' + motherName + '</td></tr>' +
        '<tr><td class="lbl">ENROLLMENT NO.</td><td class="val">' + enrollNo + '</td></tr>' +
        '<tr><td class="lbl">COLLEGE</td><td class="val">' + collegeName + '</td></tr>' +
        '<tr><td class="lbl">PROGRAM</td><td class="val">' + programName + '</td></tr>' +
        '<tr><td class="lbl">COURSE</td><td class="val">' + courseName + '</td></tr>' +
        '<tr><td class="lbl">MOBILE</td><td class="val">' + mobile + '</td></tr>' +
        '<tr><td class="lbl">EMAIL</td><td class="val">' + email + '</td></tr>';

    var infoPhotoRow =
        '<div class="info-photo-row">' +
        '<div class="info-table"><table>' + infoRows + '</table></div>' +
        '<div class="photo-sig-box">' +
        '<div class="photo-box"><span style="font-size:9px;color:#888;text-align:center;display:block;padding-top:40px;">Photo<br>Not Available</span></div>' +
        '<div class="sig-box"><span>Signature</span></div>' +
        '</div>' +
        '</div>';

    var notes =
        '<div class="notes-row">' +
        '<p><b>NOTE:-</b> MOBILE PHONE &amp; OTHER ELECTRONIC DEVICES NOT ALLOWED IN THE EXAMINATION HALL</p>' +
        '<p><b>REMARK:-</b> CANDIDATE WILL BE ADMITTED TO THE EXAMINATION HALL ONLY ON PRODUCTION OF ADMIT CARD.</p>' +
        '</div>';

    // Enrollment form — no subjects assigned yet; show placeholder row
    var subRows =
        '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:10px;font-style:italic;">Subjects will be assigned after exam schedule is released</td></tr>';

    var examProg =
        '<div class="exam-prog-box">' +
        '<div class="exam-prog-title">Examination Programme for Subject(s) offered</div>' +
        '<table class="exam-prog-table">' +
        '<thead><tr>' +
        '<th style="width:30px;">S.No</th>' +
        '<th>Subject</th>' +
        '<th style="width:80px;">Exam Date</th>' +
        '<th style="width:65px;">Exam Day</th>' +
        '<th style="width:110px;">Exam Time</th>' +
        '<th style="width:80px;">Exam Center</th>' +
        '</tr></thead>' +
        '<tbody>' + subRows + '</tbody>' +
        '</table></div>';

    var confirmRow = '<div class="confirm-row">All details in the admission card is correct</div>';

    var sigRow =
        '<div class="sig-row">' +
        '<div class="sig-col"><div class="sig-line"></div>Full Signature Of Candidate</div>' +
        '<div class="sig-col"><div class="sig-line"></div>Signature of Centre Supdt.</div>' +
        '<div class="sig-col-right"><div class="prof-name">Prof. Ashok Kumar</div><div>Controller of Examination</div></div>' +
        '</div>';

    var body = header + examTitleBox + infoPhotoRow + notes + examProg + confirmRow + sigRow + _buildImportantNotes();

    _openAdmitCardWindow('Enrollment: ' + enrollNo, body);
}


// ═══════════════════════════════════════════════════════════════════
// 2. ROLL LIST — printRollAdmitCard(data)
//    data comes directly from DataTable row (Rolllist model)
// ═══════════════════════════════════════════════════════════════════
function printRollAdmitCard(data) {

    var rollNo = data.rollNumber || '—';
    var studentName = data.userName || '—';
    var email = data.email || '—';
    var courseName = data.courseName || '—';
    var semesterName = data.semesterName || '—';
    var examName = data.examName || '—';

    var header = _buildHeader(rollNo, '—', semesterName, '—');

    var examTitleBox =
        '<div class="exam-title-box">' +
        '<div class="main-title">' + examName + '</div>' +
        '<div class="sub-title">' + courseName + ' &nbsp;|&nbsp; Semester: ' + semesterName + '</div>' +
        '</div>';

    var infoRows =
        '<tr><td class="lbl">NAME</td><td class="val name">' + studentName + '</td></tr>' +
        '<tr><td class="lbl">ROLL NUMBER</td><td class="val">' + rollNo + '</td></tr>' +
        '<tr><td class="lbl">COURSE</td><td class="val">' + courseName + '</td></tr>' +
        '<tr><td class="lbl">SEMESTER</td><td class="val">' + semesterName + '</td></tr>' +
        '<tr><td class="lbl">EXAM</td><td class="val">' + examName + '</td></tr>' +
        '<tr><td class="lbl">EMAIL</td><td class="val">' + email + '</td></tr>';

    var infoPhotoRow =
        '<div class="info-photo-row">' +
        '<div class="info-table"><table>' + infoRows + '</table></div>' +
        '<div class="photo-sig-box">' +
        '<div class="photo-box"><span style="font-size:9px;color:#888;text-align:center;display:block;padding-top:40px;">Photo<br>Not Available</span></div>' +
        '<div class="sig-box"><span>Signature</span></div>' +
        '</div>' +
        '</div>';

    var notes =
        '<div class="notes-row">' +
        '<p><b>NOTE:-</b> MOBILE PHONE &amp; OTHER ELECTRONIC DEVICES NOT ALLOWED IN THE EXAMINATION HALL</p>' +
        '<p><b>REMARK:-</b> CANDIDATE WILL BE ADMITTED TO THE EXAMINATION HALL ONLY ON PRODUCTION OF ADMIT CARD.</p>' +
        '</div>';

    // Roll list — single subject row using examName as the paper
    var subRows =
        '<tr>' +
        '<td style="text-align:center;">1</td>' +
        '<td class="subject-col">' + examName + '</td>' +
        '<td style="text-align:center;">&mdash;</td>' +
        '<td style="text-align:center;">&mdash;</td>' +
        '<td style="text-align:center;">10:00 AM TO 01:00 PM</td>' +
        '<td style="text-align:center;">NIA, JAIPUR</td>' +
        '</tr>';

    var examProg =
        '<div class="exam-prog-box">' +
        '<div class="exam-prog-title">Examination Programme for Subject(s) offered</div>' +
        '<table class="exam-prog-table">' +
        '<thead><tr>' +
        '<th style="width:30px;">S.No</th>' +
        '<th>Subject</th>' +
        '<th style="width:80px;">Exam Date</th>' +
        '<th style="width:65px;">Exam Day</th>' +
        '<th style="width:110px;">Exam Time</th>' +
        '<th style="width:80px;">Exam Center</th>' +
        '</tr></thead>' +
        '<tbody>' + subRows + '</tbody>' +
        '</table></div>';

    var confirmRow = '<div class="confirm-row">All details in the admission card is correct</div>';

    var sigRow =
        '<div class="sig-row">' +
        '<div class="sig-col"><div class="sig-line"></div>Full Signature Of Candidate</div>' +
        '<div class="sig-col"><div class="sig-line"></div>Signature of Centre Supdt.</div>' +
        '<div class="sig-col-right"><div class="prof-name">Prof. Ashok Kumar</div><div>Controller of Examination</div></div>' +
        '</div>';

    var body = header + examTitleBox + infoPhotoRow + notes + examProg + confirmRow + sigRow + _buildImportantNotes();

    _openAdmitCardWindow('Roll: ' + rollNo, body);
}