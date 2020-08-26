// NAMESPACE

require("dotenv").config();  
const expressJwt = require('express-jwt');

// MIDDLEWARES

exports.isAuthorized = expressJwt({
    secret: process.env.SECRET,
    userProperty: authenticationObject
});

exports.isAuthenticated = (req, res, next) => {
    
    // req.profile is sent in request from the front-end

    let checker = req.profile && req.authenticationObject && req.profile.id == req.authenticationObject.id;

    if(!checker) {
        return res.status(403).json({
            error: "Access Denied."
        });
    }

    next();
};

exports.isAdmin = (req, res, next) => {
   
    // req.profile is sent in request from the front-end

    if(req.profile.is_admin === false) {
        return res.status(403).json({
            error: "Access Denied."
        });
    }
    next();
};

exports.isUniversalUser = (req, res, next) => {
   
    // req.profile is sent in request from the front-end

    if(req.profile.is_universal_user === false) {
        return res.status(403).json({
            error: "Access Denied."
        });
    }
    next();
};