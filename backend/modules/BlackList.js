const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema({
    loginToken: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 },
}, {'collection': 'black_list'});

module.exports = mongoose.model('BlackList', blackListSchema);