const mongoose = require('mongoose');

module.exports = mongoose.model('users', {
    name: { type: String, required: true},
    email: { type: String, unique: true, required: true},
    googleId: { type: String, unique: true, required: true},
    avatar: { type: String, default: '', required: true},
    role: { type : Number, default: 0 },
    online: { type : Number, default: 0 },
    create_at : { type : Date, default: Date.now },
    updated_at : { type : Date, default: Date.now }
});