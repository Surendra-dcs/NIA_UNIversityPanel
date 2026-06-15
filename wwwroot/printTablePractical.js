function printTable() {
    var table = $('#studentTable').DataTable();
    var allRows = table.rows().nodes();

    var subjectName = $('#subjectId option:selected').text().trim();
    var examName = $('#examId').text().trim();
    var pMaxMarks = $('#p_maxmarks').text().trim();
    var vMaxMarks = $('#V_maxmarks').text().trim();

    var rowsHTML = '';
    $(allRows).each(function (index) {
        var studentName = $(this).find('td:eq(1)').text().trim();
        var enrollmentNo = $(this).find('td:eq(2)').text().trim();
        var rollNumber = $(this).find('td:eq(3)').text().trim();
        var attendance = $(this).find('td:eq(4)').text().trim();
        var practical = $(this).find('td:eq(5)').text().trim();
        var viva = $(this).find('td:eq(6)').text().trim();

        rowsHTML += '<tr>'
            + '<td style="text-align:center;">' + (index + 1) + '</td>'
            + '<td style="text-align:left;font-weight:bold;">' + studentName + '</td>'
            + '<td style="text-align:center;">' + enrollmentNo + '</td>'
            + '<td style="text-align:center;">' + rollNumber + '</td>'
            + '<td style="text-align:center;">' + attendance + '</td>'
            + '<td style="text-align:center;">' + practical + '</td>'
            + '<td style="text-align:center;">' + viva + '</td>'
            + '</tr>';
    });

    $('#printIframe').remove();
    var iframe = document.createElement('iframe');
    iframe.id = 'printIframe';
    iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;left:-9999px;top:-9999px;';
    document.body.appendChild(iframe);

    var doc = iframe.contentWindow.document;
    doc.open();

    var parts = [];

    parts.push('<!DOCTYPE html>');
    parts.push('<html><head><title>Award List - Practical / Viva</title>');
    parts.push('<style>');
    parts.push('* { box-sizing: border-box; margin: 0; padding: 0; }');
    parts.push('body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; background: white; }');

    // Outer border box — exactly like image
    parts.push('.outer-box { border: 2px solid #000; padding: 10px 12px 15px 12px; }');

    // Header with logo left, text center
    parts.push('.inst-header { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 4px; }');
    parts.push('.inst-logo { position: absolute; left: 0; top: 0; width: 70px; height: 70px; }');
    parts.push('.inst-header-text { text-align: center; width: 100%; }');
    parts.push('.inst-header-text h1 { font-size: 17px; font-weight: bold; color: #000; letter-spacing: 0.5px; margin-bottom: 2px; }');
    parts.push('.inst-header-text p { font-size: 11px; color: #222; margin: 1px 0; }');
    parts.push('.inst-header-text .exam-line { font-size: 11.5px; font-weight: bold; margin-top: 4px; color: #000; }');
    parts.push('.inst-header-text .award-line { font-size: 11.5px; font-weight: bold; margin-top: 2px; color: #000; }');

    parts.push('hr.divider { border: none; border-top: 1px solid #000; margin: 6px 0; }');

    // Main table
    parts.push('table.main-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 4px; }');
    parts.push('table.main-table th { border: 1px solid #000; padding: 5px 4px; text-align: center; font-weight: bold; background: #fff; font-size: 11px; vertical-align: middle; }');
    parts.push('table.main-table td { border: 1px solid #000; padding: 3px 5px; font-size: 11px; vertical-align: middle; }');
    parts.push('.sub-label { font-size: 10px; font-weight: normal; display: block; }');

    // Signature section
    parts.push('.sign-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; font-size: 12px; }');
    parts.push('.sign-box { width: 44%; }');
    parts.push('.sign-box-title { font-size: 12px; font-weight: bold; margin-bottom: 28px; }');
    parts.push('.sign-line { border-top: 1px solid #000; width: 100%; margin-bottom: 4px; }');
    parts.push('.with-name { display: flex; align-items: center; gap: 6px; font-size: 11px; margin-top: 8px; }');
    parts.push('.name-line { flex: 1; border-bottom: 1px dotted #000; height: 14px; min-width: 0; }');
    parts.push('.date-row { display: flex; align-items: center; gap: 6px; font-size: 11px; margin-top: 8px; }');
    parts.push('.date-line { flex: 1; border-bottom: 1px dotted #000; height: 14px; min-width: 0; }');
    parts.push('.inst-logo { position: absolute; left: 0; top: 0; }');
    parts.push('.inst-logo img { width: 70px; height: 70px; object-fit: contain; }');
    parts.push('@media print {');
    parts.push('@page { size: A4 portrait; margin: 8mm 10mm; }');
    parts.push('body { padding: 0; }');
    parts.push('}');
    parts.push('</style></head><body>');

    // Outer border box start
    parts.push('<div class="outer-box">');

    // Header
    parts.push('<div class="inst-header">');
    parts.push('<div class="inst-logo"><img src="/Logo/nia_logo.png" style="width:70px;height:70px;object-fit:contain;"/></div>');
    parts.push('<div class="inst-header-text">');
    parts.push('<h1>NATIONAL INSTITUTE OF AYURVEDA</h1>');
    parts.push('<p>Deemed to be University</p>');
    parts.push('<p>(Ministry of AYUSH, Govt. of India)</p>');
    parts.push('<p>Jorawar Singh Gate, Amer Road, Jaipur-302002</p>');
    parts.push('<p class="exam-line">' + examName + '</p>');
    parts.push('<p class="award-line">Award list for Practical / Viva Examination With Attendance Paper -: ' + subjectName + '</p>');
    parts.push('</div>');
    parts.push('</div>');


    // Main Table
    parts.push('<table class="main-table">');
    parts.push('<thead>');
    parts.push('<tr>');
    parts.push('<th style="width:5%;">S.No</th>');
    parts.push('<th style="width:23%;">Student Name</th>');
    parts.push('<th style="width:17%;">Enrollment No.</th>');
    parts.push('<th style="width:12%;">Roll Number</th>');
    parts.push('<th style="width:10%;">Attendance</th>');
    parts.push('<th style="width:16%;">Practical Marks<span class="sub-label">' + pMaxMarks + '</span></th>');
    parts.push('<th style="width:17%;">Viva Marks<span class="sub-label">' + vMaxMarks + '</span></th>');
    parts.push('</tr>');
    parts.push('</thead>');
    parts.push('<tbody>' + rowsHTML + '</tbody>');
    parts.push('</table>');

    // Signature Section
    parts.push('<div class="sign-section">');
    parts.push('<div class="sign-box">');
    parts.push('<div class="sign-box-title">Full Signature Of External Examiner.</div>');
    parts.push('<div class="sign-line"></div>');
    parts.push('<div class="with-name"><span>With Name</span><span class="name-line"></span></div>');
    parts.push('<div class="date-row"><span>Date</span><span class="date-line"></span></div>');
    parts.push('</div>');
    parts.push('<div class="sign-box">');
    parts.push('<div class="sign-box-title">Full Signature Of Internal Examiner.</div>');
    parts.push('<div class="sign-line"></div>');
    parts.push('<div class="with-name"><span>With Name</span><span class="name-line"></span></div>');
    parts.push('<div class="date-row"><span>Date</span><span class="date-line"></span></div>');
    parts.push('</div>');
    parts.push('</div>');

    // Outer border box end
    parts.push('</div>');

    parts.push('</body></html>');

    doc.write(parts.join(''));
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(function () {
        iframe.contentWindow.print();
        setTimeout(function () {
            $('#printIframe').remove();
        }, 1000);
    }, 600);
}