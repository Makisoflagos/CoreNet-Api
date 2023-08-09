// calling the needed modules

require ("dotenv").config();
const editorModel = require("../models/editorModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('../utils/cloudinary');
const UploadedFile = require("express-fileupload");
const { sendEmail } = require("../middleware/sendingMail")
const { mailTemplate } = require("../utils/emailtemplate")


// SignUp
const signUp = async ( req, res ) => {
    try {
        // get all data from the request body
        const { FirstName, Surname, UserName, Email, Password, CompanyName } = req.body;

        // check if username exists
        const UsernameExists = await editorModel.findOne({ UserName })
        if(UsernameExists){
           return res.status( 400 ).json( {
                message: `user with this username: ${UserName} already exist.`
            })
        }
        // check if the entry email exist
        const isEmail = await editorModel.findOne( { Email: Email.toLowerCase() } );
        if ( isEmail ) {
           return res.status( 400 ).json( {
                message: `user with this email: ${Email} already exist.`
            })
        } 
            // salt the password using bcrypt
            const saltedRound = await bcrypt.genSalt( 10 );
            // hash the salted password using bcryptE
            const hashedPassword = await bcrypt.hash( Password, saltedRound );

            // const enter = await cloudinary.uploader.upload(req.file.path)

            // create an editor
            const user = new editorModel( {
                FirstName: FirstName.toUpperCase(),
                Surname: Surname.toUpperCase(),
                UserName,
                Email: Email.toLowerCase(),
                Password: hashedPassword,
                CompanyName,
                // ProfileImage

            } );

            // create a token
            const token = jwt.sign({
                id: user._id,
                Password: user.Password,
                Email: user.Email,
                isVerified: user.isVerified,
                UserName: user.UserName
            },
    
                process.env.secretKey, { expiresIn: "5 days" },
            );
            user.token = token
            user.isAdmin = true

            // send verification email
            const subject = "Verify your Email";
            const protocol = req.protocol;
            const host = req.get("host");
           const link = `${protocol}://${host}/api/users/verify-email/${token}`;
            const html = await mailTemplate(link, user.UserName);
            const mail = {
            email: Email,
            subject,
            html,
           };
            sendEmail(mail);
            

            // save the user
            const savedUser = await user.save();

          
            // return a response
            res.status( 201 ).json( {
            message: `Check your email: ${savedUser.Email.toLowerCase()} to verify your account.`,
            data: savedUser,
          //  token
        })
        
    } catch (error) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
};

// verify email
const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
      console.log(token);
  
      // Verify the token
      const { Email } = jwt.verify(token, process.env.secretKey);
      console.log(Email);
  
      // Find the editor based on the email
      const editor = await editorModel.findOne({ Email: Email.toLowerCase() });
      console.log(editor);
  
      // Check if editor exists
      if (!editor) {
        return res.status(404).json({
          message: "Editor not found. Invalid or expired token.",
        });
      }
  
      // Update the user verification
      editor.isVerified = true;
  
      // Save the changes
      await editor.save();
  
      res.status(200).json({
        message: "Editor verified successfully",
        data: editor,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  

// resend verification
const resendVerificationEmail = async (req, res) => {
    try {
        // get user email from request body
        const { Email } = req.body;

        // find editor
        const editor = await editorModel.findOne( { Email: Email.toLowerCase()} );
        if ( !editor ) {
            return res.status( 404 ).json( {
                error: "Editor not found"
            } );
        }

        // create a token
            const token = await jwt.sign( { Email: Email.toLowerCase() }, process.env.secretKey, { expiresIn: "50m" } );
            
             // send verification email
             const subject = "Verify your Email";
             const protocol = req.protocol;
             const host = req.get("host");
            const link = `${protocol}://${host}/api/users/verify-email/${token}`;
             const html = await mailTemplate(link);
             const mail = {
             email: Email,
             subject,
             html,
            };
             sendEmail(mail);

        res.status( 200 ).json( {
            message: `Verification email sent successfully to your email: ${editor.Email}`
        } );

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

//login function

const userLogin = async (req, res) => {
  try {
    // Extract the username and password from the request body
    const { Email, Password } = req.body;

    // Find the editor by their username
    const editor = await editorModel.findOne({ Email });

    // Check if the editor exists
    if (!editor) {
      return res.status(404).json({
        message: `Email is not found`,
      });
    }

    // Compare the inputted password with the existing one using bcrypt.compare
    const checkPassword = bcrypt.compareSync(Password, editor.Password);

    // Check for password match
    if (!checkPassword) {
      return res.status(400).json({
        message: `Login Unsuccessful`,
        failed: `Invalid PASSWORD`,
      });
    }
    
    // // Check if user is verified
    // if (!editor.isVerified) {
    //   return res.status(404).json({
    //       message: `User with ${editor.Email} is not verified`,
    //   });
    // }

    // Generate a JWT token with the editor's ID and other information
    const token = jwt.sign(
      {
        id: editor._id,
        UserName: editor.UserName,
        Email: editor.Email,
      },
      process.env.secretKey,
      { expiresIn: "1d" }
    );

    // Save the token to the editor's document
    editor.token = token;
    await editor.save();

    // Return success response with token and editor's data
    res.status(200).json({
      message: `User logged in successfully`,
      data: {
        editorId: editor._id,
        UserName: editor.UserName,
        token: editor.token,
        Email: editor.Email
      },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      message: error.message,
    });
  }
};

  
//   editor sign out
  const signOut = async (req, res) => {
    try {
        const id = req.params.id
        
        // update the user's token to null
        const editor = await editorModel.findByIdAndUpdate(id, {token: null}, {new: true})
        console.log(editor)
        if (!editor){
            return res.status(404).json({
                message: `Editor not found`
            })
        }
        res.status(200).json({
            message: `Editor logged out successfully`
        })
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    }
};


// Forgot Password
const forgotPassword = async (req, res) => {
    try {
      const { Email } = req.body;
  
      // Check if the email exists in the userModel
      const editor = await editorModel.findOne({ Email: Email.toLowerCase() });
      if (!editor) {
        return res.status(404).json({
          message: "Editor not found"
        });
      }
  
      // Generate a reset token
      const resetToken = await jwt.sign({ editorId: editor._id }, process.env.secretKey, { expiresIn: "30m" });
  
      // Send reset password email
      const subject = "Reset Password";
      const protocol = req.protocol;
      const host = req.get("host");
     const link = `${protocol}://${host}/api/users/reset-password/${token}`;
      const html = await mailTemplate(link);
      const mail = {
      email: Email,
      subject,
      html,
     };
      sendEmail(mail);
  
      res.status(200).json({
        message: "Password reset email sent successfully"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  };

  // Reset Password
const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
  
      // Verify the editor's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the editor's ID from the token
      const editorId = decodedToken.id;
  
      // Find the editor by ID
      const editor = await editorModel.findById(editorId);
      if (!editor) {
        return res.status(404).json({
          message: "Editor not found"
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the editor's password
      editor.Password = hashedPassword;
      await editor.save();
  
      res.status(200).json({
        message: "Password reset successful"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  };

// Change Password
const changePassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword, existingPassword } = req.body;
  
      // Verify the user's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the editor's Id from the token
      const editorId = decodedToken.id;
  
      // Find the editor by ID
      const editor = await editorModel.findById(editorId);
      if (!editor) {
        return res.status(404).json({
          message: "Editor not found"
        });
      }
  
      // Confirm the previous password
      const isPasswordMatch = await bcrypt.compare(existingPassword, editor.Password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Existing password is incorrect."
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the user's password
      editor.Password = hashedPassword;
      await editor.save();
  
      res.status(200).json({
        message: "Password changed successful"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  };
  

// get all editors in the database
const getAllEditors = async (req, res) =>{
  try{
    const alleditors = await editorModel.find();
    if(alleditors.length === 0){
       res.status(404).json({
        message: `No Editors in the Database`
       })
    }else{
      res.status(200).json({
        message: `These are the available Editors in the Database, they are ${alleditors.length} in number`,
        data: alleditors
      })
    }

  }catch(error){
    res.status(500).json({
      message: error.message
    })
  }
}

// get one editor from the database

const getOneEditor = async (req, res) => {
  try{
    const { id } = req.params;
    const oneEditor = await editorModel.findById(id)
    if (!oneEditor){
      return res.status(404).json({
        message: `The editor with ths ${id} doesn't exist`
      })
    }else{
      res.status(200).json({
        message: `This is the information about the Editor searched for`,
        data: oneEditor
      })
    }
  }catch(error){
    res.status(500).json({
      message: error.message
    })
  }
};

// update an editor
const UpdateEditor = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEditor = await editorModel.findById(id);
    if (!updatedEditor) {
      return res.status(404).json({
        message: `User with id: ${id} not found`,
      });
    }

    
  //  get the information from the req.body
  const {UserName, FirstName, Surname, Email, CompanyName} = req.body

  const UserNameExists = await editorModel.findOne({ UserName })
  // check if the Username is present in the database

        // if (UserNameExists) {
        //     return res.status(201).json({
        //         message: `Username already exists.`
        //     })
        // }
        // check if email exists in the databse
        const emailExists = await editorModel.findOne({ Email })
        if (emailExists) {
            return res.status(400).json({
                message: `Email already exists.`
            })
        }
        // if (req.file && req.files.ProfileImage) {
        //   const result = await cloudinary.uploader.upload(
        //     req.files.ProfileImage.tempFilePath
            
        //   );
          // console.log(req)
        
          // console.log("secure_url")
        
        const file = req.files.ProfileImage
        const result = await cloudinary.uploader.upload(file.tempFilePath)
          
        const editorData = {
          FirstName: FirstName || updatedEditor.FirstName,
          UserName: UserName || updatedEditor.UserName,
          Surname: Surname || updatedEditor.Surname,
          Email: Email || updatedEditor.Email,
          CompanyName: CompanyName || updatedEditor.CompanyName,
          ProfileImage: result.secure_url,
          PublicId : result.public_id // Fix typo in 'public_id'
        };
        console.log(editorData)
     
    
        const newEditor = await editorModel.findByIdAndUpdate(
          id,
          editorData,
          { new: true }
        );
    
        res.status(200).json({
          message: `Editor with id ${id} has been updated`,
          data: newEditor,
        });
      } catch (err) {
        res.status(500).json({
          Error: err.message,
        });
      }
    };
    
    // delete an editor 
    const deleteAnEditor = async(req, res) => {
     try{
      const id = req.params.id
      const Editor = await editorModel.findById(id)
      if(Editor.ProfileImage){
      const result = await cloudinary.uploader.destroy(Editor.PublicId)
      }
      const deletedEditor = await editorModel.findByIdAndDelete(Editor)
      res.status(200).json({
        message: `Deleted the editor with this id ${id} successfully`,
        data: deletedEditor
      })
     }catch(err){
      res.status(500).json({
        Error: err.message,
      });
     }
    }
// export the function

module.exports = {
  signUp,
  userLogin,
  verifyEmail,
  resendVerificationEmail,
  signOut,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllEditors,
  getOneEditor,
  UpdateEditor,
  deleteAnEditor
    

}