const express=require('express');
const router= express.Router();
const User= require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { findOne } = require('../models/User');
var fetchuser=require('../middleware/fetchuser');
let success= true;

const JWT_secret="harryisagoodB$oy";

//==========================================================================//
//      ROUTE 1: create user using: POST "/api/auth/createuser"             //
//==========================================================================//

router.post('/createuser',[
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
    ],async (req,res)=>{

        // if errors are present then bad request is returned
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success=false;
            return res.status(400).json({success, errors: errors.array() });
        }
        // checking whether user with same email exists
        try{
            let user=await User.findOne({email:req.body.email})
            console.log(user);
            if(user){
                return req.status(400).json({success: false,error: "Sorry this email already exists"});
            }
            const salt=await bcrypt.genSalt();
            let secpass= await bcrypt.hash(req.body.password,salt);
        
            //creating a new user
            user=await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secpass ,
            })
            const data={
                user:{
                    id: user.id
                }
            }
        const authtoken=jwt.sign(data,JWT_secret);
        let success=true;
        console.log(success,authtoken);
        res.json({authtoken})    
        // .then(user => res.json(user))
        // .catch(err=>{console.log(err)
        //     res.json({error: "please enter a unique value for email"})})
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error ");
    }
})

//======================================================================================//
//    RROUTE 2: authenticate a user using: POST "/api/auth/login" No login required.    //
//======================================================================================//
router.post('/login',[
    body('email','enter valid email').isEmail(),
        body('password','password cannot be blank').exists(),
    ],async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const {email,password}=req.body;
        try{
            let user=await User.findOne({email});
            if(!user){
                return res.status(400).json({ error:"enter valid credentials" });
            }
            const passwordcompare= await bcrypt.compare(password,user.password);
            if(!passwordcompare){
                return res.status(400).json({ error:"enter valid credentials" });
            }
            const data={
                user:{
                    id:user.id
                }
            }
            const authtoken=jwt.sign(data,JWT_secret);
            const success=true;
            res.json({success,authtoken})    
        }
        catch(error){
            console.error(error.message)
            res.status(500).send(" internal server error ");
        }
    })
    
    //===================================================================================================//
    //       ROUTE 3:  Get details of a user using: POST "/api/auth/getuser" login required.             //
    //===================================================================================================//
    
    router.post('/getuser', fetchuser ,async (req,res)=>{
    try{
        let userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);

    }
    catch(error){
        console.error(error.message)
        res.status(500).send(" internal server error ");
    }
    })
    module.exports=router