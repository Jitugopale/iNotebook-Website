const express= require('express');
const Note = require('../models/Note');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator'); // validate user input

// Route 1: Get all the User Notes using GET "/api/notes/fetchallnotes"  login required
//from database user all notes will be fetch jo user already loggedin hai 
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id}); //sara notes miljayenga
        res.json(notes); //send notes array    
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");   
   }
    
});

// Route 2: Add a new Note using POST "/api/notes/addnote"  login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 characters').isLength({min:5}),
],async(req,res)=>{
    try {
        //use destructuring concepts
        const {title,description,tag}=req.body;
        // If there are errors return bad request and errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const note = new Note({    //return promise
            title,description,tag,user:req.user.id // attach id from jwt token
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");   
   }
});

// Route 3: Update an existing Note using PUT "/api/notes/updatenote" login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
try {
    const {title,description,tag} = req.body;
    //Create a newNote object
    const newNote = {};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    //find the note to be updated and update it
    let note = await Note.findById(req.params.id);  //req.params.id = :id
    if(!note){
        return res.status(404).send("Not found");
    }

    if(note.user.toString()!==req.user.id){  //note.user.toString() gives userId
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true}); //If any new comes then created //note will be updated
    res.json({note});
  
}
catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");   
}
});


// Route 4: Delete an existing Note using DELETE "/api/notes/deletenote" login required

router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    // const {title,description,tag} = req.body;
try {
    //find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);  //req.params.id = :id
    if(!note){
        return res.status(404).send("Not found");
    }

    //Allow deletions only if users owns this Note
    if(note.user.toString()!==req.user.id){  //note.user.toString() gives userId
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id); //If any new comes then created //note will be updated
    res.json({"Success":"Note has been Deleted", note:note});

    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");   
}
});   

module.exports = router