const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    _id: { type: String },
    id: { type: String, index: { unique: true } },
    username: { type: String, index: { unique: true } },
    password: String
});
const User = mongoose.model("User", userSchema);
module.exports = User;
