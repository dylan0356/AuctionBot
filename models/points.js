const { model, Schema } = require('mongoose');

const pointsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
        default: 10,
    },
});

module.exports = model('points', pointsSchema);