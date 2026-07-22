import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    jti:{
        type: String,
        required: true,
        unique: true
    },
    userId:{    
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expiresIn: {
        type: Date,
        required: true
    }
},
{ timestamps: true }


);

//ttl
tokenSchema.index("expiresIn", { expireAfterSeconds: 0 });  //there is a delay in mongodb to delete the document after the expiration time

const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;