const {PDFDocument, StandardFonts, rgb} = require('pdf-lib')
const fs = require('fs')
const path = require('path')

exports.generateCertificate = async (participant,course) => {
    const texts = {
        data_di_nascita: `Nato/a il ${participant.data_nascita}, a ${participant.comune_nascita} (${participant.provincia_comune_nascita})`,
        mansione: `Profilo professionale: ${participant.mansione}`,
        descrizione_corso: `Ha frequentato il ${course.nome_corso} della durata di tot ore`
    }

    try {
        const templatePath = path.join(__dirname, "..", "config", "template", "template.pdf");
        const pdfBuffer = fs.readFileSync(templatePath);
        const parsedData = await pdfParse(pdfBuffer);
        const pdfText = parsedData.text;
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const secondPage = pages[1]

        const {width, height} = firstPage.getSize()

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const centerTextX = (text, fontSize) => {
            const upperText = text.toUpperCase()
            const textWidth = font.widthOfTextAtSize(upperText, fontSize);
            return (width - textWidth) / 2 ; // Centra il testo
        };

        const replacements = [
            { text: course.nome_corso.toUpperCase(), x: centerTextX(course.nome_corso, 19), y: 600, size: 19 },
            { text: `${participant.nome.toUpperCase()} ${participant.cognome.toUpperCase()}`, x: centerTextX(`${participant.nome.toUpperCase()} ${participant.cognome.toUpperCase()}`, 12), y: 500, size: 12 },
            { text: texts.data_di_nascita, x: 120, y: 660, size: 12 },
            { text: texts.mansione, x: 120, y: 640, size: 12 },
            { text: texts.descrizione_corso, x: 120, y: 620, size: 12 },
            { text: participant.mansione, x: 120, y: 600, size: 12 },
        ];

        firstPage.drawText(replacements[0].text, {
            x: replacements[0].x,
            y: replacements[0].y,
            size: replacements[0].size,
        })

        firstPage.drawText(replacements[1].text, {
            x: replacements[1].x,
            y: replacements[1].y,
            size: replacements[1].size,
        })

        firstPage.drawText(replacements[2].text, {
            x: replacements[2].x,
            y: replacements[2].y,
            size: replacements[2].size,
        })

        firstPage.drawText(replacements[3].text, {
            x: replacements[3].x,
            y: replacements[3].y,
            size: replacements[3].size,
        })

        firstPage.drawText(replacements[4].text, {
            x: replacements[4].x,
            y: replacements[4].y,
            size: replacements[4].size,
        })

        const pdfBytes = await pdfDoc.save()
        return pdfBytes
    } catch (error) {
        console.error(error);
    }
}
    