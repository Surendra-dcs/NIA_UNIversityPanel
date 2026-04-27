// ── enrollmentAdmitCard.js ───────────────────────────────────────
// Place at: wwwroot/js/enrollmentAdmitCard.js
//
// Public functions:
//   printEnrollment(data)       → Print button on enrollmentform view
//   printRollAdmitCard(data)    → Print Admit Card button on rolllist view
//
// printEnrollment now uses all rich fields from tbl_StudentExamInfoMaster
// joined in StudentEnrollmentService: aadhaarNumber, gender, dateOfBirth,
// candidateImagePath, signatureImagePath, Hindi names, etc.
// ─────────────────────────────────────────────────────────────────

// ── Helper: resolve image URL from a relative server path ────────
// ApiBaseUrl is a global JS variable already defined in your layout.
function _resolveImgUrl(path) {
    if (!path || path.trim() === '') return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // ApiBaseUrl ends with '/' e.g. "https://localhost:7001/api/"
    // Image paths are relative to the API root, not the /api/ sub-path
    var base = (typeof ApiBaseUrl !== 'undefined')
        ? ApiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
        : '';
    return base + (path.startsWith('/') ? path : '/' + path);
}


// ════════════════════════════════════════════════════════════════
// ■  SECTION 1 — ENROLLMENT FORM  (printEnrollment)
//    Two copies: Office Copy + Student Copy on one print job.
//    Sections: header, info+photo, previous exam table,
//    subjects, fees, document list, declaration, dean sign-off.
// ════════════════════════════════════════════════════════════════

function printEnrollment(data) {

    // ── Map all fields — rich fields now available from JOIN ─────
    var enrollNo = data.enrollmentNumber || '—';
    var formNo = data.formNumber || (data.id ? String(data.id).padStart(7, '0') : '—');
    var aadhaarNo = data.aadhaarNumber || '—';
    var abcId = data.abcId || '—';
    var attempt = data.attempt || '—';

    var studentName = data.studentName || '—';
    var studentNameHindi = data.studentNameHindi || '';
    var fatherName = data.fatherName || '—';
    var fatherNameHindi = data.fatherNameHindi || '';
    var motherName = data.motherName || '—';
    var motherNameHindi = data.motherNameHindi || '';

    var gender = data.gender ? data.gender.toUpperCase() : '—';
    var dob = data.dateOfBirth || '—';
    var mobile = data.mobile || '—';
    var email = data.email || '—';
    var category = data.category || '—';
    var pwdCategory = data.pwdCategory || 'No';
    var religion = data.religion || '—';
    var state = data.state || '';
    var district = data.district || '';
    var address = [district, state].filter(function (s) { return s && s.trim(); }).join(', ') || '—';

    var collegeName = data.collegeName || '—';
    var programName = data.programName || '—';
    var courseName = data.courseName || '—';

    // ── Photo & Signature ────────────────────────────────────────
    var photoSrc = _resolveImgUrl(data.candidateImagePath || '');
    var sigSrc = _resolveImgUrl(data.signatureImagePath || '');

    var photoHtml = photoSrc
        ? '<img src="' + photoSrc + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;" ' +
        'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span style=\\\"font-size:10px;color:#aaa;padding:10px;text-align:center;display:block;\\\">Photo</span>\';" />'
        : '<span style="font-size:10px;color:#aaa;padding:10px;text-align:center;display:block;">Photo</span>';

    var sigHtml = sigSrc
        ? '<img src="' + sigSrc + '" alt="Signature" style="max-width:100%;max-height:100%;object-fit:contain;" ' +
        'onerror="this.style.display=\'none\';" />'
        : '<span style="font-size:9px;color:#aaa;">Signature</span>';

    // ── Fee / transaction (placeholder — not in enrollment model) ─
    var txnId = '—';
    var txnDate = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    var examFee = 'Rs. 500';
    var appFee = 'Rs. 100';
    var lateFee = 'Rs. 0';
    var totalFee = 'Rs. 600';

    // ── CSS — matches enrollmentForm.js exactly ──────────────────
    var css = '' +
        '@page { size: A4; margin: 8mm 10mm; }' +
        '* { margin: 0; padding: 0; box-sizing: border-box; }' +
        'body { font-family: Arial, sans-serif; font-size: 12px; background: #ccc; }' +

        '.page {' +
        '  width: 210mm; min-height: 297mm; margin: 10mm auto;' +
        '  background: #fff; padding: 5mm 7mm;' +
        '  box-shadow: 0 0 8px rgba(0,0,0,0.35); position: relative;' +
        '}' +
        '.outer-border { border: 2px solid #000; }' +

        '.copy-label {' +
        '  position: absolute; top: 5mm; right: 10mm;' +
        '  font-size: 11px; font-weight: bold;' +
        '  padding: 2px 6px; border: 1px solid #000;' +
        '}' +

        /* HEADER */
        '.header {' +
        '  display: flex; align-items: center; gap: 10px;' +
        '  padding: 10px 12px 6px; border-bottom: 2px solid #000;' +
        '}' +
        '.logo-wrap { width: 70px; flex-shrink: 0; }' +
        '.logo-wrap img { width: 65px; height: 65px; object-fit: contain; }' +
        '.header-text { flex: 1; text-align: center; }' +
        '.h-inst { font-size: 22px; font-weight: bold; color: #c00; letter-spacing: 0.4px; }' +
        '.h-type { font-size: 16px; font-weight: bold; color: #c00; margin-top: 2px; }' +
        '.h-exam { font-size: 13px; font-weight: bold; color: #000; margin-top: 4px; }' +

        /* INFO + PHOTO */
        '.info-section { display: flex; border-bottom: 1px solid #000; }' +
        '.info-left { flex: 1; padding: 6px 10px; border-right: 1px solid #000; }' +
        '.info-left table { width: 100%; border-collapse: collapse; }' +
        '.info-left td { padding: 2.5px 0; font-size: 12px; vertical-align: top; }' +
        '.lbl { font-weight: bold; white-space: nowrap; width: 120px; padding-right: 8px; }' +
        '.student-name { font-size: 14px; font-weight: bold; }' +
        '.hindi { font-family: "Noto Sans Devanagari", Arial, sans-serif; font-size: 13px; }' +

        '.info-right { width: 195px; flex-shrink: 0; display: flex; flex-direction: column; }' +
        '.form-roll-box {' +
        '  padding: 6px 8px; border-bottom: 1px solid #000;' +
        '  font-size: 12px; line-height: 1.8;' +
        '}' +
        '.fr-label { font-weight: bold; }' +
        '.fr-value-big { font-size: 14px; font-weight: 900; }' +

        '.photo-outer {' +
        '  flex: 1; display: flex; flex-direction: column;' +
        '  align-items: center; padding: 8px 6px 4px; gap: 4px;' +
        '}' +
        '.photo-box {' +
        '  width: 115px; height: 140px; border: 1px solid #888; overflow: hidden;' +
        '  display: flex; align-items: center; justify-content: center;' +
        '  background: #f5f5f5; font-size: 10px; color: #999; text-align: center;' +
        '}' +
        '.sig-box {' +
        '  width: 155px; height: 40px; border-top: 1px solid #000;' +
        '  display: flex; align-items: center; justify-content: center;' +
        '  overflow: hidden; margin-top: 4px; font-size: 9px; color: #aaa;' +
        '}' +

        /* PREVIOUS EXAM TABLE */
        '.section-title {' +
        '  font-size: 12px; font-weight: bold; text-align: center;' +
        '  padding: 4px 8px; border-bottom: 1px solid #000; background: #f9f9f9;' +
        '}' +
        '.prev-table { width: 100%; border-collapse: collapse; font-size: 12px; }' +
        '.prev-table th, .prev-table td { border: 1px solid #000; padding: 4px 8px; text-align: center; }' +
        '.prev-table th { font-weight: bold; background: #f0f0f0; }' +

        /* SUBJECTS */
        '.subj-heading {' +
        '  font-size: 12px; font-weight: bold; padding: 4px 10px;' +
        '  border-top: 1px solid #000; border-bottom: 1px solid #000; background: #f9f9f9;' +
        '}' +
        '.subj-table { width: 100%; border-collapse: collapse; font-size: 12px; }' +
        '.subj-table th, .subj-table td { border: 1px solid #000; padding: 3px 8px; }' +
        '.subj-table th { text-align: center; font-weight: bold; background: #f0f0f0; }' +
        '.subj-table td.code { text-align: center; width: 140px; }' +
        '.subj-table td.name { text-align: left; }' +

        /* FEES */
        '.fees-title {' +
        '  font-size: 12px; font-weight: bold; text-align: center; padding: 4px;' +
        '  border-top: 1px solid #000; border-bottom: 1px solid #000; background: #f9f9f9;' +
        '}' +
        '.fees-row {' +
        '  display: flex; justify-content: space-between; align-items: center;' +
        '  padding: 4px 16px; font-size: 12px; border-bottom: 1px solid #000; gap: 8px;' +
        '}' +
        '.fees-row span { flex: 1; text-align: center; }' +
        '.fees-total {' +
        '  text-align: center; font-size: 12px; font-weight: bold;' +
        '  padding: 3px 8px; border-bottom: 1px solid #000;' +
        '}' +

        /* DOCUMENT LIST */
        '.doc-list-section { padding: 5px 10px; border-bottom: 1px solid #000; }' +
        '.doc-list-section p { font-size: 12px; margin-bottom: 3px; font-weight: bold; }' +
        '.doc-list-section ul { list-style: none; font-size: 12px; padding-left: 0; }' +
        '.doc-list-section ul li { margin-bottom: 1px; }' +

        /* DECLARATION */
        '.decl-section {' +
        '  padding: 5px 10px; font-size: 12px;' +
        '  border-bottom: 1px solid #000; color: #444;' +
        '}' +
        '.decl-title { font-weight: bold; color: #000; margin-bottom: 4px; }' +
        '.sig-candidate {' +
        '  text-align: right; font-weight: bold; font-size: 12px;' +
        '  margin-top: 18px; padding-right: 10px;' +
        '}' +

        /* DEAN */
        '.dean-section { padding: 5px 10px; font-size: 12px; }' +
        '.dean-section p { font-weight: bold; margin: 2px 0; font-size: 12px; }' +
        '.dean-certify {' +
        '  font-weight: normal !important; margin-top: 4px;' +
        '  font-size: 12px; line-height: 1.5; color: #444;' +
        '}' +
        '.sig-dean {' +
        '  text-align: right; font-weight: bold; font-size: 12px;' +
        '  margin-top: 18px; padding-right: 10px;' +
        '}' +

        /* ACTION BAR */
        '.action-bar {' +
        '  background: #f8f8f8; border: 1px solid #ddd; border-radius: 6px;' +
        '  padding: 10px 16px; margin: 0 auto 16px; max-width: 800px;' +
        '  display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap;' +
        '}' +
        '.btn-action {' +
        '  padding: 8px 22px; border: 2px solid #c00; border-radius: 4px;' +
        '  font-size: 13px; font-weight: 600; cursor: pointer;' +
        '  font-family: Arial, sans-serif; display: inline-flex; align-items: center; gap: 6px;' +
        '}' +
        '.btn-dl { background: #c00; color: #fff; }' +
        '.btn-dl:hover { background: #900; }' +
        '.btn-pr { background: #fff; color: #c00; }' +
        '.btn-pr:hover { background: #f5f5f5; }' +

        '@media print {' +
        '  body { background: #fff; }' +
        '  .no-print { display: none !important; }' +
        '  .page { margin: 0; box-shadow: none; page-break-after: always; }' +
        '  .page:last-child { page-break-after: auto; }' +
        '  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
        '}';

    // ── Build one copy (Office Copy / Student Copy) ───────────────
    function buildPage(copyLabel) {

        // Name rows — show Hindi name below English if available
        function nameRow(label, eng, hindi) {
            var row = '<tr><td class="lbl">' + label + '</td><td class="student-name">' + eng + '</td></tr>';
            if (hindi) {
                row += '<tr><td class="lbl"></td><td class="hindi">' + hindi + '</td></tr>';
            }
            return row;
        }

        return '' +
            '<div class="page">' +
            '<div class="outer-border">' +
            '<div class="copy-label">' + copyLabel + '</div>' +

            /* HEADER */
            '<div class="header">' +
            '<div class="logo-wrap">' +
            '<img src="/images/nia_logo.png" alt="NIA Logo" onerror="this.style.display=\'none\'" />' +
            '</div>' +
            '<div class="header-text">' +
            '<div class="h-inst">NATIONAL INSTITUTE OF AYURVEDA</div>' +
            '<div class="h-type">Enrollment Form</div>' +
            '<div class="h-exam">' + courseName + '</div>' +
            '</div>' +
            '</div>' +

            /* INFO + PHOTO */
            '<div class="info-section">' +
            '<div class="info-left"><table>' +
            '<tr><td class="lbl">Enrolment No.</td><td>' + enrollNo + '</td></tr>' +
            '<tr><td class="lbl">Aadhar No.</td><td>' + aadhaarNo + '</td></tr>' +
            '<tr><td class="lbl">ABC ID</td><td>' + abcId + '</td></tr>' +
            '<tr><td class="lbl">No of Attempt</td><td>' + attempt + '</td></tr>' +
            nameRow('Student\'s Name', studentName, studentNameHindi) +
            nameRow('Father\'s Name', fatherName, fatherNameHindi) +
            nameRow('Mother\'s Name', motherName, motherNameHindi) +
            '<tr><td class="lbl">Gender</td><td>' + gender + '</td></tr>' +
            '<tr><td class="lbl">Date of Birth</td><td>' + dob + '</td></tr>' +
            '<tr><td class="lbl">Mobile</td><td>' + mobile + '</td></tr>' +
            '<tr><td class="lbl">Email-Id</td><td>' + email + '</td></tr>' +
            '<tr><td class="lbl">Category</td><td>' + category + '</td></tr>' +
            '<tr><td class="lbl">PwD Category</td><td>' + pwdCategory + '</td></tr>' +
            '<tr><td class="lbl">Religion</td><td>' + religion + '</td></tr>' +
            '<tr><td class="lbl">Address</td><td>' + address + '</td></tr>' +
            '<tr><td class="lbl">College</td><td>' + collegeName + '</td></tr>' +
            '<tr><td class="lbl">Program</td><td>' + programName + '</td></tr>' +
            '<tr><td class="lbl">Course</td><td>' + courseName + '</td></tr>' +
            '</table></div>' +

            '<div class="info-right">' +
            '<div class="form-roll-box">' +
            '<div style="border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:6px;">' +
            '<span class="fr-label">Form No : </span>' +
            '<span class="fr-value-big">' + formNo + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="photo-outer">' +
            '<div class="photo-box">' + photoHtml + '</div>' +
            '<div class="sig-box">' + sigHtml + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            /* PREVIOUS EXAM TABLE */
            '<div class="section-title">Previous examination details appeared in this University</div>' +
            '<table class="prev-table">' +
            '<thead><tr>' +
            '<th>Roll No.</th><th>Result</th><th>Exam Month Year</th><th>Attempt</th><th>Subjects Code</th>' +
            '</tr></thead>' +
            '<tbody><tr>' +
            '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>' +
            '</tr></tbody>' +
            '</table>' +

            /* SUBJECTS */
            '<div class="subj-heading">Details of Subjects offered for Examination</div>' +
            '<table class="subj-table">' +
            '<thead><tr>' +
            '<th style="width:140px;">Subject Code</th><th>Subject Name</th>' +
            '</tr></thead>' +
            '<tbody><tr>' +
            '<td class="code">&mdash;</td><td class="name">&mdash;</td>' +
            '</tr></tbody>' +
            '</table>' +

            /* FEES */
            '<div class="fees-title">DETAILS OF FEES</div>' +
            '<div class="fees-row">' +
            '<span>Transaction Number : <strong>' + txnId + '</strong></span>' +
            '<span>Transaction Date : <strong>' + txnDate + '</strong></span>' +
            '</div>' +
            '<div class="fees-row">' +
            '<span>Exam Fee &nbsp; ' + examFee + '</span>' +
            '<span>Application Fee &nbsp; ' + appFee + '</span>' +
            '<span>Late Fee &nbsp; ' + lateFee + '</span>' +
            '</div>' +
            '<div class="fees-total">Total Fee Rs. : ' + totalFee + '</div>' +

            /* DOCUMENT LIST */
            '<div class="doc-list-section">' +
            '<p>List of documents to be enclosed for the verification</p>' +
            '<ul>' +
            '<li>1. Self attested copy of Marksheet of Last Qualifying Examination.</li>' +
            '<li>2. Self attested copy of Aadhar Card</li>' +
            '<li>3. Any other</li>' +
            '</ul>' +
            '</div>' +

            /* DECLARATION */
            '<div class="decl-section">' +
            '<div class="decl-title">Declaration</div>' +
            '<p>Certified that all above entries are correct to the best of my knowledge and belief, I am not appearing in any other University examination and there is no UM case against me. I have deposited prescribed examination fee. Fee once deposited will not be refunded.</p>' +
            '<div class="sig-candidate">Signature of the Candidate</div>' +
            '</div>' +

            /* DEAN */
            '<div class="dean-section">' +
            '<p>1. The candidate has completed the duration of the session.</p>' +
            '<p>2. The candidate\'s attempts have been checked.</p>' +
            '<p>3. The candidate has completed 75% attendance subject wise.</p>' +
            '<p>4. The subjects of the candidate have been examined.</p>' +
            '<p class="dean-certify">I CERTIFY that all entries are checked and verified, that the candidate mentioned above has satisfied me by production of authentic documents, that he/she has fulfilled the conditions laid down under the regulations for eligibility to appear in the aforesaid examination and that he/she bear a good moral character.</p>' +
            '<div class="sig-dean">Signature and seal of Dean</div>' +
            '</div>' +

            '</div>' +  // /outer-border
            '</div>';   // /page
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
        '<!DOCTYPE html><html><head>' +
        '<meta charset="UTF-8">' +
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
//    NIA admit card format — mirrors examRollAdmitCard.js exactly.
// ════════════════════════════════════════════════════════════════

function _admitCardCss() {
    return '' +
        '@import url(\'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap\');' +
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
        '.sig-box { width:120px; height:40px; border:1px solid #aaa; display:flex; align-items:center; justify-content:center; font-size:9px; color:#888; }' +
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
        '<li style="font-size:12px;font-weight:bold;color:#ff1111;margin-bottom:4px;font-family:\'Noto Sans Devanagari\',Arial,sans-serif;">यदि आपके हिंदी व अंग्रेजी नाम में कोई त्रुटि है तो परीक्षा अनुभाग से संपर्क कर उसे सही करवाएं</li>' +
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

    var rollNo = data.rollNumber || '—';
    var studentName = data.userName || '—';
    var email = data.email || '—';
    var courseName = data.courseName || '—';
    var semesterName = data.semesterName || '—';
    var examName = data.examName || '—';

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
        '<tr><td class="label">ENROL NO.:</td><td style="font-weight:bold;font-size:10px;">&mdash;</td></tr>' +
        '<tr><td class="label">SEMESTER:</td><td style="font-weight:bold;font-size:10px;">' + semesterName + '</td></tr>' +
        '<tr><td class="label">GENDER:</td><td style="font-weight:bold;font-size:10px;">&mdash;</td></tr>' +
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
        '<tr><td class="lbl">COURSE</td><td class="val">' + courseName + '</td></tr>' +
        '<tr><td class="lbl">SEMESTER</td><td class="val">' + semesterName + '</td></tr>' +
        '<tr><td class="lbl">EXAM</td><td class="val">' + examName + '</td></tr>' +
        '<tr><td class="lbl">EMAIL</td><td class="val">' + email + '</td></tr>' +
        '</table></div>' +
        '<div class="photo-sig-box">' +
        '<div class="photo-box"><span style="font-size:9px;color:#888;text-align:center;display:block;padding-top:40px;">Photo<br>Not Available</span></div>' +
        '<div class="sig-box">Signature</div>' +
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
        '</table></div>' +
        '<div class="confirm-row">All details in the admission card is correct</div>' +
        '<div class="sig-row">' +
        '<div class="sig-col"><div class="sig-line"></div>Full Signature Of Candidate</div>' +
        '<div class="sig-col"><div class="sig-line"></div>Signature of Centre Supdt.</div>' +
        '<div class="sig-col-right"><div class="prof-name">Prof. Ashok Kumar</div><div>Controller of Examination</div></div>' +
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
}// ── enrollmentAdmitCard.js ───────────────────────────────────────
// Place at: wwwroot/js/enrollmentAdmitCard.js
//
// Public functions:
//   printEnrollment(data)       → Print button on enrollmentform view
//   printRollAdmitCard(data)    → Print Admit Card button on rolllist view
//
// printEnrollment now uses all rich fields from tbl_StudentExamInfoMaster
// joined in StudentEnrollmentService: aadhaarNumber, gender, dateOfBirth,
// candidateImagePath, signatureImagePath, Hindi names, etc.
// ─────────────────────────────────────────────────────────────────

// ── Helper: resolve image URL from a relative server path ────────
// ApiBaseUrl is a global JS variable already defined in your layout.
function _resolveImgUrl(path) {
    if (!path || path.trim() === '') return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // ApiBaseUrl ends with '/' e.g. "https://localhost:7001/api/"
    // Image paths are relative to the API root, not the /api/ sub-path
    var base = (typeof ApiBaseUrl !== 'undefined')
        ? ApiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
        : '';
    return base + (path.startsWith('/') ? path : '/' + path);
}


// ════════════════════════════════════════════════════════════════
// ■  SECTION 1 — ENROLLMENT FORM  (printEnrollment)
//    Two copies: Office Copy + Student Copy on one print job.
//    Sections: header, info+photo, previous exam table,
//    subjects, fees, document list, declaration, dean sign-off.
// ════════════════════════════════════════════════════════════════

function printEnrollment(data) {

    // ── Map all fields — rich fields now available from JOIN ─────
    var enrollNo = data.enrollmentNumber || '—';
    var formNo = data.formNumber || (data.id ? String(data.id).padStart(7, '0') : '—');
    var aadhaarNo = data.aadhaarNumber || '—';
    var abcId = data.abcId || '—';
    var attempt = data.attempt || '—';

    var studentName = data.studentName || '—';
    var studentNameHindi = data.studentNameHindi || '';
    var fatherName = data.fatherName || '—';
    var fatherNameHindi = data.fatherNameHindi || '';
    var motherName = data.motherName || '—';
    var motherNameHindi = data.motherNameHindi || '';

    var gender = data.gender ? data.gender.toUpperCase() : '—';
    var dob = data.dateOfBirth || '—';
    var mobile = data.mobile || '—';
    var email = data.email || '—';
    var category = data.category || '—';
    var pwdCategory = data.pwdCategory || 'No';
    var religion = data.religion || '—';
    var state = data.state || '';
    var district = data.district || '';
    var address = [district, state].filter(function (s) { return s && s.trim(); }).join(', ') || '—';

    var collegeName = data.collegeName || '—';
    var programName = data.programName || '—';
    var courseName = data.courseName || '—';

    // ── Photo & Signature ────────────────────────────────────────
    var photoSrc = _resolveImgUrl(data.candidateImagePath || '');
    var sigSrc = _resolveImgUrl(data.signatureImagePath || '');

    var photoHtml = photoSrc
        ? '<img src="' + photoSrc + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;" ' +
        'onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span style=\\\"font-size:10px;color:#aaa;padding:10px;text-align:center;display:block;\\\">Photo</span>\';" />'
        : '<span style="font-size:10px;color:#aaa;padding:10px;text-align:center;display:block;">Photo</span>';

    var sigHtml = sigSrc
        ? '<img src="' + sigSrc + '" alt="Signature" style="max-width:100%;max-height:100%;object-fit:contain;" ' +
        'onerror="this.style.display=\'none\';" />'
        : '<span style="font-size:9px;color:#aaa;">Signature</span>';

    // ── Fee / transaction (placeholder — not in enrollment model) ─
    var txnId = '—';
    var txnDate = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    var examFee = 'Rs. 500';
    var appFee = 'Rs. 100';
    var lateFee = 'Rs. 0';
    var totalFee = 'Rs. 600';

    // ── CSS — matches enrollmentForm.js exactly ──────────────────
    var css = '' +
        '@page { size: A4; margin: 8mm 10mm; }' +
        '* { margin: 0; padding: 0; box-sizing: border-box; }' +
        'body { font-family: Arial, sans-serif; font-size: 12px; background: #ccc; }' +

        '.page {' +
        '  width: 210mm; min-height: 297mm; margin: 10mm auto;' +
        '  background: #fff; padding: 5mm 7mm;' +
        '  box-shadow: 0 0 8px rgba(0,0,0,0.35); position: relative;' +
        '}' +
        '.outer-border { border: 2px solid #000; }' +

        '.copy-label {' +
        '  position: absolute; top: 5mm; right: 10mm;' +
        '  font-size: 11px; font-weight: bold;' +
        '  padding: 2px 6px; border: 1px solid #000;' +
        '}' +

        /* HEADER */
        '.header {' +
        '  display: flex; align-items: center; gap: 10px;' +
        '  padding: 10px 12px 6px; border-bottom: 2px solid #000;' +
        '}' +
        '.logo-wrap { width: 70px; flex-shrink: 0; }' +
        '.logo-wrap img { width: 65px; height: 65px; object-fit: contain; }' +
        '.header-text { flex: 1; text-align: center; }' +
        '.h-inst { font-size: 22px; font-weight: bold; color: #c00; letter-spacing: 0.4px; }' +
        '.h-type { font-size: 16px; font-weight: bold; color: #c00; margin-top: 2px; }' +
        '.h-exam { font-size: 13px; font-weight: bold; color: #000; margin-top: 4px; }' +

        /* INFO + PHOTO */
        '.info-section { display: flex; border-bottom: 1px solid #000; }' +
        '.info-left { flex: 1; padding: 6px 10px; border-right: 1px solid #000; }' +
        '.info-left table { width: 100%; border-collapse: collapse; }' +
        '.info-left td { padding: 2.5px 0; font-size: 12px; vertical-align: top; }' +
        '.lbl { font-weight: bold; white-space: nowrap; width: 120px; padding-right: 8px; }' +
        '.student-name { font-size: 14px; font-weight: bold; }' +
        '.hindi { font-family: "Noto Sans Devanagari", Arial, sans-serif; font-size: 13px; }' +

        '.info-right { width: 195px; flex-shrink: 0; display: flex; flex-direction: column; }' +
        '.form-roll-box {' +
        '  padding: 6px 8px; border-bottom: 1px solid #000;' +
        '  font-size: 12px; line-height: 1.8;' +
        '}' +
        '.fr-label { font-weight: bold; }' +
        '.fr-value-big { font-size: 14px; font-weight: 900; }' +

        '.photo-outer {' +
        '  flex: 1; display: flex; flex-direction: column;' +
        '  align-items: center; padding: 8px 6px 4px; gap: 4px;' +
        '}' +
        '.photo-box {' +
        '  width: 115px; height: 140px; border: 1px solid #888; overflow: hidden;' +
        '  display: flex; align-items: center; justify-content: center;' +
        '  background: #f5f5f5; font-size: 10px; color: #999; text-align: center;' +
        '}' +
        '.sig-box {' +
        '  width: 155px; height: 40px; border-top: 1px solid #000;' +
        '  display: flex; align-items: center; justify-content: center;' +
        '  overflow: hidden; margin-top: 4px; font-size: 9px; color: #aaa;' +
        '}' +

        /* PREVIOUS EXAM TABLE */
        '.section-title {' +
        '  font-size: 12px; font-weight: bold; text-align: center;' +
        '  padding: 4px 8px; border-bottom: 1px solid #000; background: #f9f9f9;' +
        '}' +
        '.prev-table { width: 100%; border-collapse: collapse; font-size: 12px; }' +
        '.prev-table th, .prev-table td { border: 1px solid #000; padding: 4px 8px; text-align: center; }' +
        '.prev-table th { font-weight: bold; background: #f0f0f0; }' +

        /* SUBJECTS */
        '.subj-heading {' +
        '  font-size: 12px; font-weight: bold; padding: 4px 10px;' +
        '  border-top: 1px solid #000; border-bottom: 1px solid #000; background: #f9f9f9;' +
        '}' +
        '.subj-table { width: 100%; border-collapse: collapse; font-size: 12px; }' +
        '.subj-table th, .subj-table td { border: 1px solid #000; padding: 3px 8px; }' +
        '.subj-table th { text-align: center; font-weight: bold; background: #f0f0f0; }' +
        '.subj-table td.code { text-align: center; width: 140px; }' +
        '.subj-table td.name { text-align: left; }' +

        /* FEES */
        '.fees-title {' +
        '  font-size: 12px; font-weight: bold; text-align: center; padding: 4px;' +
        '  border-top: 1px solid #000; border-bottom: 1px solid #000; background: #f9f9f9;' +
        '}' +
        '.fees-row {' +
        '  display: flex; justify-content: space-between; align-items: center;' +
        '  padding: 4px 16px; font-size: 12px; border-bottom: 1px solid #000; gap: 8px;' +
        '}' +
        '.fees-row span { flex: 1; text-align: center; }' +
        '.fees-total {' +
        '  text-align: center; font-size: 12px; font-weight: bold;' +
        '  padding: 3px 8px; border-bottom: 1px solid #000;' +
        '}' +

        /* DOCUMENT LIST */
        '.doc-list-section { padding: 5px 10px; border-bottom: 1px solid #000; }' +
        '.doc-list-section p { font-size: 12px; margin-bottom: 3px; font-weight: bold; }' +
        '.doc-list-section ul { list-style: none; font-size: 12px; padding-left: 0; }' +
        '.doc-list-section ul li { margin-bottom: 1px; }' +

        /* DECLARATION */
        '.decl-section {' +
        '  padding: 5px 10px; font-size: 12px;' +
        '  border-bottom: 1px solid #000; color: #444;' +
        '}' +
        '.decl-title { font-weight: bold; color: #000; margin-bottom: 4px; }' +
        '.sig-candidate {' +
        '  text-align: right; font-weight: bold; font-size: 12px;' +
        '  margin-top: 18px; padding-right: 10px;' +
        '}' +

        /* DEAN */
        '.dean-section { padding: 5px 10px; font-size: 12px; }' +
        '.dean-section p { font-weight: bold; margin: 2px 0; font-size: 12px; }' +
        '.dean-certify {' +
        '  font-weight: normal !important; margin-top: 4px;' +
        '  font-size: 12px; line-height: 1.5; color: #444;' +
        '}' +
        '.sig-dean {' +
        '  text-align: right; font-weight: bold; font-size: 12px;' +
        '  margin-top: 18px; padding-right: 10px;' +
        '}' +

        /* ACTION BAR */
        '.action-bar {' +
        '  background: #f8f8f8; border: 1px solid #ddd; border-radius: 6px;' +
        '  padding: 10px 16px; margin: 0 auto 16px; max-width: 800px;' +
        '  display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap;' +
        '}' +
        '.btn-action {' +
        '  padding: 8px 22px; border: 2px solid #c00; border-radius: 4px;' +
        '  font-size: 13px; font-weight: 600; cursor: pointer;' +
        '  font-family: Arial, sans-serif; display: inline-flex; align-items: center; gap: 6px;' +
        '}' +
        '.btn-dl { background: #c00; color: #fff; }' +
        '.btn-dl:hover { background: #900; }' +
        '.btn-pr { background: #fff; color: #c00; }' +
        '.btn-pr:hover { background: #f5f5f5; }' +

        '@media print {' +
        '  body { background: #fff; }' +
        '  .no-print { display: none !important; }' +
        '  .page { margin: 0; box-shadow: none; page-break-after: always; }' +
        '  .page:last-child { page-break-after: auto; }' +
        '  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
        '}';

    // ── Build one copy (Office Copy / Student Copy) ───────────────
    function buildPage(copyLabel) {

        // Name rows — show Hindi name below English if available
        function nameRow(label, eng, hindi) {
            var row = '<tr><td class="lbl">' + label + '</td><td class="student-name">' + eng + '</td></tr>';
            if (hindi) {
                row += '<tr><td class="lbl"></td><td class="hindi">' + hindi + '</td></tr>';
            }
            return row;
        }

        return '' +
            '<div class="page">' +
            '<div class="outer-border">' +
            '<div class="copy-label">' + copyLabel + '</div>' +

            /* HEADER */
            '<div class="header">' +
            '<div class="logo-wrap">' +
            '<img src="/images/nia_logo.png" alt="NIA Logo" onerror="this.style.display=\'none\'" />' +
            '</div>' +
            '<div class="header-text">' +
            '<div class="h-inst">NATIONAL INSTITUTE OF AYURVEDA</div>' +
            '<div class="h-type">Enrollment Form</div>' +
            '<div class="h-exam">' + courseName + '</div>' +
            '</div>' +
            '</div>' +

            /* INFO + PHOTO */
            '<div class="info-section">' +
            '<div class="info-left"><table>' +
            '<tr><td class="lbl">Enrolment No.</td><td>' + enrollNo + '</td></tr>' +
            '<tr><td class="lbl">Aadhar No.</td><td>' + aadhaarNo + '</td></tr>' +
            '<tr><td class="lbl">ABC ID</td><td>' + abcId + '</td></tr>' +
            '<tr><td class="lbl">No of Attempt</td><td>' + attempt + '</td></tr>' +
            nameRow('Student\'s Name', studentName, studentNameHindi) +
            nameRow('Father\'s Name', fatherName, fatherNameHindi) +
            nameRow('Mother\'s Name', motherName, motherNameHindi) +
            '<tr><td class="lbl">Gender</td><td>' + gender + '</td></tr>' +
            '<tr><td class="lbl">Date of Birth</td><td>' + dob + '</td></tr>' +
            '<tr><td class="lbl">Mobile</td><td>' + mobile + '</td></tr>' +
            '<tr><td class="lbl">Email-Id</td><td>' + email + '</td></tr>' +
            '<tr><td class="lbl">Category</td><td>' + category + '</td></tr>' +
            '<tr><td class="lbl">PwD Category</td><td>' + pwdCategory + '</td></tr>' +
            '<tr><td class="lbl">Religion</td><td>' + religion + '</td></tr>' +
            '<tr><td class="lbl">Address</td><td>' + address + '</td></tr>' +
            '<tr><td class="lbl">College</td><td>' + collegeName + '</td></tr>' +
            '<tr><td class="lbl">Program</td><td>' + programName + '</td></tr>' +
            '<tr><td class="lbl">Course</td><td>' + courseName + '</td></tr>' +
            '</table></div>' +

            '<div class="info-right">' +
            '<div class="form-roll-box">' +
            '<div style="border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:6px;">' +
            '<span class="fr-label">Form No : </span>' +
            '<span class="fr-value-big">' + formNo + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="photo-outer">' +
            '<div class="photo-box">' + photoHtml + '</div>' +
            '<div class="sig-box">' + sigHtml + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            /* PREVIOUS EXAM TABLE */
            '<div class="section-title">Previous examination details appeared in this University</div>' +
            '<table class="prev-table">' +
            '<thead><tr>' +
            '<th>Roll No.</th><th>Result</th><th>Exam Month Year</th><th>Attempt</th><th>Subjects Code</th>' +
            '</tr></thead>' +
            '<tbody><tr>' +
            '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>' +
            '</tr></tbody>' +
            '</table>' +

            /* SUBJECTS */
            '<div class="subj-heading">Details of Subjects offered for Examination</div>' +
            '<table class="subj-table">' +
            '<thead><tr>' +
            '<th style="width:140px;">Subject Code</th><th>Subject Name</th>' +
            '</tr></thead>' +
            '<tbody><tr>' +
            '<td class="code">&mdash;</td><td class="name">&mdash;</td>' +
            '</tr></tbody>' +
            '</table>' +

            /* FEES */
            '<div class="fees-title">DETAILS OF FEES</div>' +
            '<div class="fees-row">' +
            '<span>Transaction Number : <strong>' + txnId + '</strong></span>' +
            '<span>Transaction Date : <strong>' + txnDate + '</strong></span>' +
            '</div>' +
            '<div class="fees-row">' +
            '<span>Exam Fee &nbsp; ' + examFee + '</span>' +
            '<span>Application Fee &nbsp; ' + appFee + '</span>' +
            '<span>Late Fee &nbsp; ' + lateFee + '</span>' +
            '</div>' +
            '<div class="fees-total">Total Fee Rs. : ' + totalFee + '</div>' +

            /* DOCUMENT LIST */
            '<div class="doc-list-section">' +
            '<p>List of documents to be enclosed for the verification</p>' +
            '<ul>' +
            '<li>1. Self attested copy of Marksheet of Last Qualifying Examination.</li>' +
            '<li>2. Self attested copy of Aadhar Card</li>' +
            '<li>3. Any other</li>' +
            '</ul>' +
            '</div>' +

            /* DECLARATION */
            '<div class="decl-section">' +
            '<div class="decl-title">Declaration</div>' +
            '<p>Certified that all above entries are correct to the best of my knowledge and belief, I am not appearing in any other University examination and there is no UM case against me. I have deposited prescribed examination fee. Fee once deposited will not be refunded.</p>' +
            '<div class="sig-candidate">Signature of the Candidate</div>' +
            '</div>' +

            /* DEAN */
            '<div class="dean-section">' +
            '<p>1. The candidate has completed the duration of the session.</p>' +
            '<p>2. The candidate\'s attempts have been checked.</p>' +
            '<p>3. The candidate has completed 75% attendance subject wise.</p>' +
            '<p>4. The subjects of the candidate have been examined.</p>' +
            '<p class="dean-certify">I CERTIFY that all entries are checked and verified, that the candidate mentioned above has satisfied me by production of authentic documents, that he/she has fulfilled the conditions laid down under the regulations for eligibility to appear in the aforesaid examination and that he/she bear a good moral character.</p>' +
            '<div class="sig-dean">Signature and seal of Dean</div>' +
            '</div>' +

            '</div>' +  // /outer-border
            '</div>';   // /page
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
        '<!DOCTYPE html><html><head>' +
        '<meta charset="UTF-8">' +
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
//    NIA admit card format — mirrors examRollAdmitCard.js exactly.
// ════════════════════════════════════════════════════════════════

function _admitCardCss() {
    return '' +
        '@import url(\'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap\');' +
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
        '.sig-box { width:120px; height:40px; border:1px solid #aaa; display:flex; align-items:center; justify-content:center; font-size:9px; color:#888; }' +
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
        '<li style="font-size:12px;font-weight:bold;color:#ff1111;margin-bottom:4px;font-family:\'Noto Sans Devanagari\',Arial,sans-serif;">यदि आपके हिंदी व अंग्रेजी नाम में कोई त्रुटि है तो परीक्षा अनुभाग से संपर्क कर उसे सही करवाएं</li>' +
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

    var rollNo = data.rollNumber || '—';
    var studentName = data.userName || '—';
    var email = data.email || '—';
    var courseName = data.courseName || '—';
    var semesterName = data.semesterName || '—';
    var examName = data.examName || '—';

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
        '<tr><td class="label">ENROL NO.:</td><td style="font-weight:bold;font-size:10px;">&mdash;</td></tr>' +
        '<tr><td class="label">SEMESTER:</td><td style="font-weight:bold;font-size:10px;">' + semesterName + '</td></tr>' +
        '<tr><td class="label">GENDER:</td><td style="font-weight:bold;font-size:10px;">&mdash;</td></tr>' +
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
        '<tr><td class="lbl">COURSE</td><td class="val">' + courseName + '</td></tr>' +
        '<tr><td class="lbl">SEMESTER</td><td class="val">' + semesterName + '</td></tr>' +
        '<tr><td class="lbl">EXAM</td><td class="val">' + examName + '</td></tr>' +
        '<tr><td class="lbl">EMAIL</td><td class="val">' + email + '</td></tr>' +
        '</table></div>' +
        '<div class="photo-sig-box">' +
        '<div class="photo-box"><span style="font-size:9px;color:#888;text-align:center;display:block;padding-top:40px;">Photo<br>Not Available</span></div>' +
        '<div class="sig-box">Signature</div>' +
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
        '</table></div>' +
        '<div class="confirm-row">All details in the admission card is correct</div>' +
        '<div class="sig-row">' +
        '<div class="sig-col"><div class="sig-line"></div>Full Signature Of Candidate</div>' +
        '<div class="sig-col"><div class="sig-line"></div>Signature of Centre Supdt.</div>' +
        '<div class="sig-col-right"><div class="prof-name">Prof. Ashok Kumar</div><div>Controller of Examination</div></div>' +
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