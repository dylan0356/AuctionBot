const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    itemSecret: {
        type: String,
        required: true,
    },
});

module.exports = model('item', itemSchema);