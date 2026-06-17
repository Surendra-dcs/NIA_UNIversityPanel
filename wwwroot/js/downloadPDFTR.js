// ═══════════════════════════════════════════════════════════════════
//  SHARED HELPERS — printTable() aur downloadPDF() dono use karte hain
// ═══════════════════════════════════════════════════════════════════

function _buildLedgerHTML() {
    var pageEl = document.querySelector('.page');
    if (!pageEl) { alert('Ledger table not found.'); return null; }

    var examName = document.getElementById('ExamnameId')
        ? document.getElementById('ExamnameId').innerText.trim() : '';
    var logoSrc = '/Logo/nia_logo.png';

    // 1. STUDENT ROW GROUPS
    var allRows = Array.from(pageEl.querySelectorAll('.ledger tbody tr'));
    var studentGroups = [], current = [];
    allRows.forEach(function (tr) {
        var firstTd = tr.querySelector('td:first-child');
        var isSnoRow = firstTd && firstTd.getAttribute('rowspan') && firstTd.textContent.trim() !== '';
        if (isSnoRow && current.length > 0) { studentGroups.push(current); current = []; }
        current.push(tr.outerHTML);
    });
    if (current.length > 0) studentGroups.push(current);

    // 2. THEAD + COL COUNT
    var theadEl = pageEl.querySelector('.ledger thead');
    var theadHTML = theadEl ? theadEl.outerHTML : '';
    var colCount = 0;
    if (theadEl) {
        var firstRow = theadEl.querySelector('tr:first-child');
        if (firstRow) Array.from(firstRow.querySelectorAll('th')).forEach(function (th) {
            colCount += (parseInt(th.getAttribute('colspan')) || 1);
        });
    }
    if (colCount === 0) colCount = 20;

    // 3. PAGINATION
    var PER_PAGE = 5;
    var totalPages = Math.ceil(studentGroups.length / PER_PAGE);
    if (totalPages === 0) totalPages = 1;

    // 4. TFOOT
    var tfootHTML = '<tfoot>'
        + '<tr><td colspan="' + colCount + '" style="border:none !important;padding:0 !important;">'
        + '<div style="display:grid;grid-template-columns:45% repeat(5,1fr);border:1.5px solid #222;border-top:1.5px solid #222;">'
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
        + '</div></td></tr></tfoot>';

    // 5. HEADER
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

    // 6. CSS
    var CSS = [
        '@page { size: A4 landscape; margin: 5mm 5mm; }',
        '* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
        'html, body { margin: 0; padding: 0; background: #fff; font-family: Arial, Helvetica, sans-serif; color: #000; }',
        '.top { display: grid; grid-template-columns: 100px 1fr 130px; align-items: center; text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 3px; page-break-inside: avoid; break-inside: avoid; }',
        '.logo { display: flex; justify-content: center; align-items: center; }',
        '.logo img { width: 75px; height: 75px; object-fit: contain; }',
        '.heading h2 { margin: 0; font-size: 15pt; font-weight: bold; }',
        '.heading p  { margin: 2px 0; font-size: 8pt; font-weight: 600; }',
        '.heading h4 { margin: 4px 0 2px; font-size: 9pt; font-weight: bold; }',
        '.heading h3 { margin: 0; font-size: 9.5pt; font-weight: bold; }',
        '.page-no { border: 2px solid #333; padding: 4px 10px; font-weight: bold; font-size: 9pt; text-align: center; align-self: start; margin-top: 6px; }',
        '.issue-date { text-align: right; font-size: 8pt; font-weight: bold; margin: 2px 0 3px 0; }',
        '.ledger { width: 100%; border-collapse: collapse; table-layout: fixed; font-weight: 700; }',
        '.ledger th, .ledger td { border: 1px solid #111; font-size: 7.5pt; font-weight: 700; padding: 1px 2px; vertical-align: middle; text-align: center; overflow: hidden; word-wrap: break-word; }',
        '.ledger thead { display: table-header-group; }',
        '.ledger tbody { display: table-row-group; }',
        '.ledger tfoot { display: table-footer-group; }',
        '.ledger tbody tr { page-break-inside: avoid; break-inside: avoid; }',
        '.ledger thead tr:first-child th { height: 20px; font-size: 8pt; font-weight: bold; background: #fff; border-bottom: none; border-top: 1px solid #111 !important; }',
        '.ledger thead tr:nth-child(2) th { height: 130px; font-size: 7pt; background: #fff; border-top: none; border-left: none; border-right: none; }',
        '.ledger thead tr:nth-child(2) th:first-child { border-left: 1px solid #111 !important; }',
        '.ledger thead tr:nth-child(2) th:last-child  { border-right: 1px solid #111 !important; }',
        '.ledger th:nth-child(1), .ledger td:nth-child(1) { width: 30px; }',
        '.ledger th:nth-child(2), .ledger td:nth-child(2) { width: 120px; font-size: 8pt; }',
        '.ledger th:nth-child(3), .ledger td:nth-child(3) { width: 28px; }',
        '.ledger th:nth-child(4), .ledger td:nth-child(4) { width: 185px; text-align: left; padding-left: 3px; }',
        '.ledger th:nth-child(5), .ledger td:nth-child(5) { width: 80px; border-right: none; }',
        '.ledger th:nth-last-child(2), .ledger td:nth-last-child(2) { width: 52px; font-size: 8pt; }',
        '.ledger th:last-child, .ledger td:last-child { width: 56px; font-size: 8pt; }',
        '.ledger tbody td:nth-child(n+4):nth-child(-n+18) { border-left: none; border-right: none; padding-left: 4px; padding-right: 1px; text-align: center; }',
        '.vertical-col { writing-mode: vertical-rl !important; text-orientation: mixed !important; transform: none !important; white-space: normal !important; text-align: center !important; vertical-align: middle !important; line-height: 1.3 !important; padding: 2px !important; }',
        '.subject-head { border-right: none !important; }',
        '.unique-code  { border-left: none !important; }',
        '.group-head   { border-left: none !important; border-right: none !important; }',
        '.no-side      { border-left: none !important; border-right: none !important; }',
        '.s1           { text-align: left !important; }',
        '.ledger tbody td { line-height: 1.4; }',
        '.ledger tbody td hr { border: none; border-top: 1px dashed #aaa; margin: 1px 0; }',
    ].join('\n');

    // 7. BUILD BODY
    var bodyHTML = '';
    for (var p = 0; p < totalPages; p++) {
        var start = p * PER_PAGE;
        var end = Math.min(start + PER_PAGE, studentGroups.length);
        if (p > 0) bodyHTML += '<div style="page-break-before:always;break-before:page;"></div>';
        bodyHTML += buildHeader(p + 1, totalPages);
        bodyHTML += '<table class="ledger">';
        bodyHTML += theadHTML;
        bodyHTML += tfootHTML;
        bodyHTML += '<tbody>';
        for (var i = start; i < end; i++) {
            studentGroups[i].forEach(function (r) { bodyHTML += r; });
        }
        bodyHTML += '</tbody></table>';
    }

    return {
        fullHTML: '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tabulation Register</title>'
            + '<style>' + CSS + '</style></head><body>' + bodyHTML + '</body></html>',
        totalPages: totalPages
    };
}


// ═══════════════════════════════════════════════════════════════════
//  PRINT
// ═══════════════════════════════════════════════════════════════════
function printTable() {
    var result = _buildLedgerHTML();
    if (!result) return;

    $('#printIframe').remove();
    var iframe = document.createElement('iframe');
    iframe.id = 'printIframe';
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:297mm;height:210mm;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write(result.fullHTML);
    doc.close();

    iframe.onload = function () {
        setTimeout(function () {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(function () { $('#printIframe').remove(); }, 2500);
        }, 1400);
    };
}


// ═══════════════════════════════════════════════════════════════════
//  DOWNLOAD PDF — har page alag image → alag PDF page
// ═══════════════════════════════════════════════════════════════════
function downloadPDF() {
    var result = _buildLedgerHTML();
    if (!result) return;

    var button = document.querySelector('.download-btn');
    if (button) button.disabled = true;

    // Hidden iframe mein render karo
    $('#pdfIframe').remove();
    var iframe = document.createElement('iframe');
    iframe.id = 'pdfIframe';
    // Visible size chahiye taaki html-to-image sahi render kare
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:297mm;height:210mm;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write(result.fullHTML);
    doc.close();

    iframe.onload = function () {
        setTimeout(function () {
            try {
                var iframeDoc = iframe.contentWindow.document;
                var pages = iframeDoc.querySelectorAll('[style*="page-break-before"]');

                // Sab page wrappers collect karo
                // Har page = ek header div + ek table
                // Hum poore body ko ek saath capture karenge, phir split karenge

                var { jsPDF } = window.jspdf;
                var pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4',
                    compress: true
                });

                var pdfW = pdf.internal.pageSize.getWidth();   // 297mm
                var pdfH = pdf.internal.pageSize.getHeight();  // 210mm

                // Har page ke liye alag div find karo
                // Page divs = page-break-before wale divs + pehla block
                var body = iframeDoc.body;
                var children = Array.from(body.children);

                // Children ko pages mein group karo
                // page-break div = separator, uske baad naya page
                var pageBlocks = [];
                var currentBlock = [];
                children.forEach(function (el) {
                    var style = el.getAttribute('style') || '';
                    if (style.indexOf('page-break-before') !== -1) {
                        if (currentBlock.length > 0) pageBlocks.push(currentBlock);
                        currentBlock = [];
                    } else {
                        currentBlock.push(el);
                    }
                });
                if (currentBlock.length > 0) pageBlocks.push(currentBlock);

                // Agar koi split nahi mila to poora body ek page
                if (pageBlocks.length === 0) pageBlocks = [children];

                var pageIndex = 0;

                function captureNextPage() {
                    if (pageIndex >= pageBlocks.length) {
                        // Sab pages done — save karo
                        pdf.save('tabulation-register.pdf');
                        if (button) button.disabled = false;
                        $('#pdfIframe').remove();
                        return;
                    }

                    // Is page ke elements ek temp div mein daalo
                    var tempDiv = iframeDoc.createElement('div');
                    tempDiv.style.cssText = 'width:287mm;background:#fff;padding:0;margin:0;';
                    pageBlocks[pageIndex].forEach(function (el) {
                        tempDiv.appendChild(el.cloneNode(true));
                    });
                    iframeDoc.body.appendChild(tempDiv);

                    htmlToImage.toPng(tempDiv, {
                        pixelRatio: 3,
                        quality: 1,
                        backgroundColor: '#ffffff',
                        width: tempDiv.scrollWidth,
                        height: tempDiv.scrollHeight
                    }).then(function (dataUrl) {
                        iframeDoc.body.removeChild(tempDiv);

                        var img = new Image();
                        img.onload = function () {
                            if (pageIndex > 0) pdf.addPage('a4', 'landscape');

                            var imgW = img.naturalWidth;
                            var imgH = img.naturalHeight;
                            var ratio = pdfW / imgW;
                            var scaledH = imgH * ratio;

                            // Agar height zyada hai to fit karo
                            if (scaledH > pdfH) {
                                ratio = pdfH / imgH;
                                scaledH = pdfH;
                                var scaledW = imgW * ratio;
                                var xOffset = (pdfW - scaledW) / 2;
                                pdf.addImage(dataUrl, 'PNG', xOffset, 0, scaledW, scaledH, '', 'FAST');
                            } else {
                                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, scaledH, '', 'FAST');
                            }

                            pageIndex++;
                            captureNextPage();
                        };
                        img.src = dataUrl;
                    }).catch(function (err) {
                        console.error('Page ' + pageIndex + ' capture failed:', err);
                        iframeDoc.body.removeChild(tempDiv);
                        pageIndex++;
                        captureNextPage();
                    });
                }

                captureNextPage();

            } catch (e) {
                console.error('PDF generation error:', e);
                if (button) button.disabled = false;
                $('#pdfIframe').remove();
            }
        }, 1500);
    };
}