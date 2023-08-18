// call the needed modules

const mongoose = require("mongoose");

// new mongoose schema

const CommentSchema = new mongoose.Schema({
    comment: {
           type: String,
        required: true
    },
    // reply: [{
    //     type: String,
    // }],
    createdBy : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    editor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Editors"
    },
    writer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Writers"
},
    role: {
        type: String,
    },
    task: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Tasks"
    }
}, 
{
    timestamps: true
})

const commentModel = mongoose.model("Comments", CommentSchema)

module.exports = commentModel


