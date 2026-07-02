
function printTable() {

    var pageEl = document.querySelector('#ledgerPage');

    if (!pageEl) {
        alert('Ledger table not found.');
        return;
    }

    var tableHTML = pageEl.querySelector('.ledger').outerHTML;

    var printHTML=`
    <!DOCTYPE html>
        <html>
            <head>
                <title>All & Department  Wise Result Sheet</title>

                <style>

                    @page{
                        size:A4 landscape;
                    margin:10mm;
            }

                    body{
                        font - family: Arial, sans-serif;
                    margin:0;
                    padding:0;
                    color:#000;
            }

                    .header{
                        display:flex;
                    align-items:center;
                    border-bottom:2px solid #000;
                    padding-bottom:10px;
                    margin-bottom:15px;
            }

                    .logo{
                        width:90px;
            }

                    .logo img{
                        width:75px;
                    height:75px;
            }

                    .title{
                        flex:1;
                    text-align:center;
            }

                    .title h2{
                        margin:0;
                    font-size:22px;
                    font-weight:bold;
            }

                    .title p{
                        margin:2px 0;
                    font-size:13px;
            }

                    .title h3{
                        margin - top:8px;
                    font-size:16px;
            }

                    .title h4{
                        margin - top:5px;
                    font-size:15px;
            }

                    table{
                        width:100%;
                    border-collapse:collapse;
            }

                    th, td{
                        border:1px solid #000;
                    padding:6px;
                    font-size:12px;
                    text-align:center;
            }

                    th{
                        background:#f2f2f2;
                    font-weight:bold;
            }

                    tbody tr{
                        page -break-inside:avoid;
            }

                    .signatures{
                        margin - top:50px;
                    display:flex;
                    justify-content:space-between;
                   
            }

                    
                    .sign-line{
                        border - top:1px solid #000;
                    margin-top:40px;
                    padding-top:5px;
                    font-weight:bold;
                    font-size:12px;
                    width:300px;
            }

                    .footer-note{
                        margin - top:20px;
                    font-size:11px;
                    line-height:1.5;
            }

                </style>
            </head>

            <body>

                <div class="header">

                    <div class="logo">
                        <img src="/Logo/nia_logo.png">
                    </div>

                    <div class="title">

                        <h2>NATIONAL INSTITUTE OF AYURVEDA, JAIPUR</h2>

                        <p>Deemed to be University</p>

                        <p>(Ministry of AYUSH, Govt. of India)</p>

                        <p>Jorawar Singh Gate, Amer Road, Jaipur - 302002</p>

                        <h4>MD/MS Semester-I (Batch-2025) Summative Assessment (May 2026)</h4>                      

                    </div>

                </div>

                ${tableHTML}

              

                               <div class="signatures" style="display:flex; justify-content:flex-end; margin-top:50px;">

    <div class="sign-box" style="text-align:center;">

        <img src="/Logo/AdminSignatur.jpg"
             style="height:30px;width:200px;" />

        <div class="sign-line"
             style="border-top:1px solid #000;
                    margin-top:8px;
                    padding-top:5px;
                    font-weight:bold;">
            CONTROLLER OF EXAMINATIONS
        </div>

    </div>

</div>

                            </body>
                        </html>
                        `;

                        var printWindow = window.open('', '', 'width=1200,height=700');

                        printWindow.document.open();
                        printWindow.document.write(printHTML);
                        printWindow.document.close();

                        setTimeout(function () {

                            printWindow.focus();
                        printWindow.print();
                        printWindow.close();

    }, 1000);
}
                       
