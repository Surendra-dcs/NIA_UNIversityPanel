// ===========================================================
// PRINT FUNCTION - clones the .page element with existing CSS
// ===========================================================
function printTable() {
    var pageEl = document.querySelector('.page');
    if (!pageEl) {
        alert('Ledger table not found.');
        return;
    }
    var printContents = pageEl.outerHTML;

    // Collect all linked stylesheets (so existing .ledger / .vertical-col etc CSS applies)
    var links = '';
    document.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
        links += '<link rel="stylesheet" href="' + l.href + '">';
    });

    // Collect all inline <style> blocks
    var styles = '';
    document.querySelectorAll('style').forEach(function (s) {
        styles += '<style>' + s.innerHTML + '</style>';
    });

    $('#printIframe').remove();
    var iframe = document.createElement('iframe');
    iframe.id = 'printIframe';
    iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;left:-9999px;top:-9999px;';
    document.body.appendChild(iframe);

    var doc = iframe.contentWindow.document;
    doc.open();

    var html = '<!DOCTYPE html><html><head><title>Tabulation Register</title>';
    html += links;
    html += styles;
    html += '<style>';
    html += '@page { size: A4 landscape; margin: 5mm; }';
    html += 'body { margin: 0; padding: 0; background: #fff; }';
    html += '.page { width: 100% !important; height: auto !important; box-shadow: none !important; }';
    html += '.ledger { page-break-inside: auto; }';
    html += '.ledger tr { page-break-inside: avoid; }';
    html += '.footer { page-break-inside: avoid; }';
    html += '</style>';
    html += '</head><body>';
    html += printContents;
    html += '</body></html>';

    doc.write(html);
    doc.close();

    // Wait a bit longer so linked CSS / logo image loads before printing
    iframe.onload = function () {
        setTimeout(function () {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(function () {
                $('#printIframe').remove();
            }, 1000);
        }, 600);
    };
}

// ===========================================================
// PDF DOWNLOAD FUNCTION - uses html2canvas + jsPDF
// Requires these CDN scripts on the page:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// ===========================================================
async function downloadPDF() {
    var pageEl = document.querySelector('.page');
    if (!pageEl) {
        alert('Ledger table not found.');
        return;
    }

    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        alert('PDF library not loaded. Please add html2canvas and jsPDF script tags to the page.');
        return;
    }

    var btn = document.getElementById('btnDownloadPdf');
    var originalText = '';
    if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = 'Generating PDF...';
        btn.disabled = true;
    }

    try {
        // Render the .page element to a canvas at higher resolution for clarity
        var canvas = await html2canvas(pageEl, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        var imgData = canvas.toDataURL('image/png');

        // A4 landscape dimensions in mm
        var pageWidthMM = 297;
        var pageHeightMM = 210;

        // Scale canvas to fit page width, calculate proportional height
        var imgWidth = pageWidthMM;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;

        var pdf = new jspdf.jsPDF('l', 'mm', 'a4');

        var heightLeft = imgHeight;
        var position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeightMM;

        // If content is taller than one page, add more pages
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeightMM;
        }

        pdf.save('Tabulation_Register_Ledger.pdf');
    } catch (err) {
        console.error(err);
        alert('Error generating PDF: ' + err.message);
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}