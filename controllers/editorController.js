// calling the needed modules

require ("dotenv").config();
const editorModel = require("../models/editorModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('../utils/cloudinary');
const validator = require('../middleware/editorValidation')

// create a mailing function

const transporter = nodemailer.createTransport({
    service: process.env.service,
    auth: {
      user: process.env.user,
      pass: process.env.password
    }
  });

// SignUp
const signUp = async ( req, res ) => {
    try {
        // get all data from the request body
        const { FirstName, Surname, UserName, Email, Password, CompanyName } = req.body;

        
    const validation = validator(Email, FirstName, Surname);
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message
      });
    }

        // check if username exists
        const UsernameExists = await editorModel.findOne({ UserName })
        if(UsernameExists){
            res.status( 400 ).json( {
                message: `user with this username: ${UserName} already exist.`
            })
        }
        // check if the entry email exist
        const isEmail = await editorModel.findOne( { Email: Email.toLowerCase() } );
        if ( isEmail ) {
            res.status( 400 ).json( {
                message: `user with this email: ${Email} already exist.`
            })
        } else {
            // salt the password using bcrypt
            const saltedRound = await bcrypt.genSalt( 10 );
            // hash the salted password using bcryptE
            const hashedPassword = await bcrypt.hash( Password, saltedRound );

            // create an editor
            const user = new editorModel( {
                FirstName: FirstName.toUpperCase(),
                Surname: Surname.toUpperCase(),
                UserName,
                Email: Email.toLowerCase(),
                Password: hashedPassword,
                CompanyName
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
            const baseUrl = process.env.BASE_URL
            const mailOptions = {
                from: process.env.user,
                to: Email,
                subject: "Verify your account",
              html: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/users/verify-email/${token}">Verify Email</a>`,
            };

            await transporter.sendMail( mailOptions );

            // save the user
            
             user.token = token
             user.isAdmin = true
             const savedUser = await user.save();

          
            // return a response
            res.status( 201 ).json( {
            message: `Check your email: ${savedUser.Email.toLowerCase()} to verify your account.`,
            data: savedUser,
          //  token
        })
        }
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
             const baseUrl = process.env.BASE_URL
            const mailOptions = {
                from: process.env.user,
                to: Email,
                subject: "Verify your account",
                html: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/users/verify-email/${token}">Verify Email</a>`,
            };


            await transporter.sendMail( mailOptions );

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
    const { UserName, Password } = req.body;

    // Find the editor by their username
    const editor = await editorModel.findOne({ UserName });

    // Check if the editor exists
    if (!editor) {
      return res.status(404).json({
        message: `Username is not found`,
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
    
    // Check if user is verified
    if (!editor.isVerified) {
      return res.status(404).json({
          message: `User with ${editor.Email} is not verified`,
      });
    }

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
      const mailOptions = {
        from:  process.env.user,
        to: editor.Email,
        subject: "Password Reset",
        html: `Please click on the link to reset your password: <a href="${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}">Reset Password</a>. This link expires in Thirty(30) minutes.`,
      };
  
      await transporter.sendMail(mailOptions);
  
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
    const alleditors = await editorModel.find().populate('Writers');
    if(alleditors.length === 0){
       res.status(404).json({
        message: `No Editors in the Database`
       })
    }else{
      res.status(200).json({
        message: `These are the available Editors in the Database, 
        they are ${alleditors.length} in number`,
        data: alleditors
      })
    }

  }catch(error){
    res.status(500).json({
      message: error.message
    })
  }
}

// exportthe function

module.exports = {
    signUp,
    userLogin,
    verifyEmail,
    resendVerificationEmail,
    signOut,
    forgotPassword,
    resetPassword,
    changePassword,
    getAllEditors
    

}