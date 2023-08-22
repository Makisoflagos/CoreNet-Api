// call the models you need
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
    }
  };



  // Reply to a comment
const replyToComment = async (req, res) => {
  try {
      const { comment } = req.body;
      const commentId = req.params.commentId;
      const userId = req.params.userId; // This can be either editorId or writerId

      const commented = await commentModel.findById(commentId).populate("task");
      if (!commented) {
          return res.status(404).json({
              message: 'Comment not found'
          });
      }
      console.log('commented:', commented);

      // Check if the task and comment exist
      const task = await taskModel.findById(commented.task);
      console.log(commented.task)
      if (!task) {
          return res.status(404).json({
              message: 'Task not found'
          });
      }

      const user = await (writerModel.findById(userId) || editorModel.findById(userId));
      if (!user) {
          return res.status(404).json({
              message: 'User not found'
          });
      }

      // Create the reply
      const newReply = new commentModel({
          comment,
          createdBy: user._id,
          task: task._id,
          role: user.role,
          parentComment: commentId // Set the parent comment for the reply
      });

      await newReply.save();

      res.status(201).json({ 
        message: 'Reply created successfully', 
        data: newReply });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// delete a comment
const deleteComment = async (req, res) => {
  try{
      const commentId= req.params.commentId

      // find the comment by ID
      const comment = await commentModel.findById(commentId)
      if (!comment) {
          return res.status(404).json({
            message: `The comment  with id ${commentId} not found`
          });
        }
        const deletedComment = await commentModel.findByIdAndDelete(commentId);

        res.status(200).json({
          message: `Comment deleted successfully`,
          deletedComment
        })
  }catch(error){
      res.status(500).json({
          message: error.message
        })
  }
}

  

module.exports = {
  CreateCommentEditor,
  CreateCommentWriter,
  replyToComment

};



