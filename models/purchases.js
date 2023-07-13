const { model, Schema } = require('mongoose');

const purchaseSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
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

module.exports = model('purchase', purchaseSchema);