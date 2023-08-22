const jwt = require("jsonwebtoken");
const editorModel = require("../models/editorModel");

// to authenticate a user token in the database

const authentication = async (req, res, next) => {
    try{
    const editorId = req.params.adminId;
    const editor = await editorModel.findById(userId);
    const editorToken = user.token

        if(!editorToken){
            return res.status(400).json({
                message: `Token not found`
            })
        }

        await jwt.verify(editorToken, process.env.secretKey, (err, payLoad) => {

            if(err){
                return res.json(err.message)
            }else{
                req.user = payLoad,
                next()
            }
        })
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

const authenticate = async (req, res, next) => {
    try{
        
    const editor = await editorModel.findById(req.params.editorId);
    console.log(editor)
    const editorToken = editor.token

        if(!editorToken){
            return res.status(400).json({
                message: `No Authorization found`
            })
        }

        await jwt.verify(editorToken, process.env.secretKey, (err, payLoad) => {

            if(err){
                return res.json(err.message)
            }else{
                req.user = payLoad,
                console.log(req.user)
                next()
            }
        })
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

// Another method to authorize

const checkUser = (req, res, next) => {
    authentication(req, res, async () => {
        if(req.user.isAdmin){
            
            next()
        }else{
            res.status(400).json({
                message: `Not authorized to perform this action`
            })
        }
    })
}

// super admin authorization

const superAdminAuth = (req, res, next) => {
    authentication(req, res, async() => {
        if(req.user.isSuperAdmin){
            next()
        }else{
            res.status(400).json({
                message:`You are not authorized to perform this action`
            })
        }
    })
}

module.exports = {
    checkUser,
    authenticate,
    superAdminAuth

}