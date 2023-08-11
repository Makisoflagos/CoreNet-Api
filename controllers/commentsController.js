const commentModel = require('../models/commentsModel');
const writerModel = require('../models/writerModel');
const editorModel = require('../models/editorModel');

// creating writer's comment 
exports.createWriterComment = async(req, res) => {
    try {
        // capture the id from the writer
        const writerPost = await writerModel.findById(req.params.id);
        // to create comment
        const {comment} = await commentModel(req.body)
        //const postComment = await new commentModel(req.body);
        const postComment = await new commentModel({comment:comment});
        
        
        postComment.writer = writerPost;
        // save the writer comment
        await postComment.save();
        writerPost.comment.push(postComment)
        //save the writer post
        await writerPost.save();
        res.status(201).json({
            message: "comment sent",
            data:  postComment
        })

    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
}

// get all the writer comments
exports.allWriterComments = async(req, res)=>{
    try{
        const allComents = await commentModel.find()
        res.status(201).json({
            message: "All comments posted",
            data: allComents
        })
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
};

// get a single post comments
exports.singleWriterComment = async(req, res)=>{
    try{
        const singleComent = await commentModel.findById(req.params.id)
        res.status(201).json({
            message: "Single comment",
            data: singleComent
        })
    } catch (error){
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
};

// to update comment
exports.updateWriterComment = async(req, res) => {
    try {
      const updateCom = await commentModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
      updateCom.save();
      
      if (!updateCom){
        res.status(400).json({
            message: "Error tring to update comment"
        })
      } else {
        res.status(201).json({
            message: "Comment successfully updated",
            data: updateCom
        })
      }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

// delete comment
exports.deleteWriterComment = async(req, res)=>{
    try{
        const commentId = req.params.id;
        const writerId = req.params.id;
        const writer = await writerModel.findById(writerId);
        // delete the comment
        const deleteComent = await commentModel.findByIdAndDelete(commentId);

        await writer.comment.push(deleteComent);
        await writer.save();

        res.status(201).json({
            message: "comment successfuly deleted",
        })
    } catch (error){
        res.status(401).json({
            status: "Failed to delete",
            message: error.message
        })
    }
}



// creating editor's comment 
exports.createEditorComment = async(req, res) => {
    try {
        // capture the id from the editor
        const editorPost = await editorModel.findById(req.params.id);
        // to create comment
        const {comment} = await commentModel(req.body)
        const postComment = await new commentModel({comment:comment});
        postComment.editor = editorPost;
        // save the writer comment
        await postComment.save();
        editorPost.comment.push(postComment)
        //save the writer post
        await editorPost.save();
        res.status(201).json({
            message: "comment sent",
            data: postComment
        })

    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
}

// get all the editor comments
exports.allEditorComments = async(req, res)=>{
    try{
        const allComents = await commentModel.find()
        res.status(201).json({
            message: "All comments posted",
            data: allComents
        })
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
};

// get a single post comments
exports.singleEditorComment = async(req, res)=>{
    try{
        const singleComent = await commentModel.findById(req.params.id)
        res.status(201).json({
            message: "Single comment",
            data: singleComent
        })
    } catch (error){
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
};

// to update comment
exports.updateEditorComment = async(req, res) => {
    try {
      const updateCom = await commentModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
      updateCom.save();
      
      if (!updateCom){
        res.status(400).json({
            message: "Error tring to update comment"
        })
      } else {
        res.status(201).json({
            message: "Comment successfully updated",
            data: updateCom
        })
      }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

// delete comment
exports.deleteEditorComment = async(req, res)=>{
    try{
        const commentId = req.params.id;
        const EditorId = req.params.id;
        const editor = await editorModel.findById(EditorId);
        // delete the comment
        const deleteComent = await commentModel.findByIdAndDelete(commentId);

        await editor.comment.push(deleteComent);
        await editor.save();

        res.status(201).json({
            message: "comment successfuly deleted",
        })
    } catch (error){
        res.status(401).json({
            status: "Failed to delete",
            message: error.message
        })
    }
}
