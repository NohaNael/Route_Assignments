import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: [true,"Title must be in lowercase"], 
        validate: {
        validator: function(value) {
            return value !== value.toUpperCase();
        },
        message: "Title must not be entirely uppercase"
    }
     },
     content: {
        type: String,
        required: true,
     },
     userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     }
            },
            
        
{
    timestamps: true // Automatically add createdAt and updatedAt fields

});

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;   