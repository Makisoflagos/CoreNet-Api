const express = require("express");
const router = express.Router()
const { createWriterComment, allWriterComments, singleWriterComment, updateWriterComment, deleteWriterComment, createEditorComment, singleEditorComment, allEditorComments, updateEditorComment, deleteEditorComment} = require('../controllers/commentsController');

router.route("/writercomment/:id").post( createWriterComment )
router.route("/writercomment/:writerId/:id").put( updateWriterComment )
router.route("/writercomment/:writerId").get( allWriterComments )
router.route("/writercomment/:writerId/:id").get( singleWriterComment )
router.route("/writercomment/:writerId/:id").delete( deleteWriterComment )

router.route("/editorcomment/:id").post( createEditorComment )
router.route("/editorcomment/:editorId/:id").put( updateEditorComment )
router.route("/editorcomment/:editorId").get( allEditorComments )
router.route("/editorcomment/:editorId/:id").get( singleEditorComment )
router.route("/editorcomment/:editorId/:id").delete( deleteEditorComment )




module.exports = router