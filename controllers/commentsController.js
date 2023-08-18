const commentModel = require('../models/commentsModel');
const writerModel = require('../models/writerModel');
const editorModel = require('../models/editorModel');

// creating writer's comment 
exports.createWriterComment = async(req, res) => {
    try {
        // capture the id from the writer
        const writerId = await writerModel.findById(req.params.id);
        const edithor = await editorModel.findById(req.params.id);
        // to create comment
        const {comment} = await commentModel(req.body)
        //const postComment = await new commentModel(req.body);
        const postComment = await new commentModel({comment:comment});
        
        if (writerId.isVerified !== true){
            return res.status(404).json({
                message: "Writer not verified"
            })
        } else {
        postComment.writer;
        // save the writer comment
        await postComment.save();
        writerId.comment.push(postComment)
        //save the writer post
        await writerId.save();
        }
        res.status(201).json({
            message: "comment posted",
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
        const writerId = await writerModel.findById(req.params.id)
        const allComents = await commentModel.find()
        if (writerId){
            return allComents
        }
        
        res.status(201).json({
            message: `All available comments posted is ${allComents.length}`,
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
        const writerId = await writerModel.findById(req.params.id)
        const singleComent = await commentModel.findById(req.params.id)
;        if (writerId)
         return singleComent

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
      const writerId = await writerModel.findById(req.params.id)
      const updateCom = await commentModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
      if (writerId){
        return updateCom
      }
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
        const writerId = await writerModel.findById(req.params.id);
        
        const comment = await commentModel.findById(req.params.id)
        
        // delete the comment
            await commentModel.findByIdAndDelete(comment);
            
        res.status(201).json({
            message: `comment successfuly deleted`
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
        if (editorPost.isVerified !== true){
            return res.status(404).json({
                message: "Editor not verified"
            })
        } else {
        postComment.editor = editorPost;
        // save the writer comment
        await postComment.save();
        editorPost.comment.push(postComment)
        //save the writer post
        await editorPost.save();
        }
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
        const editorId = await editorModel.findById(req.params.id)
        const allComents = await commentModel.find()
        if (editorId){
            return allComents
        }
        if (allComents)
        res.status(201).json({
            message: `All available comments posted is ${allComents.length}`,
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
        const editorId = await editorModel.findById(req.params.id)
        const singleComent = await commentModel.findById(req.params.id)
;        if (editorId)
         return singleComent

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
        const editorId = await editorModel.findById(req.params.id)
        const updateCom = await commentModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (editorId){
          return updateCom
        }
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
        const editorId = await editorModel.findById(req.params.id);
        
        const comment = await commentModel.findById(req.params.id)
        
        // delete the comment
            await commentModel.findByIdAndDelete(comment);
            
        res.status(201).json({
            message: `comment successfuly deleted`
        })
    } catch (error){
        res.status(401).json({
            status: "Failed to delete",
            message: error.message
        })
    }
}
