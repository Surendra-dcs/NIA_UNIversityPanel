function printBill() {
    var styles = "";
    document.querySelectorAll("style").forEach(function (s) {
        styles += s.innerHTML;
    });
    var content = document.querySelector(".page.page-2").outerHTML;
    var html = "<!DOCTYPE html><html><head><meta charset=UTF-8><title>Print</title><style>";
    html += "* { box-sizing: border-box; margin: 0; padding: 0; }";
    html += "body { background: white; padding: 0; margin: 0; }";
    html += ".page {";
    html += "width: 210mm !important;";
    html += "height: auto !important;";
    html += "overflow: visible !important;";
    html += "box-shadow: none !important;";
    html += "padding: 4mm 8mm !important;";
    html += "}";
    html += ".p2-bank-row { margin-bottom: 6px !important; }";
    html += ".p2-form-group { margin-top: 4px !important; margin-bottom: 4px !important; }";
    html += ".p2-examiner-row { margin-bottom: 4px !important; }";
    html += ".p2-addr-row { margin-bottom: 4px !important; }";
    html += ".p2-form-title { padding: 4px 10px !important; }";
    html += ".p2-signature-section { margin-top: 6px !important; min-height: 40px !important; }";
    html += ".p2-bottom-box { padding: 4px 6px 2px !important; }";
    html += ".p2-bottom-top-center { margin-bottom: 6px !important; }";
    html += ".p2-footer-controller { margin: 10px 0 0 0 !important; padding-bottom: 10px !important; }";
    html += ".p2-main-table tbody tr td { line-height: 1.4 !important; }";
    html += "@media print {";
    html += "  @page { size: A4; margin: 0; }";
    html += "  body { margin: 0; padding: 0; }";
    html += "  .page { width: 210mm !important; height: auto !important; overflow: visible !important; }";
    html += "}";
    html += styles;
    html += "</style></head><body>";
    html += content;
    html += "</body></html>";

    var win = window.open("", "_blank", "width=900,height=1200");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(function () {
        win.print();
        win.close();
    }, 500);
}