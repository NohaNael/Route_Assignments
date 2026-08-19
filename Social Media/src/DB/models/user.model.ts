import {HydratedDocument, Model, model, Schema} from "mongoose";
import { Genderenum, Roleenum } from "../../Utils/enums/user.enum";




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

    phone?: string;
    address?: string;
    gender: Genderenum;
    role: Roleenum;
    createdAt: Date;
    updatedAt?: Date;

}


export const userSchema = new Schema<IUser>({
    firstname: {type: String, required: true,minlength: 3, maxlength: 50},
    lastname: {type: String, required: false, default: '', maxlength: 50},
    email: {type: String, required: true, unique: true,trim: true, lowercase: true},
    confirmedAt: {type: Date, required: false},
    confirmemailOTP: {type: String},
    password: {type: String, required: true},
    resetPasswordOTP: {type: String},
    phone: {type: String},
    address: {type: String, required: false},
    gender: {type: String, enum: Object.values(Genderenum),default:Genderenum.Female},
    role: {type: String, enum: Object.values(Roleenum), default: Roleenum.User},

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

export const userModel:Model<IUser> = model<IUser>('User', userSchema);   

export type HUserDoc=HydratedDocument<IUser>;
