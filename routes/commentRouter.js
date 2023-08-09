const express = require("express");
const router = express.Router()
const { createWriterComment, allWriterComments, singleWriterComment, updateWriterComment, deleteWriterComment, createEditorComment, singleEditorComment, allEditorComments, updateEditorComment, deleteEditorComment} = require('../controllers/commentsController');

router.route("/writercomment").post( createWriterComment )
router.route("/writercomment").put( updateWriterComment )
router.route("/writercomment").get( allWriterComments )
router.route("/writercomment").get( singleWriterComment )
router.route("/writercomment").delete( deleteWriterComment )

router.route("/editorcomment").post( createEditorComment )
router.route("/editorcomment").put( updateEditorComment )
router.route("/editorcomment").get( allEditorComments )
router.route("/editorcomment").get( singleEditorComment )
router.route("/editorcomment").delete( deleteEditorComment )




module.exports = router