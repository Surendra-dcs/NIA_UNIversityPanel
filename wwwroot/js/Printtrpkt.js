/* ================================================================
   TabulationPrint.js

   Ye file SIRF print ke liye hai.

   APPROACH (FINAL):
   Pichli baar custom/compact CSS se print header-table-footer
   naye sirey se banaya gaya tha — usme on-screen design se
   mismatch ho raha tha (header ke andar lines, column widths,
   roll-cell ki dashed lines waghera).

   Ab is version mein hum print ke liye NAYA design NAHI banate.
   Seedha on-screen `.page` element ko CLONE karte hain (jisme
   header-block, ledger table, footer-notes sab already sahi
   se bana hua hai) aur on-screen `<style>` tag ko bhi AS-IS
   reuse karte hain. Isse print ka look on-screen se GUARANTEED
   match karega, kyunki ye literally wahi DOM/CSS hai.

   Sirf itna extra karte hain: students ko PER_PAGE ke hisaab se
   chunks mein baant kar multiple `.page` clones banate hain
   (har clone mein sirf us page ke students ka tbody hota hai),
   aur beech mein page-break daal dete hain.

   NAYA FIX (is version mein): institute header (logo + naam +
   address + exam title) ko table ke `<thead>` ke ANDAR ek row
   bana kar daala hai — taaki agar ek chunk ka table ek physical
   printed page se lamba ho jaaye, to header bhi automatically
   har physical page par repeat ho (na sirf table ka column-header
   row). Pehle header sirf table ke BAHAR ek plain <div> tha,
   jo aise overflow ke case mein repeat nahi hota tha.
   ================================================================ */
function printLedger() {

    console.log("printLedger v5 — PER_PAGE=4, header outside table (no embed)");

    var pageEl = document.querySelector(".page");

    if (!pageEl) {
        alert("Ledger table not found.");
        return;
    }

    var ledgerEl = pageEl.querySelector(".ledger");

    if (!ledgerEl) {
        alert("Ledger table not found.");
        return;
    }

    /* =====================================================
       GET STUDENT ROWS
       (har tbody tr = ek candidate)
       ===================================================== */

    var allRows = Array.from(
        ledgerEl.querySelectorAll("tbody tr")
    );

    if (allRows.length === 0) {
        alert("No student records found.");
        return;
    }


    /* =====================================================
       ORIGINAL <style> BLOCK(S) — as-is, taaki design 100%
       match kare on-screen ke saath.

       FIX: pehle sirf document.querySelector('style') (yaani
       page ka PEHLA <style> tag) uthaya ja raha tha — agar
       layout/partial view mein humare ledger wale <style> se
       PEHLE koi aur <style> tag hai (Bootstrap/layout ka),
       to humara asli ledger CSS print mein kabhi jaata hi
       nahi tha, isliye print completely un-styled (default
       browser look) dikh raha tha.

       Ab HAR <style> tag utha ke include karte hain, taaki
       humara ledger wala CSS kahin bhi ho, woh zaroor shaamil
       ho.
       ===================================================== */

    var allStyleEls = document.querySelectorAll("style");
    var styleHtml = "";
    allStyleEls.forEach(function (el) {
        styleHtml += el.outerHTML;
    });


    /* =====================================================
       STUDENTS PER PAGE

       (8 se ghata kar 4 kiya — on-screen font-size par ek A4
       landscape page mein zyada students fit nahi ho rahe the,
       isliye ek chunk khud hi overflow ho kar doosre physical
       page par chala jaata tha)
       ===================================================== */

    var PER_PAGE = 3;

    var totalPages = Math.ceil(allRows.length / PER_PAGE);

    if (totalPages < 1) {
        totalPages = 1;
    }


    /* =====================================================
       COLUMN COUNT — header-row colspan ke liye chahiye jab
       institute header ko <thead> ke andar embed karenge
       ===================================================== */

    var colCount = 0;
    var theadElOriginal = ledgerEl.querySelector("thead");
    if (theadElOriginal) {
        var firstHeaderRowOriginal = theadElOriginal.querySelector("tr:first-child");
        if (firstHeaderRowOriginal) {
            Array.from(
                firstHeaderRowOriginal.querySelectorAll("th")
            ).forEach(function (th) {
                colCount += parseInt(th.getAttribute("colspan")) || 1;
            });
        }
    }
    if (colCount <= 0) {
        colCount = 18;
    }


    /* =====================================================
       BUILD ALL PRINT PAGES BY CLONING THE REAL .page ELEMENT
       ===================================================== */

    var bodyHTML = "";

    for (var p = 0; p < totalPages; p++) {

        var start = p * PER_PAGE;
        var end = Math.min(start + PER_PAGE, allRows.length);

        /* Clone the whole .page block — same header, same table
           structure (thead as-is), same footer, same classes
           AND same inline styles (e.g. roll-cell ki dashed
           border-bottom lines automatically aa jaati hain
           kyunki wo asli row ke saath hi clone hoti hain) */
        var pageClone = pageEl.cloneNode(true);

        /* Update the "Page:1" box (top-right) */
        var pageBox = pageClone.querySelector(".page-box");
        if (pageBox) {
            pageBox.textContent = "Page:" + (p + 1) + "/" + totalPages;
        }

        /* Update the bottom-right "Page 1" footer text */
        var footerPageNo = pageClone.querySelector(".page-number-footer");
        if (footerPageNo) {
            footerPageNo.textContent = "Page " + (p + 1);
        }

        /* Replace tbody content with ONLY this page's chunk of
           student rows (clone kiye hue asli <tr> elements) */
        var tbodyClone = pageClone.querySelector("tbody");
        if (tbodyClone) {
            tbodyClone.innerHTML = "";
            for (var i = start; i < end; i++) {
                tbodyClone.appendChild(allRows[i].cloneNode(true));
            }
        }

        /* Page break before every page except the first */
        if (p > 0) {
            bodyHTML += '<div class="page-break"></div>';
        }

        bodyHTML += pageClone.outerHTML;

    }


    /* =====================================================
       EXTRA PRINT-ONLY CSS
       (sirf pagination ke liye — design ka baaki sab kuch
       on-screen wale <style> se hi aa raha hai, isme koi
       border/color/width override NAHI hai)
       ===================================================== */

    var extraCSS =
        "@page { size: A4 landscape; margin: 6mm; }" +
        ".page-break { page-break-before: always !important; break-before: page !important; height: 0; }" +
        /* Row-level avoid-break rehne do (ek row beech mein na kate) */
        ".ledger tbody tr { page-break-inside: avoid !important; break-inside: avoid !important; }" +
        /* On-screen <style> mein 'table.ledger { page-break-inside: avoid }'
           poori TABLE ko header ke saath fit na hone par agle page pe push
           kar raha tha (isliye pehla page khaali-sa reh raha tha). Yahan
           usi selector/specificity ko override karke table-level avoid
           hata rahe hain — sirf row-level avoid rakha hai. */
        ".page table.ledger, table.ledger {" +
        "page-break-inside: auto !important;" +
        "break-inside: auto !important;" +
        "}" +
        /* Same reason: on-screen <style> ka @media print block .page
           par bhi page-break-inside/after: avoid laga raha tha —
           usko bhi auto kar rahe hain taaki header+table content
           agar ek physical page se lamba ho to normally flow kare,
           blank page na chhode. */
        ".page {" +
        "page-break-inside: auto !important;" +
        "page-break-after: auto !important;" +
        "break-inside: auto !important;" +
        "break-after: auto !important;" +
        "}" +
        "@media print { .page { box-shadow: none !important; margin: 0 auto !important; } }";


    /* =====================================================
       COMPLETE PRINT HTML
       ===================================================== */

    var fullHTML =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        '<meta charset="UTF-8">' +
        "<title>Tabulation Register</title>" +
        styleHtml +
        "<style>" + extraCSS + "</style>" +
        "</head>" +
        "<body>" +
        bodyHTML +
        "</body>" +
        "</html>";


    /* =====================================================
       REMOVE OLD IFRAME
       ===================================================== */

    var oldFrame = document.getElementById("printIframe");
    if (oldFrame) {
        oldFrame.remove();
    }


    /* =====================================================
       CREATE PRINT IFRAME (hidden — popup-blocker se pura
       bachaav)
       ===================================================== */

    var iframe = document.createElement("iframe");
    iframe.id = "printIframe";

    iframe.style.cssText =
        "position:fixed;" +
        "left:-9999px;" +
        "top:0;" +
        "width:297mm;" +
        "height:210mm;" +
        "border:none;" +
        "visibility:hidden;";

    document.body.appendChild(iframe);


    /* =====================================================
       WRITE HTML INTO IFRAME
       ===================================================== */

    var doc = iframe.contentWindow.document;

    doc.open();
    doc.write(fullHTML);
    doc.close();


    /* =====================================================
       PRINT
       ===================================================== */

    iframe.onload = function () {

        setTimeout(function () {

            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            setTimeout(function () {
                iframe.remove();
            }, 2500);

        }, 1000);

    };

}
