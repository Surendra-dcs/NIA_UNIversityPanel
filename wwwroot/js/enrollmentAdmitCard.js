// ── enrollmentAdmitCard.js ───────────────────────────────────────
// wwwroot/js/enrollmentAdmitCard.js
//
// Public API:
//   printEnrollment(data)       → Print button on enrollmentform view
//                                  data = StudentEnrollmentModel (camelCase JSON)
//   printRollAdmitCard(data)    → Print Admit Card button on rolllist view
//                                  data = Rolllist (camelCase JSON)
//
// printEnrollment layout now mirrors enrollmentForm.js exactly:
//   Header → Info+Photo panel → Previous Exam table →
//   Document list → Declaration → Footer
//   Two copies: Office Copy + Student Copy on one print job.
// ─────────────────────────────────────────────────────────────────


// ── Helper: resolve image URL from a relative server path ────────
function _resolveImgUrl(path) {
    if (!path || path.trim() === '') return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    var base = (typeof ApiBaseUrl !== 'undefined')
        ? ApiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
        : '';
    return base + (path.startsWith('/') ? path : '/' + path);
}


// ════════════════════════════════════════════════════════════════
// ■  SECTION 1 — ENROLLMENT FORM  (printEnrollment)
//    Layout mirrors enrollmentForm.js exactly.
//    Data source: StudentEnrollmentModel (camelCase from API)
// ════════════════════════════════════════════════════════════════

function printEnrollment(data) {

    // ── Field mapping from StudentEnrollmentModel ─────────────────
    var enrollNo = data.enrollmentNumber || '—';
    var formNo = data.formNumber || (data.id ? String(data.id).padStart(7, '0') : '—');
    var aadhaarNo = data.aadhaarNumber || '—';
    var abcId = data.abcId || '—';
    var attempt = data.attempt || '—';

    var studentName = (data.studentName || '—').toUpperCase();
    var studentNameHindi = data.studentNameHindi || '';
    var fatherName = (data.fatherName || '—').toUpperCase();
    var fatherNameHindi = data.fatherNameHindi || '';
    var motherName = (data.motherName || '—').toUpperCase();
    var motherNameHindi = data.motherNameHindi || '';

    var gender = data.gender ? data.gender.toUpperCase() : '—';
    var dob = data.dateOfBirth || '—';
    var mobile = data.mobile || '—';
    var email = data.email || '—';
    var category = data.category || '—';
    var pwdCategory = data.pwdCategory || 'NO';
    var religion = data.religion || '—';

    // Address: district + state (mirrors enrollmentForm.js pattern)
    var addressParts = [data.district, data.state].filter(function (s) { return s && s.trim(); });
    var address = addressParts.join(', ') || '—';

    var collegeName = data.collegeName || '—';
    var programName = data.programName || '—';
    var courseName = data.courseName || '—';

    // ── Photo & Signature ────────────────────────────────────────
    var photoSrc = _resolveImgUrl(data.candidateImagePath || '');
    var sigSrc = _resolveImgUrl(data.signatureImagePath || '');

    var photoHtml = photoSrc
        ? '<img src="' + photoSrc + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;" ' +
        'onerror="this.onerror=null;this.style.display=\'none\';" />' +
        '<span class="photo-fallback" style="font-size:10px;color:#aaa;display:none;text-align:center;padding:10px;">Photo</span>'
        : '<span style="font-size:10px;color:#aaa;text-align:center;display:block;padding:10px;">Photo</span>';

    var sigHtml = sigSrc
        ? '<img src="' + sigSrc + '" alt="Signature" style="max-width:100%;max-height:100%;object-fit:contain;" ' +
        'onerror="this.style.display=\'none\';" />'
        : '';

    // ── Print date ───────────────────────────────────────────────
    var now = new Date();
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var hh = now.getHours(), mm = now.getMinutes();
    var ampm = hh < 12 ? 'AM' : 'PM';
    var printDate = now.getDate() + ' ' + monthNames[now.getMonth()] + ' ' + now.getFullYear()
        + ', ' + dayNames[now.getDay()]
        + ' ' + hh + ':' + (mm < 10 ? '0' + mm : mm) + ' ' + ampm;

    // ── CSS (mirrors enrollmentForm.js exactly) ───────────────────
    var css =
        "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap');" +
        "@page { size: A4; margin: 0; }" +
        "* { margin: 0; padding: 0; box-sizing: border-box; }" +
        "body { background: #ccc; font-family: Arial, sans-serif; font-size: 12px; }" +

        // PAGE
        ".page {" +
        "  width: 210mm; min-height: 297mm; margin: 10mm auto;" +
        "  background: #fff; padding: 5mm 6mm;" +
        "  box-shadow: 0 0 8px rgba(0,0,0,.35); position: relative;" +
        "}" +
        ".outer-border { border: 2px solid #000; position: relative; }" +


        // copy label
        ".copy-label {" +
        "  position: absolute; top: 6px; right: 8px;" +
        "  font-size: 11px; font-weight: bold;" +
        "}" +

        // HEADER
        ".header {" +
        "  display: flex; align-items: center; gap: 10px;" +
        "  padding: 8px 12px 6px; border-bottom: 2px solid #000;" +
        "}" +
        ".logo-wrap { width: 68px; flex-shrink: 0; }" +
        ".logo-wrap img { width: 64px; height: 64px; object-fit: contain; }" +
        ".header-text { flex: 1; text-align: center; }" +
        ".h-inst { font-size: 22px; font-weight: bold; color: #c00; letter-spacing: .3px; }" +
        ".h-type { font-size: 16px; font-weight: bold; color: #c00; margin-top: 1px; }" +
        ".h-exam { font-size: 13px; font-weight: bold; color: #000; margin-top: 4px; line-height: 1.4; }" +

        // INFO + PHOTO
        ".info-section { display: flex; border-bottom: 1px solid #000; }" +
        ".info-left { flex: 1; padding: 6px 10px; border-right: 1px solid #000; }" +
        ".info-left table { width: 100%; border-collapse: collapse; }" +
        ".info-left td { padding: 2.5px 0; font-size: 12px; vertical-align: top; }" +
        ".lbl { font-weight: bold; white-space: nowrap; width: 118px; padding-right: 8px; }" +
        ".val-bold { font-size: 14px; font-weight: bold; }" +
        ".val-hindi { font-family: 'Noto Sans Devanagari', Arial, sans-serif; font-size: 13px; font-weight: 600; }" +

        // right panel
        ".info-right { width: 188px; flex-shrink: 0; display: flex; flex-direction: column; }" +
        ".id-box { padding: 6px 8px; border-bottom: 1px solid #000; }" +
        ".id-row { padding: 3px 0; border-bottom: 1px solid #000; }" +
        ".id-row:last-child { border-bottom: none; }" +
        ".id-label { font-size: 11px; font-weight: bold; }" +
        ".id-value { font-size: 13px; font-weight: 900; word-break: break-all; display: block; }" +

        ".photo-outer {" +
        "  flex: 1; display: flex; flex-direction: column;" +
        "  align-items: center; padding: 8px 6px 4px; gap: 4px;" +
        "}" +
        ".photo-box {" +
        "  width: 112px; height: 138px; border: 1px solid #888; overflow: hidden;" +
        "  display: flex; align-items: center; justify-content: center; background: #f5f5f5;" +
        "}" +
        ".photo-box img { width: 100%; height: 100%; object-fit: cover; }" +
        ".sig-box {" +
        "  width: 152px; height: 40px; border-top: 1px solid #000;" +
        "  display: flex; align-items: center; justify-content: center;" +
        "  overflow: hidden; margin-top: 4px;" +
        "}" +
        ".sig-box img { max-width: 100%; max-height: 100%; object-fit: contain; }" +

        // SECTION TITLE
        ".section-title {" +
        "  font-size: 12px; font-weight: bold; text-align: center;" +
        "  padding: 4px 8px;" +
        "  border-top: 1px solid #000; border-bottom: 1px solid #000;" +
        "  background: #f9f9f9;" +
        "}" +

        // PREVIOUS EXAM TABLE
        ".prev-table { width: 100%; border-collapse: collapse; font-size: 12px; }" +
        ".prev-table th, .prev-table td { border: 1px solid #000; padding: 4px 8px; text-align: center; }" +
        ".prev-table th { font-weight: bold; background: #f0f0f0; }" +

        // DOCUMENT LIST
        ".doc-section { padding: 5px 10px; border-bottom: 1px solid #000; }" +
        ".doc-section p { font-size: 12px; font-weight: bold; margin-bottom: 3px; }" +
        ".doc-section .doc-text { font-size: 12px; font-weight: normal; line-height: 1.5; }" +

        // DECLARATION
        ".decl-section { padding: 5px 10px; font-size: 12px; border-bottom: 1px solid #000; }" +
        ".decl-title { font-weight: bold; margin-bottom: 4px; }" +
        ".sig-candidate {" +
        "  text-align: right; font-weight: bold; font-size: 12px;" +
        "  margin-top: 20px; padding-right: 10px;" +
        "}" +

        // FOOTER
        ".page-footer {" +
        "  border-top: 1px solid #000; padding: 3px 8px;" +
        "  font-size: 9px; color: #333;" +
        "  display: flex; justify-content: space-between;" +
        "}" +

        // ACTION BAR
        ".action-bar {" +
        "  background: #f8f8f8; border: 1px solid #ddd; border-radius: 6px;" +
        "  padding: 10px 16px; margin: 0 auto 16px; max-width: 820px;" +
        "  display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap;" +
        "}" +
        ".btn-action {" +
        "  padding: 8px 22px; border: 2px solid #c00; border-radius: 4px;" +
        "  font-size: 13px; font-weight: 600; cursor: pointer;" +
        "  font-family: Arial, sans-serif; display: inline-flex; align-items: center; gap: 6px;" +
        "}" +
        ".btn-dl { background: #c00; color: #fff; }" +
        ".btn-dl:hover { background: #900; }" +
        ".btn-pr { background: #fff; color: #c00; }" +
        ".btn-pr:hover { background: #f5f5f5; }" +

        "@media print {" +
        "  body { background: #fff; }" +
        "  .no-print { display: none !important; }" +
        "  .page { margin: 0; box-shadow: none; padding: 3mm 5mm; page-break-after: always; }" +
        "  .page:last-child { page-break-after: auto; }" +
        "  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }" +
        "}";

    // ── Page builder (mirrors enrollmentForm.js buildPage) ────────
    function buildPage(copyLabel) {

        // Name row with optional Hindi sub-row
        function nameRow(label, eng, hindi) {
            var html =
                '<tr>' +
                '<td class="lbl">' + label + '</td>' +
                '<td><span class="val-bold">' + eng + '</span>' +
                (hindi ? ' / <span class="val-hindi val-bold">' + hindi + '</span>' : '') +
                '</td></tr>';
            return html;
        }

        // Generic row
        function row(label, value) {
            return '<tr><td class="lbl">' + label + '</td><td>' + (value || '—') + '</td></tr>';
        }

        return '' +
            '<div class="page">' +
            '<div class="outer-border">' +
            '<div class="copy-label">' + copyLabel + '</div>' +

            // ── HEADER ──────────────────────────────────────────
            '<div class="header">' +
            '<div class="logo-wrap">' +
            '<img src="/images/nia_logo.png" alt="NIA Logo" onerror="this.style.display=\'none\'" />' +
            '</div>' +
            '<div class="header-text">' +
            '<div class="h-inst">NATIONAL INSTITUTE OF AYURVEDA</div>' +
            '<div class="h-type">ENROLLMENT FORM</div>' +
            (courseName !== '—' ? '<div class="h-exam">' + courseName + '</div>' : '') +
            '</div>' +
            '</div>' +

            // ── INFO + PHOTO ─────────────────────────────────────
            '<div class="info-section">' +

            '<div class="info-left">' +
            '<table>' +
            nameRow("Student's Name", studentName, studentNameHindi) +
            nameRow("Father's Name", fatherName, fatherNameHindi) +
            nameRow("Mother's Name", motherName, motherNameHindi) +
            row('Gender', gender) +
            row('Date of Birth', dob) +
            row('Mobile', mobile) +
            row('Email-Id', email) +
            row('Category', category) +
            row('PwD Category', pwdCategory) +
            row('Religion', religion) +
            row('Aadhar No.', aadhaarNo) +
            row('Address', address) +
            row('College', collegeName) +
            row('Program', programName) +
            row('Course', courseName) +
            '</table>' +
            '</div>' +

            '<div class="info-right">' +
            // ID box: Form No / ABCID / Enrol No (matches enrollmentForm.js id-box)
            '<div class="id-box">' +
            '<div class="id-row">' +
            '<span class="id-label">Form No : </span>' +
            '<span class="id-value">' + formNo + '</span>' +
            '</div>' +
            '<div class="id-row">' +
            '<span class="id-label">ABCID : </span>' +
            '<span class="id-value">' + abcId + '</span>' +
            '</div>' +
            '<div class="id-row">' +
            '<span class="id-label">Enrol. No : </span>' +
            '<span class="id-value">' + '-------' + '</span>' +
            '</div>' +
            '</div>' +
            // Photo + Signature
            '<div class="photo-outer">' +
            '<div class="photo-box">' + photoHtml + '</div>' +
            '<div class="sig-box">' + sigHtml + '</div>' +
            '</div>' +
            '</div>' +

            '</div>' +   // /info-section

            // ── PREVIOUS EXAM TABLE ──────────────────────────────
            '<div class="section-title">Previous examination details appeared in this University</div>' +
            '<table class="prev-table">' +
            '<thead><tr>' +
            '<th>University / Board</th>' +
            '<th>Roll No.</th>' +
            '<th>Result</th>' +
            '<th>Year</th>' +
            '<th>Month</th>' +
            '<th>Attempt</th>' +
            '<th>Subjects</th>' +
            '</tr></thead>' +
            '<tbody><tr>' +
            '<td>' + (data.lastExamUniversity || '&nbsp;') + '</td>' +
            '<td>' + (data.lastExamRollNumber || '&nbsp;') + '</td>' +
            '<td>' + (data.lastExamResult || '&nbsp;') + '</td>' +
            '<td>' + (data.lastExamYear || '&nbsp;') + '</td>' +
            '<td>' + (data.lastExamMonth || '&nbsp;') + '</td>' +
            '<td>' + (data.lastExamAttempt || attempt) + '</td>' +
            '<td>' + (data.lastExamSubjects || '&nbsp;') + '</td>' +
            '</tr></tbody>' +
            '</table>' +

            // ── DOCUMENT LIST ────────────────────────────────────
            '<div class="doc-section">' +
            '<p>List of documents to be enclosed for the verification</p>' +
            '<div class="doc-text">1. Certificates of Matriculation, Higher Secondary, BAMS, ' +
            'Category Certificate issued from the competent authority, Internship Certificate, ' +
            'State/Central/Registration Certificate, Migration Certificate (Original), Aadhaar Card Copy, ' +
            'Passport copy (for Foreign Student), No Objection Certificate for In Service Candidates, ' +
            'Differently-abled Certificate, Disability Certificate, 2 Passport Size Photographs ' +
            '(Without glasses or Spectacles), Passport size photograph of parents/guardian, ' +
            'Marks sheets of qualifying examination.</div>' +
            '</div>' +

            // ── DECLARATION ──────────────────────────────────────
            '<div class="decl-section">' +
            '<div class="decl-title">Declaration</div>' +
            '<p>I Hereby declare that the information mentioned in this application is correct and true to the best ' +
            'of my knowledge and belief and I understand that furnishing false/improper information will lead to ' +
            'rejection and cancellation of my candidature and also that I am liable for legal and/or disciplinary ' +
            'action as may be initiated by National Institute of Ayurveda, Deemed To Be University (De Novo) Jaipur.</p>' +
            '<div class="sig-candidate">Signature of the Candidate</div>' +
            '</div>' +

            // ── FOOTER ───────────────────────────────────────────
            '<div class="page-footer">' +
            '<span>IP Address :- ' + (window.location ? window.location.hostname : '') + '</span>' +
            '<span>Print Date : ' + printDate + '</span>' +
            '</div>' +

            '</div>' +   // /outer-border
            '</div>';    // /page
    }

    // ── Action bar ───────────────────────────────────────────────
    var actionBar =
        '<div class="action-bar no-print">' +
        '<button class="btn-action btn-dl" onclick="window.print()">&#128190; Download Enrollment Form</button>' +
        '<button class="btn-action btn-pr" onclick="window.print()">&#128424; Print Form</button>' +
        '<span style="font-size:11px;color:#888;margin-left:8px;">or press Ctrl+P to save/print</span>' +
        '</div>';

    // ── Full HTML — Office Copy then Student Copy ─────────────────
    var html =
        '<!DOCTYPE html><html lang="en"><head>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1.0">' +
        '<title>Enrollment Form \u2014 ' + enrollNo + '</title>' +
        '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap" rel="stylesheet">' +
        '<style>' + css + '</style>' +
        '</head><body>' +
        actionBar +
        buildPage('Office Copy') +
        buildPage('Student Copy') +
        actionBar +
        '</body></html>';

    var w = window.open('', '_blank');
    if (w) {
        w.document.write(html);
        w.document.close();
    } else {
        alert('Pop-up blocked. Please allow pop-ups to download the enrollment form.');
    }
}


// ════════════════════════════════════════════════════════════════
// ■  SECTION 2 — ROLL LIST ADMIT CARD  (printRollAdmitCard)
//    NIA admit card format.
//    Data source: Rolllist (camelCase from API)
// ════════════════════════════════════════════════════════════════

function _admitCardCss() {
    return '' +
        "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap');" +
        '* { margin:0; padding:0; box-sizing:border-box; }' +
        'body { background:#f0f0f0; font-family:Arial,sans-serif; font-size:11px; }' +
        '.page { width:210mm; margin:10mm auto; background:#fff; }' +
        '.container { border:2px solid #000; }' +
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
        '.header-right td { padding:2px; }' +
        '.header-right .label { font-weight:bold; white-space:nowrap; }' +
        '.header-right .roll-value { font-size:14px; font-weight:bold; }' +
        '.exam-title-box { border-bottom:2px solid #000; text-align:center; padding:4px 6px; }' +
        '.exam-title-box .main-title { font-size:12px; font-weight:bold; letter-spacing:0.3px; }' +
        '.exam-title-box .sub-title { font-size:11px; font-style:italic; margin-top:1px; }' +
        '.info-photo-row { display:flex; border-bottom:1px solid #000; }' +
        '.info-table { flex:1; }' +
        '.info-table table { width:100%; border-collapse:collapse; }' +
        '.info-table tr td { padding:4px 8px; vertical-align:middle; border-bottom:1px solid #eee; }' +
        '.info-table .lbl { font-weight:bold; font-size:11px; width:140px; white-space:nowrap; border-right:1px solid #ddd; }' +
        '.info-table .val { font-size:11px; }' +
        '.info-table .name { font-size:14px; font-weight:bold; }' +
        '.photo-sig-box { width:160px; flex-shrink:0; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:6px; gap:6px; border-left:2px solid #000; }' +
        '.photo-box { width:120px; height:140px; border:1px solid #999; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#f5f5f5; font-size:10px; color:#888; text-align:center; }' +
        '.photo-box img { width:100%; height:100%; object-fit:cover; }' +
        '.sig-box { width:120px; height:40px; border:1px solid #aaa; display:flex; align-items:center; justify-content:center; font-size:9px; color:#888; overflow:hidden; }' +
        '.sig-box img { max-width:100%; max-height:100%; object-fit:contain; }' +
        '.notes-row { border-top:1px solid #000; border-bottom:2px solid #000; padding:3px 8px; }' +
        '.notes-row p { font-size:10.5px; margin:1px 0; }' +
        '.exam-prog-box { border-bottom:2px solid #000; }' +
        '.exam-prog-title { font-size:11px; font-weight:bold; padding:3px 8px; border-bottom:1.5px solid #000; background:#f9f9f9; }' +
        '.exam-prog-table { width:100%; border-collapse:collapse; font-size:11px; }' +
        '.exam-prog-table th { border:1px solid #000; padding:4px 6px; font-weight:bold; text-align:center; background:#f0f0f0; }' +
        '.exam-prog-table td { border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle; }' +
        '.exam-prog-table td.subject-col { text-align:left; }' +
        '.confirm-row { border-bottom:2px solid #000; padding:4px 8px; font-size:12px; font-weight:bold; }' +
        '.sig-row { border-bottom:2px solid #000; display:flex; justify-content:space-between; align-items:flex-end; padding:8px 20px; }' +
        '.sig-col { text-align:center; font-size:12px; }' +
        '.sig-line { border-bottom:1px solid #000; min-width:140px; margin-bottom:3px; height:22px; }' +
        '.sig-col-right { text-align:right; font-size:12px; }' +
        '.sig-col-right .prof-name { font-weight:bold; font-size:14px; }' +
        '.important-notes { border-bottom:2px solid #000; padding:5px 8px; }' +
        '.important-notes .note-heading { font-size:13px; font-weight:bold; color:#000; margin-bottom:5px; }' +
        '.important-notes ol { padding-left:18px; margin:0; }' +
        '.important-notes ol li { font-size:9px; margin-bottom:2.5px; line-height:1.4; }' +
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

function _buildImportantNotes() {
    return '' +
        '<div class="important-notes">' +
        '<div class="note-heading">Note:-</div>' +
        '<ol>' +
        '<li style="font-size:12px;font-weight:bold;color:#ff1111;margin-bottom:4px;font-family:\'Noto Sans Devanagari\',Arial,sans-serif;">' +
        '\u092f\u0926\u093f \u0906\u092a\u0915\u0947 \u0939\u093f\u0928\u094d\u0926\u0940 \u0935 \u0905\u0902\u0917\u094d\u0930\u0947\u091c\u0940 \u0928\u093e\u092e \u092e\u0947\u0902 \u0915\u094b\u0908 \u0924\u094d\u0930\u0941\u091f\u093f \u0939\u0948 \u0924\u094b \u092a\u0930\u0940\u0915\u094d\u0937\u093e \u0905\u0928\u0941\u092d\u093e\u0917 \u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930 \u0909\u0938\u0947 \u0938\u0939\u0940 \u0915\u0930\u0935\u093e\u090f\u0902' +
        '</li>' +
        '<li>This admit card is being issued as per the existing details filled earlier by you in the examination form. Later if your entitlement is found against/beyond the scheme of examination, your result will not be declared considering your provisional appearance in examination as null and void.</li>' +
        '<li>Examination dates may be changed due to unavoidable circumstances.</li>' +
        '<li>Candidate must ensure that he/she fulfills the requirements of attendance (minimum 75%) &amp; failing which his University examination shall be cancelled.</li>' +
        '<li>Candidate is advised to bring his/her Valid ID Card (like Aadhar/Pan Card/Voter ID Card) along with this admit card.</li>' +
        '<li>On the first day of examination, the examination hall will open half an hour before the scheduled time and in the remaining days it will open 15 minutes before and will be closed after the scheduled time of commencement of the examination.</li>' +
        '<li>Each candidate will have to sit at the designated place where he will get an answer book for writing answers to the questions.</li>' +
        '<li>Within the examination period, every candidate will be under the discipline and authority of the Superintendent (Examination Centre) and will follow all the instructions related to the examination.</li>' +
        '<li>Candidates should read the question paper and the instructions written on it carefully before writing the answers.</li>' +
        '<li>No guarantee is given to the candidates regarding the order of question papers.</li>' +
        '<li>Complaint against question paper(s) if any, should be submitted along with Question Paper to the University through the Center Superintendent concerned within <b>24 hours</b> from the date of examination.</li>' +
        '<li>Candidates are warned not to mark their Roll Number, Name or any other mark anywhere on the inside of their Answer Book other than the answers.</li>' +
        '<li>No candidate will leave his seat before the end of the examination without special permission of the Centre Superintendent.</li>' +
        '<li>Candidates found using unfair means will be liable for serious action as per rules.</li>' +
        '</ol>' +
        '</div>';
}

function printRollAdmitCard(data) {

    // ── Field mapping from Rolllist model ────────────────────────
    var rollNo = data.rollNumber || '—';
    var enrollNo = data.enrollmentNumber || '—';
    var studentName = data.userName || '—';
    var email = data.email || '—';
    var courseName = data.courseName || '—';
    var semesterName = data.semesterName || '—';
    var examName = data.examName || '—';
    var gender = data.gender ? data.gender.toUpperCase() : '—';

    // ── Photo & Signature from Rolllist ──────────────────────────
    var photoSrc = _resolveImgUrl(data.candidateImagePath || '');
    var sigSrc = _resolveImgUrl(data.signatureImagePath || '');

    var photoHtml = photoSrc
        ? '<img src="' + photoSrc + '" alt="Photo" onerror="this.parentElement.innerHTML=\'<span style=\\\"font-size:9px;color:#888;text-align:center;display:block;padding-top:40px;\\\">Photo<br>Not Available</span>\';" />'
        : '<span style="font-size:9px;color:#888;text-align:center;display:block;padding-top:40px;">Photo<br>Not Available</span>';

    var sigHtml = sigSrc
        ? '<img src="' + sigSrc + '" alt="Signature" />'
        : 'Signature';

    var header =
        '<div class="header">' +
        '<div class="header-logo"><img src="/images/nia_logo.png" alt="NIA Logo" onerror="this.style.display=\'none\'" /></div>' +
        '<div class="header-center">' +
        '<div class="inst-name">NATIONAL INSTITUTE OF AYURVEDA</div>' +
        '<div class="inst-sub">Deemed to be University</div>' +
        '<div class="inst-ministry">(Ministry of AYUSH, Govt. of India)</div>' +
        '<div class="inst-address">Jorawar Singh Gate, Amer Road, Jaipur-302002</div>' +
        '<div class="perm-title"><b>(PROVISIONALLY ALLOWED)</b> PERMISSION LETTER CUM ADMISSION CARD</div>' +
        '</div>' +
        '<div class="header-right"><table>' +
        '<tr><td class="label">ROLL NO.:</td><td class="roll-value">' + rollNo + '</td></tr>' +
        '<tr><td class="label">ENROL NO.:</td><td style="font-weight:bold;font-size:10px;">' + enrollNo + '</td></tr>' +
        '<tr><td class="label">SEMESTER:</td><td style="font-weight:bold;font-size:10px;">' + semesterName + '</td></tr>' +
        '<tr><td class="label">GENDER:</td><td style="font-weight:bold;font-size:10px;">' + gender + '</td></tr>' +
        '</table></div>' +
        '</div>';

    var body = header +
        '<div class="exam-title-box">' +
        '<div class="main-title">' + examName + '</div>' +
        '<div class="sub-title">' + courseName + ' &nbsp;|&nbsp; Semester: ' + semesterName + '</div>' +
        '</div>' +
        '<div class="info-photo-row">' +
        '<div class="info-table"><table>' +
        '<tr><td class="lbl">NAME</td><td class="val name">' + studentName + '</td></tr>' +
        '<tr><td class="lbl">ROLL NUMBER</td><td class="val">' + rollNo + '</td></tr>' +
        '<tr><td class="lbl">ENROL. NO.</td><td class="val">' + enrollNo + '</td></tr>' +
        '<tr><td class="lbl">COURSE</td><td class="val">' + courseName + '</td></tr>' +
        '<tr><td class="lbl">SEMESTER</td><td class="val">' + semesterName + '</td></tr>' +
        '<tr><td class="lbl">EXAM</td><td class="val">' + examName + '</td></tr>' +
        '<tr><td class="lbl">GENDER</td><td class="val">' + gender + '</td></tr>' +
        '<tr><td class="lbl">EMAIL</td><td class="val">' + email + '</td></tr>' +
        '</table></div>' +
        '<div class="photo-sig-box">' +
        '<div class="photo-box">' + photoHtml + '</div>' +
        '<div class="sig-box">' + sigHtml + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="notes-row">' +
        '<p><b>NOTE:-</b> MOBILE PHONE &amp; OTHER ELECTRONIC DEVICES NOT ALLOWED IN THE EXAMINATION HALL</p>' +
        '<p><b>REMARK:-</b> CANDIDATE WILL BE ADMITTED TO THE EXAMINATION HALL ONLY ON PRODUCTION OF ADMIT CARD.</p>' +
        '</div>' +
        '<div class="exam-prog-box">' +
        '<div class="exam-prog-title">Examination Programme for Subject(s) offered</div>' +
        '<table class="exam-prog-table">' +
        '<thead><tr>' +
        '<th style="width:30px;">S.No</th><th>Subject</th>' +
        '<th style="width:80px;">Exam Date</th><th style="width:65px;">Exam Day</th>' +
        '<th style="width:110px;">Exam Time</th><th style="width:80px;">Exam Center</th>' +
        '</tr></thead>' +
        '<tbody><tr>' +
        '<td>1</td><td class="subject-col">' + examName + '</td>' +
        '<td>&mdash;</td><td>&mdash;</td><td>10:00 AM TO 01:00 PM</td><td>NIA, JAIPUR</td>' +
        '</tr></tbody>' +
        '</table>' +
        '</div>' +
        '<div class="confirm-row">All details in the admission card is correct</div>' +
        '<div class="sig-row">' +
        '<div class="sig-col"><div class="sig-line"></div>Full Signature Of Candidate</div>' +
        '<div class="sig-col"><div class="sig-line"></div>Signature of Centre Supdt.</div>' +
        '<div class="sig-col-right">' +
        '<div class="prof-name">Prof. Ashok Kumar</div>' +
        '<div>Controller of Examination</div>' +
        '</div>' +
        '</div>' +
        _buildImportantNotes();

    var actionBar =
        '<div class="action-bar no-print">' +
        '<button class="btn-action btn-dl" onclick="window.print()">&#128190; Download / Print Admit Card</button>' +
        '<button class="btn-action btn-pr" onclick="window.print()">&#128424; Print</button>' +
        '<span style="font-size:11px;color:#888;margin-left:8px;">or press Ctrl+P to save as PDF</span>' +
        '</div>';

    var html =
        '<!DOCTYPE html><html lang="en"><head>' +
        '<meta charset="UTF-8">' +
        '<title>Admit Card \u2014 Roll: ' + rollNo + '</title>' +
        '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap" rel="stylesheet">' +
        '<style>' + _admitCardCss() + '</style>' +
        '</head><body>' +
        actionBar +
        '<div class="page"><div class="container">' + body + '</div></div>' +
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