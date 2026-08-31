import {HydratedDocument, Model, model, Schema, Types} from "mongoose";
import { Genderenum, Roleenum } from "../../Utils/enums/user.enum";
import { generateHash } from "../../Utils/sec/hash";
import { encrypt } from "../../Utils/sec/encryption";
import { generateOtp } from "../../Utils/generateOtp";
import { eventEmitter } from "../../Utils/events/events.email";





export interface IUser {
    _id: string;
    firstname: string;
    lastname: string;
    username?: string;
    email: string;
    confirmedAt?: Date;
    confirmemailOTP?: string;

    password: string;
    resetPasswordOTP?: string;
    deviceToken?: string;
    notificationenabled?: boolean;

    phone: string;
    address?: string;
    gender: Genderenum;
    role: Roleenum;
    createdAt: Date;
    updatedAt?: Date;
    friends?: Types.ObjectId[];
    blockedUsers?: Types.ObjectId[];

}


export const userSchema = new Schema<IUser>({
    firstname: {type: String, required: true,minlength: 3, maxlength: 50},
    lastname: {type: String, required: false, default: '', maxlength: 50},
    email: {type: String, required: true, unique: true,trim: true, lowercase: true},
    confirmedAt: {type: Date, required: false},
    confirmemailOTP: {type: String},
    password: {type: String, required: true},
    resetPasswordOTP: {type: String},
    phone: {type: String,required:true},
    address: {type: String, required: false},
    gender: {type: String, enum: Object.values(Genderenum),default:Genderenum.Female},
    role: {type: String, enum: Object.values(Roleenum), default: Roleenum.User},
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    blockedUsers: [{type: Schema.Types.ObjectId, ref: "User"}],
    deviceToken: {type: String, required: false},
    notificationenabled: {type: Boolean, default: true}

    },
    {timestamps: true,toObject: {virtuals: true},toJSON: {virtuals: true,transform (doc, ret:Record<string, unknown>) {
        delete ret.password;
        delete ret.confirmemailOTP;
        delete ret.resetPasswordOTP;
        return ret;

    }

    }})


userSchema.virtual('username').set(function (value: string) {
    const [firstname, ...rest] = value.trim().split(/\s+/);
    this.set({firstname,lastname:rest.join(' ')})}).get(function (this:IUser) {
        return `${this.firstname} ${this.lastname}`;
    
  })


userSchema.pre('validate', function () {
    this.email = this.email.toLowerCase().trim();
})

userSchema.post('save', function (doc, next) {
    console.log('Post save:', doc);
    next();


})


userSchema.pre('save',async function (this:HUserDoc & {wasNew: boolean}) {
    this.wasNew = this.isNew;
    if(this.isModified('password')){
         this.password = await generateHash(this.password);
    }
    if(this.isModified('phone')){
        this.phone = await encrypt(this.phone);
    }
})

userSchema.post('save', async function() {
    const that=this as HUserDoc & {wasNew: boolean};
    console.log(that.wasNew);
    if (that.wasNew) {
        await eventEmitter.emit("confirmEmail", {otp:generateOtp(), to: this.email, username: this.username});
    }
})

userSchema.pre("updateOne",{document:true},async function () {
    console.log(this);
})
    
export const userModel:Model<IUser> = model<IUser>('User', userSchema);   

export type HUserDoc=HydratedDocument<IUser>;
