const mongoose = require('mongoose');

module.exports = mongoose.model('messages', {
    roomId: { type: String, required: true},
    idUser: { type: String, required: true},
    username: { type: String, required: true},
    avatar: { type: String, required: true},
    context: { type: String, required: true},
    isUser: { type: Boolean, required: true},
    status: { type: Number, default: 0},
    time: { type : Date, default: Date.now }
});