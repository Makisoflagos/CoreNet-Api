// calling the needed modules

require ("dotenv").config();
const writerModel = require("../models/writerModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('../utils/cloudinary');
const editorModel = require("../models/editorModel")
const {sendEmail } = require("../middleware/sendingMail")
const { mailTemplate } = require("../utils/emailtemplate")
const UploadedFile = require("express-fileupload");
const taskModel = require("../models/taskModel")



  // create a writer
  const createWriter = async ( req, res ) => {
    try {
         // get all data from the request body
         const { FullName, UserName, Email, Password,  } = req.body;

        //  get editorid
        const {id} = req.user
        const editor = await editorModel.findById(id)
        console.log(editor)
        if(!editor){
            return res.status(404).json({
                message: `Editor was not found`
            })
        }
        // check if username exists
        const UsernameExists = await writerModel.findOne({ UserName })
        if(UsernameExists){
            return res.status( 400 ).json( {
                message: `user with this username: ${UserName} already exist.`
            })
        }
        // check if the entry email exist
        const isEmail = await writerModel.findOne( { Email: Email.toLowerCase() } );
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
            const user = new writerModel( {
                FullName: FullName.toUpperCase(),
                UserName,
                Email: Email.toLowerCase(),
                Password: hashedPassword,
                

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

            // save the user
            editor.Writers.push(user._id)
            user.createdBy = editor._id
            
             user.token = token
             await editor.save()
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
const verifyWriterEmail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(404).json({
              message: "not found token.",
            });
          }
        // verify the token
        const { Email } = jwt.verify( token, process.env.secretKey );

        const writer = await writerModel.findOne( { Email: Email.toLowerCase()  } );

        // Check if editor exists
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found. Invalid or expired token.",
        });
      }
        // update the user verification
        writer.isVerified = true;

        // save the changes
        await writer.save();

        // update the user's verification status
        const updatedWriter = await writerModel.findOneAndUpdate( {Email: Email.toLowerCase()}, writer );

        res.status( 200 ).json( {
            message: "writer verified successfully",
            data: updatedWriter,
        })

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// resend verification
const resendVerificationWriterEmail = async (req, res) => {
    try {
        // get user email from request body
        const { Email } = req.body;

        // find editor
        const writer = await writerModel.findOne( { Email: Email.toLowerCase() } );
        if ( !writer ) {
            return res.status( 404 ).json( {
                error: "Writer not found"
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
            message: `Verification email sent successfully to your email: ${writer.Email}`
        } );

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
};

// login function
const userLogin = async (req, res) => {
    try {
      // Extract the username, email, and password from the request body
      const { Email, Password } = req.body;
  
      // Find the writer by their email or username
      const writer = await writerModel.findOne({ Email } );
  
      // Check if the writer exists
      if (!writer) {
        return res.status(404).json({
          message: `Email is required to log in`,
        });
      }
  
      // Compare the inputted password with the existing one using bcrypt.compare
      const checkPassword = bcrypt.compareSync(Password, writer.Password);
  
      // Check for password match
      if (!checkPassword) {
        return res.status(400).json({
          message: `Login Unsuccessful`,
          failed: `Invalid PASSWORD`,
        });
      }

      //   check if user is verified
    // if(!writer.isVerified){
    //     return res.status(404).json({
    //         message: `User with ${writer.Email} is not verified`,
            
    //     })
    // }
  
      // Generate a JWT token with the writer's ID and other information
      const token = jwt.sign(
        {
          id: writer._id,
          UserName: writer.UserName,
          Email: writer.Email
        },
        process.env.secretKey,
        { expiresIn: "1d" }
      );
  
      // Save the token to the editor's document
      writer.token = token;
      await writer.save();
  
      // Return success response with token and editor's data
      res.status(200).json({
        message: `User logged in successfully`,
        data: {
          id: writer._id,
          UserName: writer.UserName,
          token: writer.token,
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
        const writerId = req.params.id;

        // update the writer's token to null
        const writer = await writerModel.findByIdAndUpdate(writerId, {token: null}, {new: true})
        if (!writer){
            return res.status(404).json({
                message: `Writer not found`
            })
        }
        res.status(200).json({
            message: `Writer logged out successfully`
        })
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    }

}
// Forgot Password
const forgotPassword = async (req, res) => {
    try {
      const { Email } = req.body;
  
      // Check if the email exists in the userModel
      const writer = await writerModel.findOne({ Email: Email.toLowerCase() });
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found"
        });
      }
  
      // Generate a reset token
      const resetToken = await jwt.sign({ writerId: writer._id }, process.env.secretKey, { expiresIn: "30m" });
  
      // Send reset password email
      const subject = "Kindly Reset your PASSWORD";
            const protocol = req.protocol;
            const host = req.get("host");
           const link = `${protocol}://${host}/api/users/reset-pass/${token}`;
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
  
      // Verify the writer's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the writer's ID from the token
      const writerId = decodedToken.id;
  
      // Find the writer by ID
      const writer = await writerModel.findById(writerId);
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found"
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the editor's password
      writer.Password = hashedPassword;
      await writer.save();
  
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
  
      // Verify the writer's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the writer's Id from the token
      const writerId = decodedToken.id;
  
      // Find the writer by ID
      const writer = await writerModel.findById(writerId);
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found"
        });
      }
  
      // Confirm the previous password
      const isPasswordMatch = await bcrypt.compare(existingPassword, writer.Password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Existing password is incorrect."
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the user's password
      writer.Password = hashedPassword;
      await writer.save();
  
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
  
// get all writers in the database
const getAllWritersByAnEditor = async (req, res) => {
    try {
        const { id }= req.user;
         console.log(id);
        
        const allWriters = await writerModel.find({ createdBy: id});

        // if (allWriters.length === 0) {
        //     res.status(404).json({
        //         message: `There are no writers created by this editor ${editorId} in the Database`
        //     });
        // } else {
            res.status(200).json({
                message: `These are the available writers created by this editor ${id} in the Database. There are ${allWriters.length} in number.`,
                data: allWriters
            });
        // }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

  
  // get one writer from the database
  
  const getAWriterbyAnEditor = async (req, res) => {
    try{
      const { id } = req.user;
      console.log(id)
      const editor = await editorModel.findById(id)
      if(!editor){
        return res.status(200).json({
            message: `The editor you are trying to find does not exist.`
        })
      }
      const writerId = req.params.writerId
      console.log(writerId)
      const oneWriter = await writerModel.findById(writerId)
      if (oneWriter.createdBy.toString() !== editor._id.toString()){
        return res.status(404).json({
          message: `You are Unauthorized to perform this action`
        })
      }else{
        res.status(200).json({
          message: `This is the information about the Writer searched for`,
          data: oneWriter
        })
      }
    }catch(error){
      res.status(500).json({
        message: error.message
      })
    }
  };

//   update a writer

const UpdateWriter = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updatedWriter = await writerModel.findById(id);
      if (!updatedWriter) {
        return res.status(404).json({
          message: `User with id: ${id} not found`,
        });
      }
  
      
    //  get the information from the req.body
    const {UserName, FullName, Email, } = req.body
  
    // const UserNameExists = await writerModel.findOne({ UserName })
    // // check if the Username is present in the database
  
    //       // if (UserNameExists) {
    //       //     return res.status(201).json({
    //       //         message: `Username already exists.`
    //       //     })
    //       // }
          // check if email exists in the databse
          const emailExists = await editorModel.findOne({ Email })
          if (emailExists) {
              return res.status(400).json({
                  message: `Email already exists.`
              })
          }
        
          const file = req.files.ProfileImage
          const result = await cloudinary.uploader.upload(file.tempFilePath)
            
          const writerData = {
            FullName: FullName || updatedWriter.FullName,
            UserName: UserName || updatedEditor.UserName,
            Email: Email || updatedEditor.Email,
            ProfileImage: result.secure_url,
            PublicId : result.public_id // Fix typo in 'public_id'
          };
          console.log(writerData)
       
      
          const newWriter = await writerModel.findByIdAndUpdate(
            id,
            writerData,
            { new: true }
          );
      
          res.status(200).json({
            message: `Writer with id ${id} has been updated`,
            data: newWriter,
          });
        } catch (err) {
          res.status(500).json({
            Error: err.message,
          });
        }
      };
      
      // delete a writer
      const deleteAWriter = async (req, res) => {
        try {
          const writerId = req.params.id;
      
          // Find the writer by ID
          const writer = await writerModel.findById(writerId);
          if (!writer) {
            return res.status(404).json({
              message: `Writer with id ${writerId} not found`
            });
          }
      
          // Delete associated tasks
          const deletedTasks = await taskModel.deleteMany({ writer: writer._id });
      
          // Delete writer's profile image if exists
          if (writer.ProfileImage) {
            const result = await cloudinary.uploader.destroy(writer.PublicId);
          }
      
          // Delete the writer
          const deletedWriter = await writerModel.findByIdAndDelete(writerId);
      
          res.status(200).json({
            message: `Deleted the writer with id ${writerId} successfully`,
            deletedWriter,
            deletedTasks
          });
        } catch (err) {
          res.status(500).json({
            Error: err.message
          });
        }
      };
      



module.exports = {
    createWriter,
    verifyWriterEmail,
    resendVerificationWriterEmail,
    signOut,
    userLogin,
    forgotPassword,
    changePassword,
    resetPassword,
    getAllWritersByAnEditor,
    getAWriterbyAnEditor,
     UpdateWriter,
    deleteAWriter,

}