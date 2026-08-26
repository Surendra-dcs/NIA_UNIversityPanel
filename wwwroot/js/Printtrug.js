function printTable() {

    var pageEl = document.querySelector(".page");

    if (!pageEl) {
        alert("Ledger table not found.");
        return;
    }

    /* =====================================================
       EXAM NAME
       ===================================================== */

    var examNameEl = document.getElementById("ExamnameId");

    var examName = examNameEl
        ? examNameEl.innerText.trim()
        : "";

    var logoSrc = "/Logo/nia_logo.png";


    /* =====================================================
       GET ORIGINAL LEDGER
       ===================================================== */

    var ledgerEl =
        pageEl.querySelector(".ledger");

    if (!ledgerEl) {
        alert("Ledger table not found.");
        return;
    }


    /* =====================================================
       GET STUDENT ROWS
       ===================================================== */

    var allRows = Array.from(
        ledgerEl.querySelectorAll("tbody tr")
    );

    if (allRows.length === 0) {
        alert("No student records found.");
        return;
    }


    /*
       Every tbody tr is treated as one student.
    */

    var studentGroups = allRows.map(function (tr) {

        return tr.outerHTML;

    });


    /* =====================================================
       GET ORIGINAL TABLE HEADER
       ===================================================== */

    var theadEl =
        ledgerEl.querySelector("thead");

    var theadHTML =
        theadEl
            ? theadEl.outerHTML
            : "";


    /* =====================================================
       GET COLUMN COUNT
       ===================================================== */

    var colCount = 0;

    if (theadEl) {

        var firstHeaderRow =
            theadEl.querySelector(
                "tr:first-child"
            );

        if (firstHeaderRow) {

            Array.from(
                firstHeaderRow.querySelectorAll("th")
            ).forEach(function (th) {

                colCount +=
                    parseInt(
                        th.getAttribute("colspan")
                    ) || 1;

            });

        }

    }

    if (colCount <= 0) {
        colCount = 20;
    }


    /* =====================================================
       STUDENTS PER PAGE
       ===================================================== */

    var PER_PAGE = 5;

    var totalPages =
        Math.ceil(
            studentGroups.length / PER_PAGE
        );

    if (totalPages < 1) {
        totalPages = 1;
    }


    /* =====================================================
       FOOTER
       ===================================================== */

    var tfootHTML =

        "<tfoot>" +

        "<tr>" +

        '<td colspan="' +
        colCount +
        '" class="print-footer-cell">' +

        '<div class="footer-box">' +

        /* NOTE */

        '<div class="footer-note">' +

        "<b>Note.</b><br/>" +

        "1. For candidate to pass, he/she shall require to obtain a minimum of 50% marks in each of Theory examination.<br/>" +

        "2. The candidate securing 65% marks or above in a subject shall be declared to have obtained First Class (Denoted by I) in that Subject.<br/>" +

        "3. The candidate securing 75% marks or above in a subject shall be declared to have obtained distinction (Denoted by D) in that Subject.<br/>" +

        "4. A candidate failing in the Theory part of a paper will be considered fail in Theory." +

        "</div>" +


        /* TABULATOR */

        '<div class="sign-box">' +
        "Tabulator" +
        "</div>" +


        /* DCOE */

        '<div class="sign-box">' +
        "DCOE" +
        "</div>" +


        /* CONTROLLER */

        '<div class="sign-box controller">' +
        "Controller of<br/>Examinations" +
        "</div>" +


        /* REGISTRAR */

        '<div class="sign-box">' +
        "Registrar" +
        "</div>" +


        /* VICE CHANCELLOR */

        '<div class="sign-box">' +
        "Vice Chancellor" +
        "</div>" +

        "</div>" +

        "</td>" +

        "</tr>" +

        "</tfoot>";


    /* =====================================================
       PAGE HEADER
       ===================================================== */

    function buildHeader(
        pageNumber,
        totalPages
    ) {

        return (

            '<div class="top">' +

            /* LOGO */

            '<div class="logo">' +

            '<img src="' +
            logoSrc +
            '" />' +

            "</div>" +


            /* HEADING */

            '<div class="heading">' +

            "<h2>" +
            "NATIONAL INSTITUTE OF AYURVEDA, JAIPUR" +
            "</h2>" +

            "<p>" +
            "Deemed to be University" +
            "</p>" +

            "<p>" +
            "(Ministry of AYUSH, Govt. of India)" +
            "</p>" +

            "<p>" +
            "Jorawar Singh Gate, Amer Road, Jaipur-302002" +
            "</p>" +

            "<h4>" +
            examName +
            "</h4>" +

            "<h3>" +
            "TABULATION REGISTER/LEDGER" +
            "</h3>" +

            "</div>" +


            /* PAGE */

            '<div class="page-no">' +

            "Page: " +
            pageNumber +
            " / " +
            totalPages +

            "</div>" +

            "</div>" +


            /* DATE */

            '<div class="issue-date">' +

            "Date of Issue : ....................." +

            "</div>"

        );

    }


    /* =====================================================
       BUILD ALL PRINT PAGES
       ===================================================== */

    var bodyHTML = "";


    for (
        var p = 0;
        p < totalPages;
        p++
    ) {

        var start =
            p * PER_PAGE;

        var end =
            Math.min(
                start + PER_PAGE,
                studentGroups.length
            );


        /* PAGE BREAK */

        if (p > 0) {

            bodyHTML +=
                '<div class="page-break"></div>';

        }


        /* HEADER */

        bodyHTML +=
            buildHeader(
                p + 1,
                totalPages
            );


        /* TABLE START */

        bodyHTML +=
            '<table class="ledger">';


        /* ORIGINAL THEAD */

        bodyHTML +=
            theadHTML;


        /* BODY */

        bodyHTML +=
            "<tbody>";


        for (
            var i = start;
            i < end;
            i++
        ) {

            bodyHTML +=
                studentGroups[i];

        }


        bodyHTML +=
            "</tbody>";


        /* FOOTER */

        bodyHTML +=
            tfootHTML;


        /* TABLE END */

        bodyHTML +=
            "</table>";

    }


    /* =====================================================
       PRINT CSS
       ===================================================== */

    var CSS = [

        /* =================================================
           A4 LANDSCAPE
           ================================================= */

        "@page {" +
        "size: A4 landscape;" +
        "margin: 4mm 4mm 4mm 4mm;" +
        "}",


        /* =================================================
           GLOBAL
           ================================================= */

        "*" +
        "{" +
        "box-sizing: border-box;" +
        "-webkit-print-color-adjust: exact;" +
        "print-color-adjust: exact;" +
        "}",


        "html, body {" +
        "margin: 0;" +
        "padding: 0;" +
        "background: #fff;" +
        "font-family: Arial, Helvetica, sans-serif;" +
        "color: #000;" +
        "}",


        /* =================================================
           TOP HEADER
           ================================================= */

        ".top {" +
        "display: grid;" +
        "grid-template-columns: 75px 1fr 100px;" +
        "align-items: center;" +
        "text-align: center;" +
        "padding-bottom: 1px;" +
        "margin-bottom: 1px;" +
        "page-break-inside: avoid;" +
        "break-inside: avoid;" +
        "}",


        ".logo {" +
        "display: flex;" +
        "justify-content: center;" +
        "align-items: center;" +
        "}",


        ".logo img {" +
        "width: 55px;" +
        "height: 55px;" +
        "object-fit: contain;" +
        "}",


        ".heading {" +
        "line-height: 1;" +
        "}",


        ".heading h2 {" +
        "margin: 0;" +
        "font-size: 12pt;" +
        "font-weight: bold;" +
        "}",


        ".heading p {" +
        "margin: 1px 0;" +
        "font-size: 6.5pt;" +
        "font-weight: 600;" +
        "}",


        ".heading h4 {" +
        "margin: 2px 0 1px;" +
        "font-size: 7.5pt;" +
        "font-weight: bold;" +
        "}",


        ".heading h3 {" +
        "margin: 0;" +
        "font-size: 8.5pt;" +
        "font-weight: bold;" +
        "}",


        ".page-no {" +
        "border: 1px solid #111;" +
        "padding: 3px 5px;" +
        "font-weight: bold;" +
        "font-size: 7pt;" +
        "text-align: center;" +
        "align-self: start;" +
        "}",


        ".issue-date {" +
        "text-align: right;" +
        "font-size: 7pt;" +
        "font-weight: bold;" +
        "margin: 0 0 2px 0;" +
        "}",


        /* =================================================
           TABLE
           ================================================= */

        ".ledger {" +
        "width: 100%;" +
        "border-collapse: collapse;" +
        "table-layout: fixed;" +
        "font-weight: 700;" +
        "}",


        ".ledger th," +
        ".ledger td {" +
        "border: 1px solid #111;" +
        "font-size: 5.2pt;" +
        "font-weight: 600;" +
        "padding: 0 1px;" +
        "vertical-align: middle;" +
        "text-align: center;" +
        "overflow: visible;" +
        "word-wrap: normal;" +
        "}",


        /* =================================================
           HEADER / FOOTER GROUPS
           ================================================= */

        ".ledger thead {" +
        "display: table-header-group !important;" +
        "}",


        ".ledger tbody {" +
        "display: table-row-group;" +
        "}",


        ".ledger tfoot {" +
        "display: table-footer-group !important;" +
        "}",


        ".ledger tbody tr {" +
        "page-break-inside: avoid !important;" +
        "break-inside: avoid !important;" +
        "}",


        /* =================================================
           FIRST HEADER ROW
           ================================================= */

        ".ledger thead tr:first-child th {" +
        "height: 18px;" +
        "font-size: 5.7pt;" +
        "font-weight: bold;" +
        "background: #fff;" +
        "border-bottom: none;" +
        "}",


        /* =================================================
           SECOND HEADER ROW
           ================================================= */

        ".ledger thead tr:nth-child(2) th {" +
        "height: 145px;" +
        "font-size: 5.1pt;" +
        "background: #fff;" +
        "border-top: none !important;" +
        "}",


        /* =================================================
           NAME OF SUBJECTS SECTION

           INTERNAL VERTICAL BORDERS OFF
           ================================================= */

        ".ledger tbody td:nth-child(n+4):nth-child(-n+35) {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        ".ledger thead tr:nth-child(2) th:nth-child(n+4):nth-child(-n+35) {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        /* =================================================
           NAME OF SUBJECTS - LEFT OUTER BORDER
           ================================================= */

        ".ledger tbody td:nth-child(4) {" +
        "border-left: 1px solid #111 !important;" +
        "}",


        ".ledger thead tr:nth-child(2) th:nth-child(4) {" +
        "border-left: 1px solid #111 !important;" +
        "}",


        /* =================================================
           BEFORE DISTINCTION - RIGHT OUTER BORDER
           ================================================= */

        //".ledger tbody td:nth-child(36) {" +
        //"border-right: 1px solid #111 !important;" +
        //"}",


        //".ledger thead tr:nth-child(2) th:nth-child(36) {" +
        //"border-right: 1px solid #111 !important;" +
        //"}",


        /* =================================================
           IMPORTANT FIX

           I | II | TOTAL | PRAC | VIVA | ELEC | IA | TOTAL

           HEADER KE ANDAR KI SAARI VERTICAL LINES OFF
           ================================================= */

        ".ledger thead tr:nth-child(2) th:nth-child(5)," +
        ".ledger thead tr:nth-child(2) th:nth-child(6)," +
        ".ledger thead tr:nth-child(2) th:nth-child(7)," +
        ".ledger thead tr:nth-child(2) th:nth-child(8)," +
        ".ledger thead tr:nth-child(2) th:nth-child(9)," +
        ".ledger thead tr:nth-child(2) th:nth-child(10)," +
        ".ledger thead tr:nth-child(2) th:nth-child(11)," +
        ".ledger thead tr:nth-child(2) th:nth-child(12)," +
        ".ledger thead tr:nth-child(2) th:nth-child(13)," +
        ".ledger thead tr:nth-child(2) th:nth-child(14)," +
        ".ledger thead tr:nth-child(2) th:nth-child(15)," +
        ".ledger thead tr:nth-child(2) th:nth-child(16)," +
        ".ledger thead tr:nth-child(2) th:nth-child(17) {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        /* =================================================
           IMPORTANT FIX

           I | II | TOTAL | PRAC | VIVA | ELEC | IA | TOTAL

           INKE NICHE DATA CELLS KI VERTICAL LINES OFF
           ================================================= */

        ".ledger tbody td:nth-child(5)," +
        ".ledger tbody td:nth-child(6)," +
        ".ledger tbody td:nth-child(7)," +
        ".ledger tbody td:nth-child(8)," +
        ".ledger tbody td:nth-child(9)," +
        ".ledger tbody td:nth-child(10)," +
        ".ledger tbody td:nth-child(11)," +
        ".ledger tbody td:nth-child(12)," +
        ".ledger tbody td:nth-child(13)," +
        ".ledger tbody td:nth-child(14)," +
        ".ledger tbody td:nth-child(15)," +
        ".ledger tbody td:nth-child(16)," +
        ".ledger tbody td:nth-child(17) {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        /* =================================================
           FINAL HEADER OVERRIDE

           YE RULES LAST MEIN HAIN ISLIYE PURANE
           border-left/right RULES KO OVERRIDE KARENGE
           ================================================= */

        ".ledger thead tr:nth-child(2) th:nth-child(n+5):nth-child(-n+17) {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        ".ledger tbody td:nth-child(n+5):nth-child(-n+17) {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        /* =================================================
           COLUMN WIDTHS
           ================================================= */

        ".ledger th:nth-child(1)," +
        ".ledger td:nth-child(1) {" +
        "width: 28px;" +
        "}",


        ".ledger th:nth-child(2)," +
        ".ledger td:nth-child(2) {" +
        "width: 110px;" +
        "font-size: 6.2pt;" +
        "}",


        ".ledger th:nth-child(3)," +
        ".ledger td:nth-child(3) {" +
        "width: 25px;" +
        "}",


        ".ledger th:nth-child(4)," +
        ".ledger td:nth-child(4) {" +
        "width: 180px;" +
        "text-align: left;" +
        "padding-left: 3px;" +
        "}",


        ".ledger th:nth-child(5)," +
        ".ledger td:nth-child(5) {" +
        "width: 72px;" +
        "}",


        /* GRAND TOTAL */

        ".ledger th:nth-last-child(2)," +
        ".ledger td:nth-last-child(2) {" +
        "width: 48px;" +
        "font-size: 7pt;" +
        "font-weight: bold;" +
        "}",


        /* RESULT */

        ".ledger th:last-child," +
        ".ledger td:last-child {" +
        "width: 52px;" +
        "font-size: 7pt;" +
        "font-weight: bold;" +
        "}",


        /* =================================================
           VERTICAL HEADINGS
           ================================================= */

        ".vertical-col {" +
        "writing-mode: vertical-rl !important;" +
        "text-orientation: mixed !important;" +
        "transform: none !important;" +
        "white-space: normal !important;" +
        "text-align: center !important;" +
        "vertical-align: middle !important;" +
        "line-height: 1.15 !important;" +
        "padding: 2px !important;" +
        "}",


        ".vertical-col {" +
        "white-space: nowrap !important;" +
        "word-break: keep-all !important;" +
        "overflow-wrap: normal !important;" +
        "}",


        /* =================================================
           SPECIAL CLASSES
           ================================================= */

        ".subject-head {" +
        "border-right: none !important;" +
        "}",


        ".unique-code {" +
        "border-left: none !important;" +
        "}",


        ".group-head {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        ".no-side {" +
        "border-left: none !important;" +
        "border-right: none !important;" +
        "}",


        /* =================================================
           SUBJECT ALIGNMENT
           ================================================= */

        ".s1 {" +
        "text-align: left !important;" +
        "}",


        /* =================================================
           BODY
           ================================================= */

        ".ledger tbody td {" +
        "line-height: 1.15;" +
        "font-size: 5.2pt !important;" +
        "padding-top: 1px;" +
        "padding-bottom: 1px;" +
        "}",


        ".ledger tbody td hr {" +
        "border: none;" +
        "border-top: 1px dashed #aaa;" +
        "margin: 1px 0;" +
        "}",


        /* =================================================
           FOOTER
           ================================================= */

        ".print-footer-cell {" +
        "border: none !important;" +
        "padding: 0 !important;" +
        "}",


        ".footer-box {" +
        "display: grid;" +
        "grid-template-columns: 45% repeat(5, 1fr);" +
        "border: 1px solid #111;" +
        "margin-top: 2px;" +
        "}",


        ".footer-note {" +
        "padding: 4px 5px;" +
        "font-size: 5.8pt;" +
        "line-height: 1.35;" +
        "font-weight: normal;" +
        "text-align: left;" +
        "min-height: 55px;" +
        "}",


        ".sign-box {" +
        "border-left: 1px solid #111;" +
        "display: flex;" +
        "align-items: center;" +
        "justify-content: center;" +
        "padding: 4px;" +
        "font-size: 6.5pt;" +
        "font-weight: bold;" +
        "min-height: 55px;" +
        "text-align: center;" +
        "}",


        ".controller {" +
        "line-height: 1.1;" +
        "}",


        /* =================================================
           PAGE BREAK
           ================================================= */

        ".page-break {" +
        "page-break-before: always !important;" +
        "break-before: page !important;" +
        "height: 0;" +
        "}",


        /* =================================================
           PRINT
           ================================================= */

        "@media print {" +

        "html, body {" +
        "width: 297mm;" +
        "height: 210mm;" +
        "margin: 0;" +
        "padding: 0;" +
        "}" +

        "}"

    ].join("\n");


    /* =====================================================
       COMPLETE PRINT HTML
       ===================================================== */

    var fullHTML =

        "<!DOCTYPE html>" +

        "<html>" +

        "<head>" +

        '<meta charset="UTF-8">' +

        "<title>Tabulation Register</title>" +

        "<style>" +

        CSS +

        "</style>" +

        "</head>" +

        "<body>" +

        bodyHTML +

        "</body>" +

        "</html>";


    /* =====================================================
       REMOVE OLD IFRAME
       ===================================================== */

    var oldFrame =
        document.getElementById(
            "printIframe"
        );

    if (oldFrame) {

        oldFrame.remove();

    }


    /* =====================================================
       CREATE PRINT IFRAME
       ===================================================== */

    var iframe =
        document.createElement(
            "iframe"
        );

    iframe.id =
        "printIframe";


    iframe.style.cssText =

        "position:fixed;" +
        "left:-9999px;" +
        "top:0;" +
        "width:297mm;" +
        "height:210mm;" +
        "border:none;" +
        "visibility:hidden;";


    document.body.appendChild(
        iframe
    );


    /* =====================================================
       WRITE HTML
       ===================================================== */

    var doc =
        iframe.contentWindow.document;


    doc.open();

    doc.write(
        fullHTML
    );

    doc.close();


    /* =====================================================
       PRINT
       ===================================================== */

    iframe.onload =
        function () {

            setTimeout(
                function () {

                    iframe.contentWindow
                        .focus();

                    iframe.contentWindow
                        .print();


                    setTimeout(
                        function () {

                            iframe.remove();

                        },
                        2500
                    );

                },
                1000
            );

        };

}