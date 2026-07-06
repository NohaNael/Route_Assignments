import joi from "joi";
import { Types } from "mongoose";
import { badRequestResponse } from "../utils/err.response.js";

export const generalfields= {
    Fname: joi.string().required().min(5).max(10) ,
      Lname: joi.string().required().min(5).max(10),
      email: joi.string().email({ tlds: { allow: ["com","gmail"] } }),
      password: joi.string().min(8).required().alphanum(),
      phone: joi.string().pattern(/^(\+20|020|0)?1[0125][0-9]{8}$/),
      DOB: joi.date().iso(),
      gender: joi.string().valid("male", "female"),
      DOB: joi.date().iso(),
      id:joi.string().custom((value, helpers) => {
        return Types.ObjectId.isValid(value) ||helpers.message("Invalid ObjectId");
      })
      
      
}

export const validation =(schema)=>{
    return async (req,res,next)=>{
        const error=[];
        for (const key in Object.keys(schema)) {
            const result= await schema[key].validate(req[key],{abortEarly:false});
            if (result.error) {
                error.push({key,details:result.error.details});
            }
        }
            
        if (error.length > 0) {
            throw badRequestResponse("validation error",error);
           return next();
        }
}}