// Assuming you have models for Editor, Writer, and Comment
const Editor = require('../models/editorModel');
const Writer = require('../models/writerModel');
const Comment = require('../models/commentsModel');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { userId, userType, text } = req.body;

    // Find the user by their ID
    let user;
    if (userType === 'editor') {
      user = await Editor.findById(userId);
    } else if (userType === 'writer') {
      user = await Writer.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new comment
    const newComment = new Comment({
      user: user._id,
      text,
      replies: [], // Initialize replies as an empty array
    });

    await newComment.save();

    res.status(201).json({ message: 'Comment created successfully', data: newComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { userId, userType, text } = req.body;
    const commentId = req.params.commentId;

    // Find the user by their ID
    let user;
    if (userType === 'editor') {
      user = await Editor.findById(userId);
    } else if (userType === 'writer') {
      user = await Writer.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Create a new reply
    const newReply = {
      user: user._id,
      text,
    };

    // Add the reply to the comment's replies array
    comment.replies.push(newReply);

    await comment.save();

    res.status(201).json({ message: 'Reply added successfully', data: comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  replyToComment,
};

// // get all the writer comments
//     const allWriterComments = async(req, res)=>{
//     try{
//         const allComents = await commentModel.find()
//         res.status(201).json({
//             message: "All comments posted",
//             data: allComents
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: "Failed",
//             message: error.message
//         })
//     }
// };

// // get a single post comments
//     const singleWriterComment = async(req, res)=>{
//     try{
//         const singleComent = await commentModel.findById(req.params.id)
//         res.status(201).json({
//             message: "Single comment",
//             data: singleComent
//         })
//     } catch (error){
//         res.status(400).json({
//             status: "failed",
//             message: error.message
//         })
//     }
// };

// // to update comment
// const updateWriterComment = async(req, res) => {
//     try {
//       const updateCom = await commentModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
//       updateCom.save();

//       if (!updateCom){
//         res.status(400).json({
//             message: "Error tring to update comment"
//         })
//       } else {
//         res.status(201).json({
//             message: "Comment successfully updated",
//             data: updateCom
//         })
//       }
//     } catch (error) {
//         res.status(400).json({
//             message: error.message
//         })
//     }
// }

// // delete comment
//  const deleteWriterComment = async(req, res)=>{
//     try{
//         const commentId = req.params.id;
//         const writerId = req.params.id;
//         const writer = await writerModel.findById(writerId);
//         // delete the comment
//         const deleteComent = await commentModel.findByIdAndDelete(commentId);

//         await writer.comment.push(deleteComent);
//         await writer.save();

//         res.status(201).json({
//             message: "comment successfuly deleted",
//         })
//     } catch (error){
//         res.status(401).json({
//             status: "Failed to delete",
//             message: error.message
//         })
//     }
// }



// // creating editor's comment 
// const createEditorComment = async(req, res) => {
//     try {
//         // capture the id from the writer
//         const editorPost = await editorModel.findById(req.params.id);
//         // to create comment
//         const postComment = await new commentModel(req.body);
//         postComment.writer = editorPost;
//         // save the writer comment
//         await postComment.save();
//         editorPost.comment.push(postComment)
//         //save the writer post
//         await editorPost.save();
//         res.status(201).json({
//             message: "comment sent",
//             data: editorPost
//         })

//     } catch (error) {
//         res.status(400).json({
//             status: "Failed",
//             message: error.message
//         })
//     }
// }

// // get all the editor comments
//  const allEditorComments = async(req, res)=>{
//     try{
//         const allComents = await commentModel.find()
//         res.status(201).json({
//             message: "All comments posted",
//             data: allComents
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: "Failed",
//             message: error.message
//         })
//     }
// };

// // get a single post comments
//  const singleEditorComment = async(req, res)=>{
//     try{
//         const singleComent = await commentModel.findById(req.params.id)
//         res.status(201).json({
//             message: "Single comment",
//             data: singleComent
//         })
//     } catch (error){
//         res.status(400).json({
//             status: "failed",
//             message: error.message
//         })
//     }
// };

// // to update comment
//  const updateEditorComment = async(req, res) => {
//     try {
//       const updateCom = await commentModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
//       updateCom.save();

//       if (!updateCom){
//         res.status(400).json({
//             message: "Error tring to update comment"
//         })
//       } else {
//         res.status(201).json({
//             message: "Comment successfully updated",
//             data: updateCom
//         })
//       }
//     } catch (error) {
//         res.status(400).json({
//             message: error.message
//         })
//     }
// }

// // delete comment
//  const deleteEditorComment = async(req, res)=>{
//     try{
//         const commentId = req.params.id;
//         const EditorId = req.params.id;
//         const editor = await editorModel.findById(EditorId);
//         // delete the comment
//         const deleteComent = await commentModel.findByIdAndDelete(commentId);

//         await editor.comment.push(deleteComent);
//         await editor.save();

//         res.status(201).json({
//             message: "comment successfuly deleted",
//         })
//     } catch (error){
//         res.status(401).json({
//             status: "Failed to delete",
//             message: error.message
//         })
//     }
// }
  
// // export module
// module.exports = {
//     createWriterComment,
//     allWriterComments,
//     singleWriterComment,
//     updateWriterComment,
//     deleteWriterComment,
//     createEditorComment,
//     allEditorComments,
//     singleEditorComment,
//     updateEditorComment,
//     deleteEditorComment

// }