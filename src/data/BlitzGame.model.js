const mongoose = require("mongoose");
const blitzGameSchema = new mongoose.Schema({
    _id: { type: String },
    id: { type: String, index: { unique: true } },
    initialUser: String,
    users: Array,
    deckId: String
});
blitzGameSchema.index({createdAt: 1},{expireAfterSeconds: 300});
const BlitzGame = mongoose.model("BlitzGame", blitzGameSchema);
module.exports = BlitzGame;
