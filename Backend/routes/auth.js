const express= require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');



const JWT_SECRET = 'Romanisagood$boy'


// Route 1: Create a User using POST "/api/auth/createUser" Doesn't require auth No login required

router.post('/createUser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5}),


],async(req,res)=>{
    // console.log(req.body);
    // const user = User(req.body);
    // user.save(); 
    // If there are errors return bad request and errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //check wheather user with this email exists already
    try {
    let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({error:"Sorry a user with this email already exists"})
    }
    //create a new user
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass,
    })
    // .then(user=>res.json(user))
    // .catch(err=>{console.log(err)
    // res.json({error:"Please enter unique value for email",message:err.message})})
    const data={
        id: user.id
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    // console.log(authToken);
    res.json(authToken);
}catch (error) {
     console.error(error.message);
     res.status(500).send("Internal Server Error");   
}
});

// Route 2: Authenticate a User using POST "/api/auth/Login" Doesn't require auth No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),


],async(req,res)=>{
    let success=false;
    // If there are errors return bad request and errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body; //password ko bahar nikalunga req.body se
    try {
        //check wheather user with this email exists or not

        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success,error:"Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error:"Please try to login with correct credentials"});
        }

        //If password correct then data bhejunga vo ek data hai user ka

        const data={
            id: user.id
        }
        const authToken = jwt.sign(data,JWT_SECRET); //sabse pahila sign kiya
        success=true;
        res.json({success,authToken}); //authentication token ko bhejunga
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3: Get Loggedin User Details using POST "/api/auth/getuser" login required
//decode authtoken and get userId
//jo jo request mangti hai user authenticated hona chaiye unma ek header bhejunga authentication token nam ka 
//aur us header mai se jo bhi data hai use nikalkar fetch krlunga in userId
router.post('/getuser',fetchuser,async(req,res)=>{
try {
    const userId = req.user.id; //get userId
    const user = await User.findById(userId).select("-password");//after get userId select all fields except password
    res.send(user);
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
});
module.exports = router