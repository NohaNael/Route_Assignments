import mongoose from "mongoose";
import { Gender, UserRole, provider } from "../../utils/enums/user.enum.js";


const userSchema = new mongoose.Schema({
    Fname: {
        type: String,
        required: [true, "First name is required"],
        minlength: 3,
    },
    Lname: {
        type: String,
        required: [true, "Last name is required"],
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return this.provider === provider.SYSTEM; // Password is required only for system users , if it returns true then the field is required otherwise not
        }
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    DOB: Date,
    gender: {
        type: Number,
        enum: Object.values(Gender),
        default: Gender.MALE   // 0 for male, 1 for female
    },
    role: {
        type: Number,
        enum: Object.values(UserRole),  
        default: UserRole.USER
},  
    confirm_email: Date,
    profilePic: String,
    coverPic: [String],

    provider: {
        type: Number,   
        enum: Object.values(provider),
        default: provider.SYSTEM
    }
}, 
{ timestamps: true,toObject: { virtuals: true }, toJSON: { virtuals: true } });

userSchema.virtual("username").get(function() {
    return `${this.Fname} ${this.Lname}`;
});

const User = mongoose.model("User", userSchema);

export default User;
