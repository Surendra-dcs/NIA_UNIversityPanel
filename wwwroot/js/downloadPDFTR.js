function downloadPDF() {
    const element = document.getElementById("ledgerPage");
    const button = document.querySelector(".download-btn");

    button.disabled = true;

    htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",

        width: 1440,
        height: element.scrollHeight,

        canvasWidth: 1440,
        canvasHeight: element.scrollHeight,

        style: {
            width: "1400px",
            margin: "0",
            transform: "none"
        }
    }).then(function (dataUrl) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("landscape", "mm", "a4");

        const pageWidth = 297;
        const pageHeight = 210;

        const img = new Image();
        img.src = dataUrl;

        img.onload = function () {
            const margin = 5;

            const availableWidth = pageWidth - margin * 2;
            const availableHeight = pageHeight - margin * 2;

            const ratio = Math.min(
                availableWidth / img.width,
                availableHeight / img.height
            );

            const imgWidth = img.width * ratio;
            const imgHeight = img.height * ratio;

            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);
            pdf.save("tabulation-register.pdf");

            button.disabled = false;
        };
    });
}