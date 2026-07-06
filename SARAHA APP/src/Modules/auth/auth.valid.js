import joi from "joi";
import * as generalValid from "../../Middlewares/valid.middleware.js"

export const signUpSchema = {
  body:joi.object({
  Fname: generalValid.generalfields.Fname,
  Lname: generalValid.generalfields.Lname,
  email: generalValid.generalfields.email,
  password: generalValid.generalfields.password,
  phone: generalValid.generalfields.phone,
  DOB: generalValid.generalfields.DOB,
  gender: generalValid.generalfields.gender,
  
  }),
};



export const loginSchema = {
  body:joi.object({
  email: generalValid.generalfields.email,
  password: generalValid.generalfields.password,
  
})
};





// id:joi.string().custom((value, helpers) => {
//     return Types.objectId.isValid(value) ||helpers.message("Invalid ObjectId");
//   })