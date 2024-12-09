    const PDFDocument = require('pdfkit')

    exports.generateCertificate = async (participant, course) => {
        const doc = new PDFDocument

        const buffers = []

        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers)
            return pdfData
        })

        doc.fontSize(25).text('Attestato di Completamento', {align: 'center'})
        doc.moveDown()
        doc.fontSize(18).text(`Certificato a: ${participant.nome} ${participant.cognome}`, { align: 'center' });
        doc.moveDown();
        doc.text(`Corso: ${course.nome_corso}`, { align: 'center' });
        doc.text(`Durata: ${course.durata_corso.reduce((acc, day) => acc + day.durata_ore, 0)} ore`, { align: 'center' });
        doc.text(`Completato in data: ${new Date(course.completionDate).toLocaleDateString('it-IT')}`, { align: 'center' });

        doc.end()

        return new Promise((resolve,reject) => {
            doc.on('finish', () => {
                resolve(Buffer.concat(buffers))
            })

            doc.on('error', reject)
        })
    }