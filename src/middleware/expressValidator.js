import { body, validationResult } from "express-validator";
import User from "../features/user/user.schema.js";

export const signUpFormValidate = async (req, res, next) => {

  const rules = [
    body('bio').notEmpty()
    .withMessage('Bio should not be empty'),
    body('name')
      .isLength({ min: 5, max: 25 })
      .withMessage('Name must be between 5 to 25 characters')
      .custom((value, { req }) => {
        return !/\d/.test(value) && !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);
      })
      .withMessage("Name Doesn't contain Special Character and digit"),
    body('email')
      .isEmail().withMessage('Enter a valid email'),
    body('password')
      .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one digit')
      .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/).withMessage('Password must contain at least one special character'),

    body("profileImage")
      .custom((value, { req }) => {
        // console.log(req.file);
        if (req.file.mimetype === "image/gif" || req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg") {
          return true;
        } else {
          return false;
        }
      }).withMessage("please upload  an image gif, Jpg, Jpeg, Png")
  ];

  for (const rule of rules) {
    await rule.run(req);
  }

  //3. check if there are any errors after running the rules.

  const errors = validationResult(req);
  // console.log('errors', errors);

  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ success: false, msg:'validation Failed', errors: errors });
};