const Joi = require("@hapi/joi");

const writerValidationSchema = (req, res, next) => {
    // Define the validation schema using Joi
    const schema = Joi.object ({
      FullName: Joi.string().required().messages({
    "any.required": "Fullname is required.",
    "string.empty": "Fullname cannot be empty.",
    "string.min": "Fullname must be at least 3 characters long",
    "string.pattern.base": "Fullname cannot start and end with a whitespace"
  }),
  UserName: Joi.string().required().messages({
    "any.required": "Username is required.",
    "string.empty": "Username cannot be empty.",
    "string.min": "Username must be at least 3 characters long",
    "string.pattern.base": "Username cannot start and end with a whitespace"
  }),
  Email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Invalid email format.",
  }),
  Password: Joi.string()
  .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
  .required().messages({
    "any.required": "Password is required.",
    "String.pattern.base": "Password must contain at least 8 characters, one Capital letter, and one special character (!@#$%^&*)."
    }),
    
    });
  
    // Validate the request body against the schema
    const { error } = schema.validate(req.body, { abortEarly: false });
  
    // If there's a validation error, return a response with the error details
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(" ");
      return res.status(400).json({ error: errorMessage });
    }
  
    // If validation is successful, move to the next middleware
    next();
  };

module.exports = {writerValidationSchema}


