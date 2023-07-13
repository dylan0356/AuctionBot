const { model, Schema } = require('mongoose');

const bansSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: false,
    },
});

module.exports = model('bans', bansSchema);