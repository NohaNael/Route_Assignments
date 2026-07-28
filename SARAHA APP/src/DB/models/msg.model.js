import mongoose from "mongoose";

const msgSchema = new mongoose.Schema(
  {
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
        trim: true,
    },
    receiverID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isfavorite: {
        type: Boolean,
        default: false,
    },
},
  {
    timestamps: true,
  }
);

msgSchema.index({ receiverID:1 });

const Message = mongoose.model("Message", msgSchema);
export default Message;