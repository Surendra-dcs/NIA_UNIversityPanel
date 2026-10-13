function printResultSheet(data, meta, logoUrl) {

    const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const fmtDate = v => v ? new Date(v).toLocaleDateString('en-GB') : '';

    const rows = data.map((s, i) => `
        <tr>
            <td class="c">${i + 1}</td>
            <td class="c">${esc(s.rollNumber)}</td>
            <td class="c">${esc(s.enrollmentNumber)}</td>
            <td class="n">${esc(s.candidateName)}</td>
            <td>${esc(s.fatherName)}</td>
            <td>${esc(s.motherName)}</td>
            <td class="c">${fmtDate(s.dateOfBirth)}</td>
            <td class="c b">${esc(s.grandTotal)}</td>
            <td class="c b">${esc(s.result)}</td>
        </tr>`).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Result Sheet - ${esc(meta.course)} - ${esc(meta.sem)}</title>
<style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; }
    body { font-family: "Times New Roman", serif; color: #000; margin: 0; font-size: 12px; }

    .hdr { display: flex; align-items: center; justify-content: center; gap: 16px;
           border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
    .hdr img { height: 62px; width: auto; }
    .hdr .t { text-align: center; }
    .hdr h1 { margin: 0; font-size: 22px; letter-spacing: .5px; }
    .hdr p { margin: 2px 0 0; font-size: 13px; }
    .hdr h2 { margin: 4px 0 0; font-size: 15px; text-decoration: underline; }

    .meta { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .meta td { border: 1px solid #000; padding: 4px 8px; font-size: 12px; }
    .meta td.k { background: #eee; font-weight: bold; width: 11%; }

    table.res { width: 100%; border-collapse: collapse; }
    table.res th, table.res td { border: 1px solid #000; padding: 4px 6px; font-size: 11px; }
    table.res th { background: #e5e5e5; text-transform: uppercase; font-size: 10.5px; }
    table.res thead { display: table-header-group; }
    table.res tr { page-break-inside: avoid; }
    .c { text-align: center; }
    .n { font-weight: bold; }
    .b { font-weight: bold; }

    .sum { margin-top: 8px; font-size: 12px; }
    .sum b { margin-right: 18px; }

    .sign { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 30px;
            page-break-inside: avoid; }
    .sign div { text-align: center; border-top: 1px solid #000; padding-top: 4px;
                min-width: 190px; font-weight: bold; }
    .foot { margin-top: 14px; font-size: 10px; color: #444; text-align: right; }
</style>
</head>
<body>
    <div class="hdr">
        <img src="${logoUrl}" alt="" onerror="this.style.display='none'">
        <div class="t">
            <h1>NATIONAL INSTITUTE OF AYURVEDA</h1>
            <p>Deemed To Be University (De Novo) &mdash; Jaipur</p>
            <h2>RESULT SHEET</h2>
        </div>
    </div>

    <table class="meta">
        <tr>
            <td class="k">Exam</td><td>${esc(meta.exam)}</td>
            <td class="k">Course</td><td>${esc(meta.course)}</td>
        </tr>
        <tr>
            <td class="k">Semester</td><td>${esc(meta.sem)}</td>
            <td class="k">Batch</td><td>${esc(meta.batch)}</td>
        </tr>
    </table>

    <table class="res">
        <thead>
            <tr>
                <th style="width:4%">#</th>
                <th style="width:9%">Roll No.</th>
                <th style="width:12%">Enrollment No.</th>
                <th style="width:18%">Candidate Name</th>
                <th style="width:16%">Father Name</th>
                <th style="width:16%">Mother Name</th>
                <th style="width:8%">DOB</th>
                <th style="width:8%">Grand Total</th>
                <th style="width:7%">Result</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>

    <div class="sum">
        <b>Total Students: ${meta.total}</b>
        <b>Pass: ${meta.pass}</b>
        <b>Fail: ${meta.fail}</b>
        <b>Pass %: ${meta.pct}%</b>
    </div>

    <div class="sign">
        <div>Prepared By</div>
        <div>Verified By</div>
        <div>Controller of Examinations</div>
    </div>

    <div class="foot">Printed on: ${new Date().toLocaleString('en-GB')}</div>
</body>
</html>`;

    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(frame);

    const doc = frame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(function () {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        setTimeout(function () { frame.remove(); }, 1500);
    }, 500);
}