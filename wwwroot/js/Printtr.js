function printTable() {
    var pageEl = document.querySelector('.page');
    if (!pageEl) { alert('Ledger table not found.'); return; }

    var examName = document.getElementById('ExamnameId')
        ? document.getElementById('ExamnameId').innerText.trim() : '';
    var logoSrc = '/Logo/nia_logo.png';

    // ── 1. COLLECT STUDENT ROW GROUPS ──────────────────────────────────────
    var allRows = Array.from(pageEl.querySelectorAll('.ledger tbody tr'));
    var studentGroups = [];
    var current = [];

    allRows.forEach(function (tr) {
        var firstTd = tr.querySelector('td:first-child');
        var isSnoRow = firstTd && firstTd.getAttribute('rowspan') && firstTd.textContent.trim() !== '';
        if (isSnoRow && current.length > 0) {
            studentGroups.push(current);
            current = [];
        }
        current.push(tr.outerHTML);
    });
    if (current.length > 0) studentGroups.push(current);

    // ── 2. GET THEAD — column count bhi nikalo ──────────────────────────────
    var theadEl = pageEl.querySelector('.ledger thead');
    var theadHTML = theadEl ? theadEl.outerHTML : '';
    // Column count: thead ki pehli row ke th count karo (colspan consider karke)
    var colCount = 0;
    if (theadEl) {
        var firstRow = theadEl.querySelector('tr:first-child');
        if (firstRow) {
            Array.from(firstRow.querySelectorAll('th')).forEach(function (th) {
                colCount += (parseInt(th.getAttribute('colspan')) || 1);
            });
        }
    }
    if (colCount === 0) colCount = 20; // fallback

    // ── 3. PAGINATION — 5 students per page ────────────────────────────────
    var PER_PAGE = 5;
    var totalPages = Math.ceil(studentGroups.length / PER_PAGE);
    if (totalPages === 0) totalPages = 1;

    // ── 4. TFOOT HTML — yahi har page pe repeat hoga ───────────────────────
    // tfoot = table-footer-group — browser isko har page ke end pe print karta hai
    var tfootHTML = '<tfoot>'
        + '<tr>'
        + '<td colspan="' + colCount + '" style="border:none !important; padding:0 !important;">'
        + '<div style="display:grid;grid-template-columns:45% repeat(5,1fr);'
        + 'border:1.5px solid #222;border-top:1.5px solid #222;">'
        + '<div style="padding:5px 6px;font-size:7pt;line-height:1.55;font-weight:normal;text-align:left;">'
        + '<b>Note.</b><br/>'
        + '1. For candidate to pass, he/she shall require to obtain a minimum of 50% marks in each of Theory examination.<br/>'
        + '2. The candidate securing 65% marks or above in a subject shall be declared to have obtained First Class(Denoted by I) in that Subject.<br/>'
        + '3. The candidate securing 75% marks or above in a subject shall be declared to have obtained distinction(Denoted by D)in that Subject.<br/>'
        + '4. A candidate failing in the Theory part of a paper will be considered fail in Theory.'
        + '</div>'
        + '<div style="border-left:1.5px solid #222;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font-size:8pt;font-weight:bold;min-height:60px;">Tabulator</div>'
        + '<div style="border-left:1.5px solid #222;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font-size:8pt;font-weight:bold;min-height:60px;">DCOE</div>'
        + '<div style="border-left:1.5px solid #222;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font-size:8pt;font-weight:bold;min-height:60px;text-align:center;">Controller of<br/>Examinations</div>'
        + '<div style="border-left:1.5px solid #222;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font-size:8pt;font-weight:bold;min-height:60px;">Registrar</div>'
        + '<div style="border-left:1.5px solid #222;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font-size:8pt;font-weight:bold;min-height:60px;">Vice Chancellor</div>'
        + '</div>'
        + '</td>'
        + '</tr>'
        + '</tfoot>';

    // ── 5. HEADER BUILDER ───────────────────────────────────────────────────
    function buildHeader(pNum, pTotal) {
        return '<div class="top">'
            + '<div class="logo"><img src="' + logoSrc + '" /></div>'
            + '<div class="heading">'
            + '<h2>NATIONAL INSTITUTE OF AYURVEDA, JAIPUR</h2>'
            + '<p>Deemed to be University</p>'
            + '<p>(Ministry of AYUSH, Govt. of India)</p>'
            + '<p>Jorawar Singh Gate, Amer Road, Jaipur-302002</p>'
            + '<h4>' + examName + '</h4>'
            + '<h3>TABULATION REGISTER/LEDGER</h3>'
            + '</div>'
            + '<div class="page-no">Page: ' + pNum + ' / ' + pTotal + '</div>'
            + '</div>'
            + '<div class="issue-date">Date of Issue : .....................</div>';
    }

    // ── 6. BUILD BODY ───────────────────────────────────────────────────────
    var bodyHTML = '';

    for (var p = 0; p < totalPages; p++) {
        var start = p * PER_PAGE;
        var end = Math.min(start + PER_PAGE, studentGroups.length);

        if (p > 0) {
            bodyHTML += '<div style="page-break-before:always;break-before:page;"></div>';
        }

        // Header
        bodyHTML += buildHeader(p + 1, totalPages);

        // TABLE — thead + tbody + tfoot
        // tfoot = display:table-footer-group — browser isko page ke end pe rakhta hai
        bodyHTML += '<table class="ledger">';
        bodyHTML += theadHTML;
        bodyHTML += tfootHTML;   // ← tfoot thead ke baad, tbody se PEHLE
        bodyHTML += '<tbody>';
        for (var i = start; i < end; i++) {
            studentGroups[i].forEach(function (r) { bodyHTML += r; });
        }
        bodyHTML += '</tbody>';
        bodyHTML += '</table>';
    }

    // ── 7. CSS ──────────────────────────────────────────────────────────────
    var CSS = [
        '@page { size: A4 landscape; margin: 5mm 5mm; }',
        '* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
        'html, body { margin: 0; padding: 0; background: #fff; font-family: Arial, Helvetica, sans-serif; color: #000; }',

        // Header
        '.top { display: grid; grid-template-columns: 100px 1fr 130px; align-items: center; text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 3px; page-break-inside: avoid; break-inside: avoid; }',
        '.logo { display: flex; justify-content: center; align-items: center; }',
        '.logo img { width: 75px; height: 75px; object-fit: contain; }',
        '.heading h2 { margin: 0; font-size: 15pt; font-weight: bold; }',
        '.heading p  { margin: 2px 0; font-size: 8pt; font-weight: 600; }',
        '.heading h4 { margin: 4px 0 2px; font-size: 9pt; font-weight: bold; }',
        '.heading h3 { margin: 0; font-size: 9.5pt; font-weight: bold; }',
        '.page-no { border: 2px solid #333; padding: 4px 10px; font-weight: bold; font-size: 9pt; text-align: center; align-self: start; margin-top: 6px; }',
        '.issue-date { text-align: right; font-size: 8pt; font-weight: bold; margin: 2px 0 3px 0; }',

        // Table base
        '.ledger { width: 100%; border-collapse: collapse; table-layout: fixed; font-weight: 700; }',
        '.ledger th, .ledger td { border: 1px solid #111; font-size: 7.5pt; font-weight: 700; padding: 1px 2px; vertical-align: middle; text-align: center; overflow: hidden; word-wrap: break-word; }',

        // thead repeats on every page, tfoot repeats on every page bottom
        '.ledger thead { display: table-header-group; }',
        '.ledger tbody { display: table-row-group; }',
        '.ledger tfoot { display: table-footer-group; }',
        '.ledger tbody tr { page-break-inside: avoid; break-inside: avoid; }',

        // Header row 1 — bottom border none (merges with row 2), outer borders intact
        '.ledger thead tr:first-child th { height: 20px; font-size: 8pt; font-weight: bold; background: #fff; border-bottom: none; }',
        // Header row 2 — vertical text, top border none (merges with row 1)
        '.ledger thead tr:nth-child(2) th { height: 130px; font-size: 7pt; background: #fff; border-top: none; border-left: none; border-right: none; }',
        // Outer left/right border of thead row 2 must stay
        '.ledger thead tr:nth-child(2) th:first-child { border-left: 1px solid #111 !important; }',
        '.ledger thead tr:nth-child(2) th:last-child  { border-right: 1px solid #111 !important; }',

        // Column widths
        '.ledger th:nth-child(1), .ledger td:nth-child(1) { width: 30px; }',
        '.ledger th:nth-child(2), .ledger td:nth-child(2) { width: 120px; font-size: 8pt; }',
        '.ledger th:nth-child(3), .ledger td:nth-child(3) { width: 28px; }',
        '.ledger th:nth-child(4), .ledger td:nth-child(4) { width: 185px; text-align: left; padding-left: 3px; }',
        '.ledger th:nth-child(5), .ledger td:nth-child(5) { width: 80px; border-right: none; }',
        '.ledger th:nth-last-child(2), .ledger td:nth-last-child(2) { width: 52px; font-size: 8pt; }',
        '.ledger th:last-child, .ledger td:last-child { width: 56px; font-size: 8pt; }',

        // Middle marks cols
        '.ledger tbody td:nth-child(n+4):nth-child(-n+18) { border-left: none; border-right: none; padding-left: 4px; padding-right: 1px; text-align: center; }',

        // Vertical text
        '.vertical-col { writing-mode: vertical-rl !important; text-orientation: mixed !important; transform: none !important; white-space: normal !important; text-align: center !important; vertical-align: middle !important; line-height: 1.3 !important; padding: 2px !important; }',

        // Border helpers
        '.subject-head { border-right: none !important; }',
        '.unique-code  { border-left: none !important; }',
        '.group-head   { border-left: none !important; border-right: none !important; }',
        '.no-side      { border-left: none !important; border-right: none !important; }',
        '.s1           { text-align: left !important; }',
        '.ledger tbody td { line-height: 1.4; }',
        '.ledger tbody td hr { border: none; border-top: 1px dashed #aaa; margin: 1px 0; }',
    ].join('\n');

    // ── 8. FULL HTML ─────────────────────────────────────────────────────────
    var fullHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
        + '<title>Tabulation Register</title>'
        + '<style>' + CSS + '</style>'
        + '</head><body>'
        + bodyHTML
        + '</body></html>';

    // ── 9. IFRAME & PRINT ────────────────────────────────────────────────────
    $('#printIframe').remove();
    var iframe = document.createElement('iframe');
    iframe.id = 'printIframe';
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:297mm;height:210mm;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write(fullHTML);
    doc.close();

    iframe.onload = function () {
        setTimeout(function () {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(function () { $('#printIframe').remove(); }, 2500);
        }, 1400);
    };
}
