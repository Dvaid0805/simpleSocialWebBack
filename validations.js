import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Wrong format of email').isEmail(),
  body('password', 'The password must contain at least 5 characters').isLength({min: 5}),
];

export const registerValidation = [
  body('email', 'Wrong format of email').isEmail(),
  body('password', 'The password must contain at least 5 characters').isLength({min: 5}),
  body('fullName', 'The username must contain at least 3 characters').isLength({min: 3}),
  body('avatarUrl', 'Wrong URL address').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Enter the title of the post').isLength({ min: 3 }).isString(),
  body('text', 'Enter the text of the post').isLength({ min: 5 }).isString(),
  body('tags', 'Incorrect tag format').optional().isString(),
  body('imageUrl', 'Wrong URL link').optional().isString(),
];



