import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
     },
     email:{
        type: String,
        required: true,
        unique: true, // Ensure email is unique
     },
     password: {
        
            type: String,
            required: true,
     },
     
        age:{
            type: Number,
             min: [18, "Age must be at least 18"], // custom msg 
             max: [60, "Age must be at most 60"] // custom msg
        
        }   ,
          
           phone:{
            type: String,
             required: true,
        
           } 
            },
            
        
{
    timestamps: true // Automatically add createdAt and updatedAt fields

});

const userModel = mongoose.model("User", userSchema);

export default userModel;   