import joi from "joi";
import { Types } from "mongoose";

export const updatePasswordSchema = {
  body:joi.object({
    oldPassword:joi.string().required(),
    newPassword:joi.string().min(8).max(20).required(),
    confirmPassword:joi.ref('newPassword')

})

}
export const freezeSchema = {
  params:joi.object({
    userID:joi.string().custom((value, helpers) => {
      return(Types.ObjectId.isValid(value) || helpers.message("invalid format ")
    ); 
   }),
  }),
};

export const restoreSchema = {
  params:joi.object({
    userID:joi.string().custom((value, helpers) => {
      return(Types.ObjectId.isValid(value) || helpers.message("invalid format ")
    ); 
   }),
  }),
};

export const hardDeleteSchema = {
  params:joi.object({
    userID:joi.string().custom((value, helpers) => {
      return(Types.ObjectId.isValid(value) || helpers.message("invalid format ")
    ); 
   }),
  }),
};