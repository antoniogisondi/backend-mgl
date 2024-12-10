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
                doc.fontSize(18).text(`Certificato a: ${participant.nome} ${participant.cognome}`, { align: 'center' });
                doc.moveDown();
                doc.text(`Corso: ${course.nome_corso}`, { align: 'center' });
                doc.text(`Durata: ${course.durata_corso.reduce((acc, day) => acc + day.durata_ore, 0)} ore`, { align: 'center' });
                doc.text(`Completato in data: ${new Date(course.completionDate).toLocaleDateString('it-IT')}`, { align: 'center' });
    
                // Chiudi il documento PDF
                doc.end();
            } catch (error) {
                reject(error); // Rigetta la promessa in caso di errore
            }
        });
    };
    