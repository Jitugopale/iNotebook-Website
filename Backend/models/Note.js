const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
    //user ko store kr skta hai, user ke note vo hi dekh paye
    user:{
        type:mongoose.Schema.Types.ObjectId, //konsa vala user link kr raha hai , userId store kranga, is model mai koi user entry hogi
        ref:'user' //reference model
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports= mongoose.model('notes',NotesSchema)