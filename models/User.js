const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

// imposto lo schema del model degli utenti che si autenticano
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    surname: { type: String, required: true},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

// Funzione che permette di cryptare la password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
        const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Funzione che permette di decryptare la password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);