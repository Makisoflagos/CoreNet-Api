const express = require("express");
const router = express.Router()

const { createTask, AcceptTask, getOneTask, updateTask, deleteTask } = require("../controllers/taskController")
const {checkUser} = require("../middleware/authentication")

router.route("/:id/create-task/:writerId").post( createTask)
router.route("/:writerId/accept-task/:taskId").post(AcceptTask)
router.route("/get-one-task/:id").get(getOneTask)
router.route("/:writerId/update-task/:taskId").put(updateTask)
router.route("/delete-task/:taskId").delete(deleteTask)


module.exports = router