// call the needed modules

const mongoose = require("mongoose");

// new mongoose schema

const UserSchema = new mongoose.Schema({
    UserName: {
           type: String,
    },
    userType: {
        type: String,
    }
}, 
{
    timestamps: true
})

const userModel = mongoose.model("User", UserSchema)

module.exports = userModel


