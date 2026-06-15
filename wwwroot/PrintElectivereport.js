function printTable() {
    var table = $('#studentTable').DataTable();
    var allRows = table.rows().nodes();

    var subjectName = $('#subjectId option:selected').text().trim();
    var examName = $('#examId').text().trim();
    var ElectiveMaxMarks = $('#Elective_maxmarks').text().trim();

    var rowsHTML = '';
    $(allRows).each(function (index) {
        var studentName = $(this).find('td:eq(1)').text().trim();
        var enrollmentNo = $(this).find('td:eq(2)').text().trim();
        var rollNumber = $(this).find('td:eq(3)').text().trim();
        var electiveMarks = $(this).find('td:eq(4)').text().trim();

        rowsHTML += '<tr>'
            + '<td style="text-align:center;">' + (index + 1) + '</td>'
            + '<td style="text-align:left;font-weight:bold;">' + studentName + '</td>'
            + '<td style="text-align:center;">' + enrollmentNo + '</td>'
            + '<td style="text-align:center;">' + rollNumber + '</td>'
            + '<td style="text-align:center;">' + electiveMarks + '</td>'
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
    parts.push('<html><head><title>Elective Marks </title>');
    parts.push('<style>');
    parts.push('* { box-sizing: border-box; margin: 0; padding: 0; }');
    parts.push('body { font-family: Arial, sans-serif; font-size: 11px; background: white; }');
    parts.push('.outer-box { border: 2px solid #000; margin: 8mm 8mm; padding: 8px 10px; }');
    parts.push('.inst-header { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 4px; min-height: 72px; }');
    parts.push('.inst-logo { position: absolute; left: 0; top: 0; }');
    parts.push('.inst-logo img { width: 65px; height: 65px; object-fit: contain; }');
    parts.push('.inst-header-text { text-align: center; width: 100%; }');
    parts.push('.inst-header-text h1 { font-size: 15px; font-weight: bold; color: #000; letter-spacing: 0.4px; margin-bottom: 1px; }');
    parts.push('.inst-header-text p { font-size: 10.5px; color: #222; margin: 1px 0; }');
    parts.push('.inst-header-text .exam-line { font-size: 11px; font-weight: bold; margin-top: 3px; }');
    parts.push('.inst-header-text .award-line { font-size: 11px; font-weight: bold; margin-top: 1px; }');
    parts.push('hr.divider { border: none; border-top: 1px solid #000; margin: 4px 0; }');

    parts.push('table.main-table { width: 100%; border-collapse: collapse; font-size: 10.5px; table-layout: fixed; }');
    parts.push('table.main-table th { border: 1px solid #000; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 10.5px; vertical-align: middle; background: #fff; }');
    parts.push('table.main-table td { border: 1px solid #000; padding: 0 4px; font-size: 10.5px; vertical-align: middle; height: 26px; }');
    parts.push('.sub-label { font-size: 9.5px; font-weight: normal; display: block; }');
    parts.push('.sign-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 35px; font-size: 11px; page-break-inside: avoid; }');
    parts.push('.sign-box { width: 44%; }');
    parts.push('.sign-box-title { font-size: 11px; font-weight: bold; margin-bottom: 25px; }');
    parts.push('.sign-line { border-top: 1px solid #000; width: 100%; margin-bottom: 3px; }');
    parts.push('.with-name { display: flex; align-items: center; gap: 5px; font-size: 10.5px; margin-top: 7px; }');
    parts.push('.name-line { flex: 1; border-bottom: 1px dotted #000; height: 13px; min-width: 0; }');
    parts.push('.date-row { display: flex; align-items: center; gap: 5px; font-size: 10.5px; margin-top: 7px; }');
    parts.push('.date-line { flex: 1; border-bottom: 1px dotted #000; height: 13px; min-width: 0; }');

    parts.push('@media print {');
    parts.push('@page { size: A4 portrait; margin: 0; }');
    parts.push('body { margin: 0; padding: 0; }');
    parts.push('.outer-box { margin: 6mm 8mm; border: 2px solid #000; padding: 6px 10px; }');
    parts.push('table.main-table thead { display: table-header-group; }');
    parts.push('table.main-table tbody { display: table-row-group; }');
    parts.push('table.main-table tr { page-break-inside: avoid; }');
    parts.push('.sign-section { page-break-inside: avoid; }');
    parts.push('}');
    parts.push('</style></head><body>');

    parts.push('<div class="outer-box">');

    // Header
    parts.push('<div class="inst-header">');
    parts.push('<div class="inst-logo"><img src="/Logo/nia_logo.png"/></div>');
    parts.push('<div class="inst-header-text">');
    parts.push('<h1>NATIONAL INSTITUTE OF AYURVEDA</h1>');
    parts.push('<p>Deemed to be University</p>');
    parts.push('<p>(Ministry of AYUSH, Govt. of India)</p>');
    parts.push('<p>Jorawar Singh Gate, Amer Road, Jaipur-302002</p>');
    parts.push('<p class="exam-line">' + examName + '</p>');
    parts.push('<p class="award-line">Elective Marks of Practical Paper -: ' + subjectName + '</p>');
    parts.push('</div>');
    parts.push('</div>');

    // Table
    parts.push('<table class="main-table">');
    parts.push('<thead>');
    parts.push('<tr>');
    parts.push('<th style="width:6%;">S.No</th>');
    parts.push('<th style="width:32%;">Student Name</th>');
    parts.push('<th style="width:22%;">Enrollment No.</th>');
    parts.push('<th style="width:15%;">Roll Number</th>');
    parts.push('<th style="width:25%;">Elective Marks<span class="sub-label">' + ElectiveMaxMarks + '</span></th>');
    parts.push('</tr>');
    parts.push('</thead>');
    parts.push('<tbody>' + rowsHTML + '</tbody>');
    parts.push('</table>');

    // Signature
    parts.push('<div class="sign-section" style="justify-content:center;">');
    parts.push('<div class="sign-box" style="width:44%;text-align:center;">');
    parts.push('<div class="sign-box-title">Full Signature Of DEAN.</div>');
    parts.push('<div class="sign-line"></div>');
    parts.push('<div class="with-name"><span>With Name</span><span class="name-line"></span></div>');
    parts.push('<div class="date-row"><span>Date</span><span class="date-line"></span></div>');
    parts.push('</div>');
    parts.push('</div>');


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