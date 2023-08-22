const express = require("express");
const router = express.Router()

   
    
// const { createWriterComment, allWriterComments, singleWriterComment, updateWriterComment, deleteWriterComment, createEditorComment, allEditorComments, singleEditorComment, updateEditorComment, deleteEditorComment} = require ("../controllers/commentsController")

const {CreateCommentEditor, replyToComment} = require("../controllers/commentsController")
const {CreateCommentWriter} = require("../controllers/commentsController")


// // editor comment route
router.route("/:id/create-editor-comment/:editorId").post(CreateCommentEditor);
router.route("/:commentId/reply-comment/:userId").post (replyToComment)


// writer comment route
router.route("/:taskId/create-writer-comment/:writerId").post(CreateCommentWriter)



module.exports = 
    router
