import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'Wrong format of email').isEmail(),
  body('password', 'The password must contain at least 5 characters').isLength({min: 5}),
  body('fullName', 'The username must contain at least 3 characters').isLength({min: 3}),
  body('avatarUrl', 'Wrong URL address').optional().isURL(),
];