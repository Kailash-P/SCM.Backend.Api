// NAMESPACE

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v1: uuidv1 } = require('uuid');
const User = require('../../models/admin/user');

// METHODS

exports.signUp = async(req, res) => {
    try {
    
        // validate

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array()[0].msg });
        }

        // validate email - only unique allowed

        if(User.findOne({ where: { email: req.body.email }})){
            return res.status(400).json({
                Message: "This email is already connected to an account."
            });
        }

        // save user

        var userObj = await User.create(req.body);

        if(!userObj){
            return res.status(400).json({
                Message: "User SignUp failed."
            });
        } else {
            return res.json(userObj);
        }
    }
    catch(err) {
        console.log(err);
    }
}

exports.signIn = async (req, res) => {
    // validate

    const errors = validationResult(false);

    if(!errors.isEmpty()){
        return res.status(400).json({
            Message: "SignIn failed."
        });
    }

    var userObj = await User.findOne({ where: { email: req.body.email } });    

    if(!userObj){
        return res.status(400).json({
            Message: "SignIn failed."
        });
    }

    // authenticate password

    if(!User.authenticatePassword(req.body.password, userObj.salt, userObj.password)){
        return res.status(400).json({
            Message: "Invalid Password."
        });
    }

    // create a token

    const authToken = jwt.sign({ id: userObj.id }, process.env.SECRET);

    // put bearerToken into the cookie

    res.cookie("authToken", authToken, { expire: new Date() + 9999 });

    // send response to the front end.

    const { id, first_name, email, is_admin, is_universal_user  } = userObj;        
    return res.json({ authToken, user: { id, first_name, email, is_admin, is_universal_user  }});
};

exports.signOut = (req, res) => {
    // clear the cookie which contains the token
    res.clearCookie("authToken");

    return res.json({
        message: "User is signed out successfully."
    });
};