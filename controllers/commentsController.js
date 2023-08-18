// Assuming you have models for Editor, Writer, and Comment
const editorModel = require("../models/editorModel");
const writerModel = require("../models/writerModel");
const taskModel = require("../models/taskModel")
const commentModel = require("../models/commentsModel")
const userModel = require("../models/taskModel")

// Create a new comment
const CreateCommentEditor =  async (req, res) => {
    try {
      const { comment } = req.body;

      const id = req.params.id;

      const editor = await editorModel.findById(req.params.editorId)
      
  
      // Check if the task exists
      const task = await taskModel.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Create the comment
      const newComment = new commentModel({
        comment,
        createdBy: editor._id,
        role: editor.role,
        task: task._id,
      });
  
      await newComment.save();
  
      res.status(201).json({ 
        message: 'Comment created successfully', 
        data: newComment });
    } catch (error) {
      res.status(500).json({ 
        message: error.message });
    }
  };
// create writer's comment
const CreateCommentWriter =  async (req, res) => {
    try {
      const { comment } = req.body;
      const taskId = req.params.taskId;

      const writer = await writerModel.findById(req.params.writerId)
      
  
      // Check if the task exists
      const task = await taskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Create the comment
      const newComment = new commentModel({
        comment,
        createdBy: writer._id,
        role: writer.role,
        task: task._id,
      });
  
      await newComment.save();
  
      res.status(201).json({ 
        message: 'Comment created successfully', 
        data: newComment });
    } catch (error) {
      res.status(500).json({ 
        message: error.message });
    }z
  };

// Reply to a comment

const replyCommentEditor = async (req, res) => {
    try {
      const { comment } = req.body;
      
      const commentId = req.params.commentId;
      const editor = await editorModel.findById(req.params.editorId)
  
      // Check if the task and comment exist
      const task = await taskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({
             message: 'Task not found' 
            });
      }
  
      const commented = await commentModel.findById(commentId);
      if (!commented) {
        return res.status(404).json({ 
            message: 'Comment not found' 
        });
      }
  
      // Create the reply
      const newReply = new commentModel({
        text,
        createdBy: editor._id,
        task: task._id,
        role: editor.role,


      });
  
      // Set the parent comment for the reply
      newReply.comment = comment._id;
  
      await newReply.save();
  
      res.status(201).json({ message: 'Reply created successfully', data: newReply });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {
  CreateCommentEditor,
  CreateCommentWriter,
  replyCommentEditor,
};

