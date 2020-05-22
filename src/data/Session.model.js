const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
    _id: { type: String },
    id: { type: String, index: { unique: true } },
    username: String
});
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
