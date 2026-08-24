function printTable() {

    var pageEl = document.querySelector('.page');

    if (!pageEl) {
        alert('Ledger table not found.');
        return;
    }

    var sourceTable = pageEl.querySelector('.ledger');

    if (!sourceTable) {
        alert('Ledger table not found.');
        return;
    }

    // ============================================================
    // EXAM NAME
    // ============================================================

    var examNameEl = document.getElementById('ExamnameId');

    var examName = examNameEl
        ? examNameEl.innerText.trim()
        : '';


    // ============================================================
    // LOGO
    // ============================================================

    var logoSrc = '/Logo/nia_logo.png';


    // ============================================================
    // COLLECT STUDENT GROUPS
    // 1 STUDENT = ALL SUBJECT ROWS
    // ============================================================

    var allRows = Array.from(
        sourceTable.querySelectorAll('tbody tr')
    );

    var studentGroups = [];
    var currentGroup = [];


    allRows.forEach(function (tr) {

        var firstTd = tr.querySelector('td:first-child');

        var isStudentStart =
            firstTd &&
            firstTd.hasAttribute('rowspan') &&
            firstTd.textContent.trim() !== '';


        if (
            isStudentStart &&
            currentGroup.length > 0
        ) {

            studentGroups.push(currentGroup);

            currentGroup = [];
        }


        currentGroup.push(tr.outerHTML);

    });


    if (currentGroup.length > 0) {

        studentGroups.push(currentGroup);

    }


    // ============================================================
    // 2 STUDENTS PER PAGE
    // ============================================================

    var PER_PAGE = 2;

    var totalPages = Math.ceil(
        studentGroups.length / PER_PAGE
    );

    if (totalPages < 1) {
        totalPages = 1;
    }


    // ============================================================
    // THEAD
    // ============================================================

    var theadEl = sourceTable.querySelector('thead');

    var theadHTML = theadEl
        ? theadEl.outerHTML
        : '';


    // ============================================================
    // HEADER
    // ============================================================

    function buildHeader(pageNumber, total) {

        return `

        <div class="print-header">

            <!-- LOGO -->
            <div class="logo-container">

                <img
                    src="${logoSrc}"
                    class="nia-logo"
                    onerror="this.style.display='none';"
                >

            </div>


            <!-- CENTER -->
            <div class="header-center">

                <div class="institute-title">
                    NATIONAL INSTITUTE OF AYURVEDA, JAIPUR
                </div>

                <div class="university-title">
                    Deemed to be University
                </div>

                <div class="ministry-title">
                    (Ministry of AYUSH, Govt. of India)
                </div>

                <div class="address-title">
                    Jorawar Singh Gate, Amer Road, Jaipur-302002
                </div>

                <div class="exam-title">
                    ${examName}
                </div>

                <div class="ledger-title">
                    TABULATION REGISTER/LEDGER
                </div>
            </div>


            <!-- PAGE NUMBER -->
            <div class="page-number">
                Page: ${pageNumber} / ${total}
            </div>

        </div>


        <div class="issue-date">
            Date of Issue : .....................
        </div>

        `;
    }


    // ============================================================
    // FOOTER
    // ============================================================

    function buildFooter() {

        return `

        <div class="print-footer">

            <div class="footer-note">

                <b>Note.</b><br>

                1. For candidate to pass, he/she shall require
                to obtain a minimum of 50% marks in each of
                Theory examination.<br>

                2. The candidate securing 65% marks or above
                in a subject shall be declared to have obtained
                First Class (Denoted by I) in that Subject.<br>

                3. The candidate securing 75% marks or above
                in a subject shall be declared to have obtained
                distinction (Denoted by D) in that Subject.<br>

                4. A candidate failing in the Theory part of
                a paper will be considered fail in Theory.

            </div>


            <div class="signature-box">
                Tabulator
            </div>


            <div class="signature-box">
                DCOE
            </div>


            <div class="signature-box">
                Controller of<br>
                Examinations
            </div>


            <div class="signature-box">
                Registrar
            </div>


            <div class="signature-box">
                Vice Chancellor
            </div>

        </div>

        `;
    }


    // ============================================================
    // BUILD PAGES
    // ============================================================

    var bodyHTML = '';


    for (
        var p = 0;
        p < totalPages;
        p++
    ) {

        var start = p * PER_PAGE;

        var end = Math.min(
            start + PER_PAGE,
            studentGroups.length
        );


        bodyHTML += `

        <div class="print-page">

            ${buildHeader(
            p + 1,
            totalPages
        )}


            <table class="ledger print-ledger">

                ${theadHTML}

                <tbody>
        `;


        // --------------------------------------------------------
        // STUDENTS
        // --------------------------------------------------------

        for (
            var i = start;
            i < end;
            i++
        ) {

            studentGroups[i].forEach(
                function (rowHTML) {

                    bodyHTML += rowHTML;

                }
            );

        }


        bodyHTML += `

                </tbody>

            </table>


            ${buildFooter()}

        </div>

        `;
    }


    // ============================================================
    // CSS
    // ============================================================

    var CSS = `

    /* ============================================================
       A4 LANDSCAPE
    ============================================================ */

    @page {
        size: A4 landscape;
        margin: 5mm;
    }


    * {
        box-sizing: border-box;

        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }


    html,
    body {

        margin: 0 !important;
        padding: 0 !important;

        background: #fff !important;

        color: #000 !important;

        font-family:
            Arial,
            Helvetica,
            sans-serif;
    }


    /* ============================================================
       PRINT PAGE
    ============================================================ */

    .print-page {

        width: 287mm;

        min-height: 200mm;

        margin: 0;

        padding: 0;

        page-break-after: always;

        break-after: page;

        page-break-inside: avoid;

        break-inside: avoid;
    }


    .print-page:last-child {

        page-break-after: auto;

        break-after: auto;
    }


    /* ============================================================
       HEADER
       HEIGHT INCREASED - IMPORTANT
    ============================================================ */

    .print-header {

        width: 100%;

        /*
         * Previous 72px was too small.
         * Now enough room for complete header.
         */
        height: 130px;

        min-height: 92px;

        display: grid;

        grid-template-columns:
            90px
            minmax(0, 1fr)
            115px;

        align-items: center;

        border-bottom: 2px solid #000;

        padding:
            2px 0 5px 0;

        margin: 0;

        position: relative;

        page-break-inside: avoid;

        break-inside: avoid;
    }


    /* ============================================================
       LOGO
    ============================================================ */

    .logo-container {

        width: 90px;

        height: 86px;

        display: flex;

        align-items: center;

        justify-content: center;

        overflow: visible;
    }


    .nia-logo {

        width: 80px;

        height: 80px;

        max-width: 80px;

        max-height: 80px;

        object-fit: contain;

        display: block;
    }


    /* ============================================================
       CENTER HEADER
    ============================================================ */

    .header-center {

        width: 100%;
        min-width: 0;

        text-align: center;

        line-height: 1.08;

        padding:
            0 4px;

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;
    }


    .institute-title {

        font-size: 15pt;

        font-weight: bold;

        line-height: 1.05;

        white-space: nowrap;

        margin:
            0 0 3px 0;
    }


    .university-title {

        font-size: 8pt;

        font-weight: 600;

        line-height: 1.05;

        margin:
            0 0 2px 0;
    }


    .ministry-title {

        font-size: 8pt;

        font-weight: 600;

        line-height: 1.05;

        margin:
            0 0 2px 0;
    }


    .address-title {

        font-size: 8pt;

        font-weight: 600;

        line-height: 1.05;

        margin:
            0 0 4px 0;
    }


    /*
     * EXAM NAME
     * Full line visible
     */

    .exam-title {

        font-size: 8.5pt;

        font-weight: bold;

        line-height: 1.08;

        white-space: normal;

        text-align: center;

        margin:
            0 0 3px 0;

        width: 100%;
    }


    .ledger-title {

        font-size: 9.5pt;

        font-weight: bold;

        line-height: 1.05;

        white-space: nowrap;

        margin: 0;
    }


    /* ============================================================
       PAGE NUMBER
    ============================================================ */

    .page-number {

        width: 115px;

        height: 36px;

        border:
            1.5px solid #222;

        display: flex;

        align-items: center;

        justify-content: center;

        font-size: 8pt;

        font-weight: bold;

        white-space: nowrap;

        margin-top: 0;

        align-self: flex-start;
    }


    /* ============================================================
       DATE
    ============================================================ */

    .issue-date {

        width: 100%;

        height: 18px;

        min-height: 18px;

        text-align: right;

        font-size: 7pt;

        font-weight: bold;

        line-height: 1;

        padding-top: 3px;

        padding-right: 1px;

        margin:
            0 0 4px 0;
    }


    /* ============================================================
       TABLE
    ============================================================ */

    .print-ledger {

        width: 100% !important;

        max-width: 100% !important;

        border-collapse: collapse !important;

        border-spacing: 0 !important;

        table-layout: fixed !important;

        margin: 0 !important;

        padding: 0 !important;

        font-weight: 700;
    }


    /* ============================================================
       ALL CELLS
    ============================================================ */

    .print-ledger th,
    .print-ledger td {

        border:
            1px solid #111;

        font-family:
            Arial,
            Helvetica,
            sans-serif;

        font-size:
            6.5pt;

        font-weight:
            700;

        padding:
            2px 3px;

        vertical-align:
            middle;

        text-align:
            center;

        overflow:
            hidden;

        line-height:
            1.18;
    }


    /* ============================================================
       TABLE HEADER
    ============================================================ */

    .print-ledger thead {

        display:
            table-header-group;
    }


    .print-ledger thead tr:first-child th {

        height:
            22px;

        font-size:
            7pt;

        font-weight:
            bold;

        background:
            #fff;

        border-bottom:
            none;

        padding:
            3px 2px;
    }


    .print-ledger thead tr:nth-child(2) th {

        height:
            112px;

        font-size:
            6pt;

        background:
            #fff;

        border-top:
            none;

        border-left:
            none;

        border-right:
            none;

        padding:
            3px 2px;

        line-height:
            1.15;
    }


    .print-ledger thead tr:nth-child(2)
    th:first-child {

        border-left:
            1px solid #111 !important;
    }


    .print-ledger thead tr:nth-child(2)
    th:last-child {

        border-right:
            1px solid #111 !important;
    }


    /* ============================================================
       BODY
    ============================================================ */

    .print-ledger tbody {

        display:
            table-row-group;
    }


    .print-ledger tbody tr {

        page-break-inside:
            avoid !important;

        break-inside:
            avoid !important;
    }


    .print-ledger tbody td {

        padding:
            2px 3px !important;

        line-height:
            1.25 !important;

        height:
            20px;
    }


    /* ============================================================
       SUBJECT COLUMN
       IMPORTANT FIX
    ============================================================ */

    .print-ledger th:nth-child(4),
    .print-ledger td:nth-child(4) {

        /*
         * Subject ko wrap hone do.
         * nowrap hata diya.
         */
        white-space:
            normal !important;

        word-break:
            normal !important;

        overflow-wrap:
            break-word !important;

        text-align:
            left !important;

        padding-left:
            5px !important;

        padding-right:
            4px !important;

        line-height:
            1.22 !important;

        font-size:
            6.3pt !important;
    }


    /*
     * Subject name ke liye thoda extra width
     */

    .print-ledger th:nth-child(4) {

        width:
            220px !important;
    }


    .print-ledger td:nth-child(4) {

        width:
            220px !important;
    }


    /* ============================================================
       ROLL / NAME
    ============================================================ */

    .print-ledger th:nth-child(2),
    .print-ledger td:nth-child(2) {

        width:
            140px !important;

        font-size:
            7pt;
    }


    /* ============================================================
       S.NO
    ============================================================ */

    .print-ledger th:nth-child(1),
    .print-ledger td:nth-child(1) {

        width:
            35px !important;
    }


    /* ============================================================
       ATTEMPT
    ============================================================ */

    .print-ledger th:nth-child(3),
    .print-ledger td:nth-child(3) {

        width:
            35px !important;
    }


    /* ============================================================
       UNIQUE CODE
    ============================================================ */

    .print-ledger th:nth-child(5),
    .print-ledger td:nth-child(5) {

        width:
            75px !important;
    }


    /* ============================================================
       LAST COLUMNS
    ============================================================ */

    .print-ledger th:nth-last-child(2),
    .print-ledger td:nth-last-child(2) {

        width:
            55px !important;

        font-size:
            7pt;
    }


    .print-ledger th:last-child,
    .print-ledger td:last-child {

        width:
            60px !important;

        font-size:
            7pt;
    }


    /* ============================================================
       MARKS COLUMNS
    ============================================================ */

    .print-ledger tbody td:nth-child(n+4):nth-child(-n+18) {

        border-left:
            none;

        border-right:
            none;

        padding-left:
            3px;

        padding-right:
            3px;

        text-align:
            center;
    }


    /* ============================================================
       VERTICAL TEXT
    ============================================================ */

    .vertical-col {

        writing-mode:
            vertical-rl !important;

        text-orientation:
            mixed !important;

        transform:
            none !important;

        white-space:
            normal !important;

        text-align:
            center !important;

        vertical-align:
            middle !important;

        line-height:
            1.15 !important;

        padding:
            3px 2px !important;
    }


    /* ============================================================
       BORDER HELPERS
    ============================================================ */

    .subject-head {

        border-right:
            none !important;
    }


    .unique-code {

        border-left:
            none !important;
    }


    .group-head {

        border-left:
            none !important;

        border-right:
            none !important;
    }


    .no-side {

        border-left:
            none !important;

        border-right:
            none !important;
    }


    .s1 {

        text-align:
            left !important;
    }


    /* ============================================================
       SUBJECT HR
    ============================================================ */

    .print-ledger tbody td hr {

        border:
            none;

        border-top:
            1px dashed #aaa;

        margin:
            2px 0;
    }


    /* ============================================================
       FOOTER
    ============================================================ */

    .print-footer {

        width:
            100%;

        display:
            grid;

        grid-template-columns:
            45%
            11%
            11%
            11%
            11%
            11%;

        border:
            1.5px solid #222;

        margin-top:
            5px;

        min-height:
            52px;

        page-break-inside:
            avoid;

        break-inside:
            avoid;
    }


    .footer-note {

        padding:
            4px 6px;

        font-size:
            5.5pt;

        line-height:
            1.3;

        font-weight:
            normal;

        text-align:
            left;
    }


    .signature-box {

        border-left:
            1.5px solid #222;

        min-height:
            52px;

        display:
            flex;

        align-items:
            flex-end;

        justify-content:
            center;

        text-align:
            center;

        padding:
            0 3px 5px 3px;

        font-size:
            6.5pt;

        font-weight:
            bold;
    }


    /* ============================================================
       PRINT MODE
    ============================================================ */

    @media print {

        @page {

            size:
                A4 landscape;

            margin:
                5mm;
        }


        html,
        body {

            width:
                297mm !important;

            margin:
                0 !important;

            padding:
                0 !important;
        }


        .print-page {

            width:
                287mm !important;

            min-height:
                200mm !important;

            margin:
                0 !important;

            padding:
                0 !important;

            page-break-after:
                always !important;

            break-after:
                page !important;
        }


        .print-page:last-child {

            page-break-after:
                auto !important;

            break-after:
                auto !important;
        }


        .print-ledger {

            width:
                287mm !important;
        }


        .print-ledger tr {

            page-break-inside:
                avoid !important;

            break-inside:
                avoid !important;
        }

    }

    `;


    // ============================================================
    // COMPLETE HTML
    // ============================================================

    var fullHTML = `

    <!DOCTYPE html>

    <html>

    <head>

        <meta charset="UTF-8">

        <meta
            name="viewport"
            content="width=device-width,
            initial-scale=1.0"
        >

        <title>
            Tabulation Register
        </title>

        <style>

            ${CSS}

        </style>

    </head>

    <body>

        ${bodyHTML}

    </body>

    </html>

    `;


    // ============================================================
    // REMOVE OLD IFRAME
    // ============================================================

    $('#printIframe').remove();


    // ============================================================
    // CREATE IFRAME
    // ============================================================

    var iframe =
        document.createElement('iframe');

    iframe.id =
        'printIframe';

    iframe.style.cssText =
        'position:fixed;' +
        'left:-10000px;' +
        'top:0;' +
        'width:297mm;' +
        'height:210mm;' +
        'border:0;' +
        'visibility:hidden;';

    document.body.appendChild(
        iframe
    );


    // ============================================================
    // WRITE HTML
    // ============================================================

    var doc =
        iframe.contentWindow.document;

    doc.open();

    doc.write(
        fullHTML
    );

    doc.close();


    // ============================================================
    // PRINT AFTER LOAD
    // ============================================================

    var printed = false;


    function doPrint() {

        if (printed) {
            return;
        }

        printed = true;

        try {

            iframe.contentWindow
                .focus();

            iframe.contentWindow
                .print();

        } catch (error) {

            console.error(
                'Print error:',
                error
            );

        }


        setTimeout(
            function () {

                $('#printIframe').remove();

            },
            3000
        );
    }


    iframe.onload = function () {

        var images =
            iframe.contentDocument
                .querySelectorAll(
                    'img'
                );


        if (
            images.length === 0
        ) {

            setTimeout(
                doPrint,
                1000
            );

            return;
        }


        var loaded = 0;


        function imageFinished() {

            loaded++;


            if (
                loaded >=
                images.length
            ) {

                setTimeout(
                    doPrint,
                    800
                );
            }
        }


        Array.from(images)
            .forEach(
                function (img) {

                    if (
                        img.complete
                    ) {

                        imageFinished();

                    } else {

                        img.onload =
                            imageFinished;

                        img.onerror =
                            imageFinished;
                    }

                }
            );


        // Safety fallback

        setTimeout(
            doPrint,
            3000
        );

    };

}
