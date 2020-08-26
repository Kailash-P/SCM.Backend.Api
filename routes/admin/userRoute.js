// NAMESPACE

const express = require('express');
const { signUp, signIn, signOut } = require('../../controllers/admin/userController');
const { check, validationResult } = require('express-validator');

// INIT

const router = express.Router();

router.post('/signUp', [
    check('first_name').isLength({ min: 5 }).withMessage('First Name must be atleast 5 characters.'),
    check('email').isEmail().withMessage('Must be a valid email.'),
    check('password').isLength({min: 8}).withMessage('Password must be atleast 8 characters long')
], signUp);

router.post('/signIn', [
    check('email').isEmail().withMessage('Must be a valid email.')
], signIn);

router.get('/signOut', signOut);

module.exports = router;