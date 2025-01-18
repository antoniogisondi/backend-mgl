const {PDFDocument, StandardFonts, rgb} = require('pdf-lib')
const fs = require('fs')
const path = require('path')

exports.generateCertificate = async (participant,course) => {
    function durataTotale(dateEOrari) {
        return dateEOrari.reduce((totale, giorno) => totale + giorno.durata_ore, 0)
    }

    function estraiDate(dateEOrari) {
        return dateEOrari.map((giorno) => {
            const data = new Date(giorno.giorno)
            return data.toLocaleDateString("it-IT", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        }).join(' e ')
    }

    const texts = {
        data_di_nascita: `Nato/a il ${participant.data_nascita}, a ${participant.comune_nascita} (${participant.provincia_comune_nascita})`,
        mansione: `Profilo professionale: ${participant.mansione}`,
        descrizione_corso: `Ha frequentato il ${course.nome_corso} della durata di ${durataTotale(course.durata_corso)} ore, svoltosi nelle date 
        ${estraiDate(course.durata_corso)} presso la sede di MGL Consulting S.r.l.s. via Casalnuovo n. 4 - 85024 - Lavello (PZ), superando la verifica di apprendimento.`,
    }

    try {
        const templatePath = path.join(__dirname, "..", "config", "template", "template.pdf");
        const pdfBuffer = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const secondPage = pages[1]

        const {width, height} = firstPage.getSize()

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const centerTextUppercase = (text, fontSize) => {
            const upperText = text.toUpperCase()
            const textWidth = font.widthOfTextAtSize(upperText, fontSize);
            return (width - textWidth) / 2 ; // Centra il testo
        };

        const centerTextX = (text,fontSize) => {
            const textWidth = font.widthOfTextAtSize(text,fontSize)
            return (width - textWidth) / 2
        }

        const replacements = [
            { text: course.nome_corso.toUpperCase(), x: centerTextUppercase(course.nome_corso, 19), y: 600, size: 19 },
            { text: `${participant.nome.toUpperCase()} ${participant.cognome.toUpperCase()}`, x: centerTextUppercase(`${participant.nome.toUpperCase()} ${participant.cognome.toUpperCase()}`, 24), y: 500, size: 24 },
            { text: texts.data_di_nascita, x: centerTextX(texts.data_di_nascita, 14), y: 480, size: 14 },
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
    