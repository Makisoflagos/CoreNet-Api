


// call the needed modules

const mongoose = require("mongoose");

// new mongoose schema

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: ["FirstName is required", true]
    },
    Surname: {
        type: String,
        required: ["Surname is required", true]
    },
    UserName: {
        type: String,
        required: ["Username is required", true],
        
    },
    Email: {
        type: String,
        required: ["Email is required", true],
        unique: true,
    },
    Password: {
        type: String,
        required: ["Password is required", true]
    },
    CompanyName: {
      type: String,
      required: ["CompanyName is required", true]
    },
    ProfileImage: {
        type: String,
    },
    PublicId: {
        type: String
    },
    token: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false    
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "Editor"
    },
    Writers: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Writers'
    }],
    task: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Tasks"
    }],
    comment: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comments"
    } ]     
}, {timestamps: true})

const editorModel = mongoose.model("Editors", UserSchema);

// EXPORT THE MODEL

module.exports = editorModel