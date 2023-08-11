const express = require("express");
const router = express.Router()
const { createWriterComment, allWriterComments, singleWriterComment, updateWriterComment, deleteWriterComment, createEditorComment, singleEditorComment, allEditorComments, updateEditorComment, deleteEditorComment} = require('../controllers/commentsController');

router.route("/writercomment/:id").post( createWriterComment )
router.route("/writercomment/:id").put( updateWriterComment )
router.route("/writercomment").get( allWriterComments )
router.route("/writercomment/:id").get( singleWriterComment )
router.route("/writercomment/:id").delete( deleteWriterComment )

router.route("/editorcomment/:id").post( createEditorComment )
router.route("/editorcomment/:id").put( updateEditorComment )
router.route("/editorcomment").get( allEditorComments )
router.route("/editorcomment/:id").get( singleEditorComment )
router.route("/editorcomment/:id").delete( deleteEditorComment )




module.exports = router