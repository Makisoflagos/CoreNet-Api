// declaring all the available modules

const express = require("express");
const router = express.Router()

const { createWriter, signOut, verifyWriterEmail, resendVerificationWriterEmail, changePassword, resetPassword, forgotPassword, userLogin, getAllWritersByAnEditor, getAWriterbyAnEditor, UpdateWriter, deleteAWriter, } = require('../controllers/writerController')
const upload = require("../utils/multer")
const { writerValidationSchema } = require("../middleware/writerValidation")
const {authenticate} = require("../middleware/authentication");



router.route("/createwriter/:editorId").post( writerValidationSchema, authenticate, createWriter )
router.route("/log-in").post( userLogin )
router.route("/sign-out/:id").post(signOut)
router.route("/verify-emailadd/:token").get(verifyWriterEmail)
router.route('/resend-email').post(resendVerificationWriterEmail)
router.route("/change-pass/:token").post(writerValidationSchema, changePassword)
router.route('/reset-pass/:token').post(writerValidationSchema,resetPassword)
router.route("/forgot-pass/").post(forgotPassword)


// writers CRUD operation
router.route("/get-all-writers/:editorId").get(authenticate, getAllWritersByAnEditor)
router.route("/:editorId/get-a-writer/:writerId").get(authenticate, getAWriterbyAnEditor)
router.route("/update-writer/:id").put(UpdateWriter)
router.route("/delete-writer/:id").delete( deleteAWriter)



module.exports = router