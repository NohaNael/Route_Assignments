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


export const confirmEmailSchema = {
  body:joi.object({
  email: generalValid.generalfields.email,
  otp: joi.string().pattern(/^\d{6}$/).required(),
  
})
};

export const forgetPasswordSchema = {
  body:joi.object({
  email: generalValid.generalfields.email,

  })
}

export const resetPasswordSchema = {
  body:joi.object({
  email: generalValid.generalfields.email,

  })
  .required(),newPassword:joi.string().min(8).max(20).required(),
   otp: joi.string().pattern(/^\d{6}$/).required(),
   confirmPassword:joi.ref('newPassword')

}