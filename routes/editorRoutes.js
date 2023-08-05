const express = require("express");
const router = express.Router();

const { signUp, userLogin, signOut, verifyEmail, resendVerificationEmail, changePassword, resetPassword, forgotPassword } = require('../controllers/editorController');
const { getAllEditors, getOneEditor, UpdateEditor, deleteAnEditor } = require("../controllers/editorController");
const { validationMiddleware } = require("../middleware/editorValidation");

router.route ("/").get((req, res) => {
    res.json("Welcome to CoreNet");
});

// Use editorValidationSchema as middleware before signUp

router.route("/signup").post(validationMiddleware, signUp)
router.route("/login").post(userLogin);
router.route("/signout/:id").post(signOut);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/resend-verification-email").post(resendVerificationEmail);
router.route("/change-password/:token").post(changePassword);
router.route('/reset-password/:token').post(resetPassword);
router.route("/forgot-password/:token").post(forgotPassword);

// // editors crud operation route
router.route("/get-all-editors").get(getAllEditors);
router.route("/get-one-editor/:id").get(getOneEditor);
router.route("/update-editor/:id").put(UpdateEditor);
router.route("/delete-editor/:id").delete(deleteAnEditor)

module.exports = router;
