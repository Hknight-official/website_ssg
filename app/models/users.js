const mongoose = require('mongoose');

const users = mongoose.model('users', {
    name: { type: String, unique: true, required: true},
    email: { type: String, unique: true, required: true},
    googleId: { type: String, unique: true, required: true},
    role: { type : Date, default: 0 },
    create_at : { type : Date, default: Date.now },
    updated_at : { type : Date, default: Date.now }
});

module.exports = users