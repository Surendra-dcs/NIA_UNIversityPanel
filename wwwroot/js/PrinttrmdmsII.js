
function printLedger() {

    console.log("printLedger v6 - candidate-wise grouping + measured pagination");

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

    var allRows = Array.from(ledgerEl.querySelectorAll("tbody tr"));
    if (allRows.length === 0) {
        alert("No student records found.");
        return;
    }


    /* =====================================================
       STEP 1 : ROWS KO CANDIDATE-WISE GROUP KARO
       tr.candidate-row  => naye student ki pehli row
       (us student ki baaki subject rows us ke baad aati hain)
       ===================================================== */

    var groups = [];
    var currentGroup = null;

    allRows.forEach(function (tr) {
        if (currentGroup === null || tr.classList.contains("candidate-row")) {
            currentGroup = [];
            groups.push(currentGroup);
        }
        currentGroup.push(tr);
    });


    /* =====================================================
       STEP 2 : PAGE KA <style> (saare <style> tags)
       ===================================================== */

    var styleHtml = "";
    document.querySelectorAll("style").forEach(function (el) {
        styleHtml += el.outerHTML;
    });


    /* =====================================================
       CSS jo measure karte waqt aur print karte waqt, dono me same
       rahega -- taaki jo height naapi jaaye wahi print me aaye.
       A4 landscape, margin 6mm => usable width 285mm, height 198mm
       ===================================================== */

    var layoutCSS =
        "@page { size: A4 landscape; margin: 6mm; }" +
        "html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }" +
        ".no-print { display: none !important; }" +
        ".page {" +
        "width: 285mm !important;" +
        "max-width: none !important;" +
        "margin: 0 !important;" +
        "padding: 0 !important;" +
        "box-shadow: none !important;" +
        "border: none !important;" +
        "page-break-inside: auto !important;" +
        "page-break-after: auto !important;" +
        "break-inside: auto !important;" +
        "break-after: auto !important;" +
        "}" +
        /* On-screen <style> ka 'table.ledger { page-break-inside: avoid }'
           poori table ko agle page par dhakel deta tha -- isse hata rahe hain */
        ".page table.ledger, table.ledger {" +
        "page-break-inside: auto !important;" +
        "break-inside: auto !important;" +
        "}" +
        /* Ek row beech me na kate */
        ".ledger tbody tr { page-break-inside: avoid !important; break-inside: avoid !important; }" +
        ".page-break { page-break-before: always !important; break-before: page !important; height: 0; }";


    function buildDoc(extraHead, bodyHtml) {
        return "<!DOCTYPE html><html><head>" +
            '<meta charset="UTF-8">' +
            "<title>Tabulation Register</title>" +
            styleHtml +
            "<style>" + layoutCSS + "</style>" +
            (extraHead || "") +
            "</head><body>" + bodyHtml + "</body></html>";
    }


    /* =====================================================
       STEP 3 : HEIGHT NAAPNE KE LIYE HIDDEN IFRAME
       Saari rows ek page me daal kar har student ka block-height
       aur page ka fixed overhead (header + thead + footer) naapte hain.
       ===================================================== */

    var PAGE_HEIGHT_PX = (210 - 12) * 96 / 25.4;   // 198mm printable height
    var SAFETY_PX = 24;                             // thoda margin, overflow se bachne ke liye
    var FALLBACK_PER_PAGE = 2;                      // measure fail ho to

    removeFrame("printMeasureFrame");
    removeFrame("printIframe");

    var measureFrame = document.createElement("iframe");
    measureFrame.id = "printMeasureFrame";
    measureFrame.style.cssText =
        "position:fixed;left:-9999px;top:0;width:297mm;height:210mm;border:none;visibility:hidden;";
    document.body.appendChild(measureFrame);

    var measureClone = pageEl.cloneNode(true);
    var measureTbody = measureClone.querySelector("tbody");
    measureTbody.innerHTML = "";
    allRows.forEach(function (tr) {
        measureTbody.appendChild(tr.cloneNode(true));
    });

    measureFrame.onload = function () {

        var pages;

        try {
            pages = paginate(measureFrame.contentWindow.document);
        } catch (e) {
            console.warn("Measure failed, fallback pagination used:", e);
            pages = fixedPagination();
        }

        removeFrame("printMeasureFrame");
        printPages(pages);
    };

    var mDoc = measureFrame.contentWindow.document;
    mDoc.open();
    mDoc.write(buildDoc("", measureClone.outerHTML));
    mDoc.close();


    /* =====================================================
       PAGINATION (asli height ke hisaab se)
       ===================================================== */

    function paginate(doc) {

        var mPage = doc.querySelector(".page");
        var mBody = doc.querySelector("tbody");
        var trs = Array.from(mBody.querySelectorAll("tr"));

        var overhead =
            mPage.getBoundingClientRect().height -
            mBody.getBoundingClientRect().height;

        var capacity = PAGE_HEIGHT_PX - overhead - SAFETY_PX;

        if (!isFinite(capacity) || capacity <= 0 || trs.length !== allRows.length) {
            return fixedPagination();
        }

        var idx = 0;
        var groupHeights = groups.map(function (g) {
            var h = 0;
            for (var k = 0; k < g.length; k++) {
                h += trs[idx++].getBoundingClientRect().height;
            }
            return h;
        });

        var result = [];
        var cur = [];
        var curH = 0;

        groups.forEach(function (g, gi) {
            var h = groupHeights[gi];

            /* current page me jagah nahi bachi => naya page.
               (student kabhi beech se nahi katega) */
            if (cur.length > 0 && curH + h > capacity) {
                result.push(cur);
                cur = [];
                curH = 0;
            }

            cur.push(g);
            curH += h;
        });

        if (cur.length > 0) {
            result.push(cur);
        }

        return result;
    }

    function fixedPagination() {
        var result = [];
        for (var i = 0; i < groups.length; i += FALLBACK_PER_PAGE) {
            result.push(groups.slice(i, i + FALLBACK_PER_PAGE));
        }
        return result;
    }


    /* =====================================================
       STEP 4 : FINAL PRINT PAGES BANAO AUR PRINT KARO
       ===================================================== */

    function printPages(pages) {

        var totalPages = pages.length || 1;
        var bodyHTML = "";

        for (var p = 0; p < pages.length; p++) {

            var pageClone = pageEl.cloneNode(true);

            var pageBox = pageClone.querySelector(".page-box");
            if (pageBox) {
                pageBox.textContent = "Page:" + (p + 1) + "/" + totalPages;
            }

            var footerPageNo = pageClone.querySelector(".page-number-footer");
            if (footerPageNo) {
                footerPageNo.textContent = "Page " + (p + 1);
            }

            var tbodyClone = pageClone.querySelector("tbody");
            if (tbodyClone) {
                tbodyClone.innerHTML = "";
                pages[p].forEach(function (group) {
                    group.forEach(function (tr) {
                        tbodyClone.appendChild(tr.cloneNode(true));
                    });
                });
            }

            if (p > 0) {
                bodyHTML += '<div class="page-break"></div>';
            }

            bodyHTML += pageClone.outerHTML;
        }

        var iframe = document.createElement("iframe");
        iframe.id = "printIframe";
        iframe.style.cssText =
            "position:fixed;left:-9999px;top:0;width:297mm;height:210mm;border:none;visibility:hidden;";
        document.body.appendChild(iframe);

        iframe.onload = function () {

            setTimeout(function () {

                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                setTimeout(function () {
                    removeFrame("printIframe");
                }, 2500);

            }, 800);
        };

        var doc = iframe.contentWindow.document;
        doc.open();
        doc.write(buildDoc("", bodyHTML));
        doc.close();
    }


    function removeFrame(id) {
        var f = document.getElementById(id);
        if (f) {
            f.remove();
        }
    }
}