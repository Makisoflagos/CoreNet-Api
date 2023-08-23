const Joi = require("@hapi/joi");

const validationMiddleware = (req, res, next) => {
  // Define the validation schema using Joi
  const schema = Joi.object ({
    FirstName: Joi.string().required().messages({
        "any.required": "First name is required.",
        "string.empty": "First name cannot be empty.",
        "string.min": "First name must be at least 3 characters long",
        "string.pattern.base": "First name cannot start and end with a whitespace"
      }),
      Surname: Joi.string().required().messages({
        "any.required": "Last name is required.",
        "string.empty": "Surname cannot be empty.",
        "string.min": "Surname must be at least 3 characters long",
        "string.pattern.base": "Surname cannot start and end with a whitespace"
      }),
      Email: Joi.string().email().required().messages({
        "any.required": "Email is required.",
        "string.email": "Invalid email format.",
      }),
      UserName: Joi.string().required().messages({
        "any.required": "Username is required.",
      }),
      Password: Joi.string()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .required().messages({
    "any.required": "Password is required.",
    "String.pattern.base": "Password must contain at least 8 characters, one Capital letter, and one special character (!@#$%^&*)."
    }),
     CompanyName: Joi.string().required().messages({
            "any.required": "CompanyName is required.",
            "string.empty": "CompanyName cannot be empty.",
            "string.min": "CompanyName must be at least 3 characters long",
            "string.pattern.base": "CompanyName cannot start and end with a whitespace"
            
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

module.exports = { validationMiddleware };


