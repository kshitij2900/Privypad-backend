var jwt = require('jsonwebtoken');
const fetchuser=(req,res,next)=>{
    // get the user from the jwt token and add id to the request
    const token= req.header('auth-token')
    const JWT_secret="harryisagoodB$oy";
    if(!token){
        res.status(401).send({error :"please authenticate avalid token"})
    }
    try{
        const data=jwt.verify(token,JWT_secret)
        req.user=data.user;
        next();
    }
    catch(error){
        res.status(401).send({error :"please authenticate avalid token"})
    }
}
module.exports=fetchuser;