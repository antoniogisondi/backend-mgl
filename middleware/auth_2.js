const jwt = require('jsonwebtoken');

// Middleware di protezione per le rotte che richiedono autenticazione
const protect_2 = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Token mancante o non valido');
        return res.status(401).json({ message: 'Accesso non autorizzato: nessun token fornito' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_2);
        req.user = decoded; // Imposta i dati dell'utente decodificati
        next();
    } catch (error) {
        console.error('Errore di autenticazione:', error);
        return res.status(401).json({ message: 'Token non valido' });
    }
};

module.exports = protect_2;

