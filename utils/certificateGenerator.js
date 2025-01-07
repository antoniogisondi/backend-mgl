const {PDFDocument, StandardFonts, rgb} = require('pdf-lib')
const pdfParse = require('pdf-parse')
const PizZip = require('pizzip')
const DocxTemplater = require('docxtemplater')
const fs = require('fs')
const path = require('path')

// exports.generateCertificate = async (participant, course) => {
//         try {
//             const templatePath = path.join(__dirname, '..', 'config', 'template', 'template.pdf')
//             const pdfBuffer = fs.readFileSync(templatePath)
//             const pdfDoc = await PDFDocument.load(pdfBuffer)
//             const page = pdfDoc.getPages()
//             const firstPage = page[0]

//             firstPage.drawText(course.nome_corso, {
//                 x: 120,
//                 y:700,
//                 size: 19,
//                 color: rgb(0,0,0)
//             })

//             firstPage.drawText(`${participant.nome} ${participant.cognome}`, {
//                 x: 120, // Coordinate per il segnaposto {NOME}
//                 y: 680,
//                 size: 12,
//                 color: rgb(0, 0, 0),
//             });
    
//             firstPage.drawText(participant.data_nascita, {
//                 x: 120, // Coordinate per {DATA_DI_NASCITA}
//                 y: 660,
//                 size: 12,
//                 color: rgb(0, 0, 0),
//             });
    
//             firstPage.drawText(participant.comune_nascita, {
//                 x: 120, // Coordinate per {CITTA_DI_NASCITA}
//                 y: 640,
//                 size: 12,
//                 color: rgb(0, 0, 0),
//             });
    
//             firstPage.drawText(participant.provincia_comune_nascita, {
//                 x: 120, // Coordinate per {PROVINCIA_NASCITA}
//                 y: 620,
//                 size: 12,
//                 color: rgb(0, 0, 0),
//             });
    
//             firstPage.drawText(participant.mansione, {
//                 x: 120, // Coordinate per {MANSIONE}
//                 y: 600,
//                 size: 12,
//                 color: rgb(0, 0, 0),
//             });

//             const pdfBytes = await pdfDoc.save()
//             fs.writeFileSync(`Attestato-${participant.nome}.pdf`, pdfBytes)
//             return pdfBytes
//         } catch (error) {
//             console.error('Errore durante la generazione del certificato:', error);
//             throw error;
//         }
// };

exports.generateCertificate = async (participant,course) => {
    try {
        const templatePath = path.join(__dirname, "..", "config", "template", "template.pdf");
        const pdfBuffer = fs.readFileSync(templatePath);
        const parsedData = await pdfParse(pdfBuffer);
        const pdfText = parsedData.text;
        console.log("Contenuto del PDF:", pdfText);
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        const pages = pdfDoc.getPages()
        const firstPage = pages[0]

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const replacements = [
            { text: course.nome_corso, x: 120, y: 700, size: 19 },
            { text: `${participant.nome} ${participant.cognome}`, x: 120, y: 680, size: 12 },
            { text: participant.data_nascita, x: 120, y: 660, size: 12 },
            { text: participant.comune_nascita, x: 120, y: 640, size: 12 },
            { text: participant.provincia_comune_nascita, x: 120, y: 620, size: 12 },
            { text: participant.mansione, x: 120, y: 600, size: 12 },
        ];

          // Sovrascrivi i segnaposto visivamente
        replacements.forEach(({ text, x, y, size }) => {
        firstPage.drawText(text, {
            x,
            y,
            size,
            font,
            color: rgb(0, 0, 0),
        });
        });

        const pdfBytes = await pdfDoc.save()
        return pdfBytes
    } catch (error) {
        console.error(error);
    }
}
    