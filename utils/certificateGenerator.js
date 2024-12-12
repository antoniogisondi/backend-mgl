const PDFDocument = require('pdfkit')

exports.generateCertificate = async (participant, course) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();

            // Buffer per raccogliere i dati del PDF
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers)); // Colleziona i dati PDF
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers); // Combina i dati in un unico buffer
                resolve(pdfData); // Risolvi la promessa con il buffer PDF
            });

            // Contenuto del PDF
            doc.fontSize(25).text('Attestato di Completamento', { align: 'center' });
            doc.moveDown();
            doc.text(`${course.nome_corso}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(18).text(`${participant.nome} ${participant.cognome}`, { align: 'center' });
            doc.moveDown();
            doc.text(`della durata di ${course.durata_corso.reduce((acc, day) => acc + day.durata_ore, 0)} ore`, { align: 'center' });
            doc.moveDown();
            doc.text('Congratulazioni', {align: 'center'})

            // Chiudi il documento PDF
            doc.end();
        } catch (error) {
            reject(error); // Rigetta la promessa in caso di errore
        }
    });
};
    