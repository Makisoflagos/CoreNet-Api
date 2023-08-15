const express = require("express");
const router = express.Router()

   
    
// const { createWriterComment, allWriterComments, singleWriterComment, updateWriterComment, deleteWriterComment, createEditorComment, allEditorComments, singleEditorComment, updateEditorComment, deleteEditorComment} = require ("../controllers/commentsController")

const {CreateCommentEditor} = require("../controllers/commentsController")
const {CreateCommentWriter} = require("../controllers/commentsController")


// // editor comment route
router.route("/:id/create-editor-comment/:editorId").post(CreateCommentEditor)
// router.route("/:")
// router.route("/all-editor-comments").get(allEditorComments)
// router.route("/single-editor-comment/:id").get(singleEditorComment)
// router.route("/update-editor-comment/:id").put(updateEditorComment)
// router.route("/delete-editor-comment/:id").delete(deleteEditorComment)

// writer comment route
router.route("/:taskId/create-writer-comment/:writerId").post(CreateCommentWriter)
// router.route("/all-writer-comments").get(allWriterComments)
// router.route("/single-writer-comment/:id").get(singleWriterComment)
// router.route("/update-writer-comment/:id").put(updateWriterComment)
// 


module.exports = 
    router
