const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: "this is required"
    },
    email: {
        type: String,
        required: "this is required",
        unique: true
    },
    password: {
        type: String,
        required: "this is required"
    }
}, {
    
    timestamps: true
})

const User = mongoose.model("User", UserSchema);

module.exports = User;