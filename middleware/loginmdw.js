const jwt  = require("jsonwebtoken");
const {LOGINTOKGEN} = require("../config/keys")
const User = require("../models/user");

module.exports = (req, res, next) =>{

    const {authorization} = req.headers

    if(!authorization) {
        return res.status(401).json({error:"you need to be logged in"});
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token,LOGINTOKGEN,(err, payload) =>{

        if(err){
            return res.status(401).json({error:"you need to be logged in"})
        }
        const {_id} = payload
        User.findById(_id).then(userdata =>{
            req.user = userdata;
            next()
        })

    })

    
}