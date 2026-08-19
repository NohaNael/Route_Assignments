import { Request, Response } from "express";
import { IconfirmEmailDTO, ILoginDTO, ISignUpDTO } from "./auth.dto";
import { badRequestException, conflictException, notFoundException } from "../../Utils/response/error.response";
import {userModel} from "../../DB/models/user.model";
import { generateOtp } from "../../Utils/generateOtp";
import { compareHash, generateHash } from "../../Utils/sec/hash";
import { eventEmitter } from "../../Utils/events/events.email";
import { createLoginCredentials } from "../../Utils/sec/token";
class AuthService {
  constructor() {}



  signup=async(req:Request,res:Response):Promise<Response> =>{

    const {username,email,password}:ISignUpDTO = req.body;

    const checkUser = await userModel.findOne({email}).select("email");
    if(checkUser){
      throw new conflictException("User already exists");
    }
    const otp=generateOtp();
    const [user]=await userModel.create
    ([{username,email,
      password:await generateHash(password),
      confirmemailOTP: await generateHash(otp)}
    ],
    {validateBeforeSave:true}
  );
  eventEmitter.emit("confirmEmail",{
    to:email,
    username,otp
})
return res.status(201).json({message:"User created successfully",user});
}


 confirmEmail=async(req:Request,res:Response):Promise<Response> => {
  const {email,otp}:IconfirmEmailDTO = req.body;
  
  const user = await userModel.findOne({email,confirmemailOTP:{$exists:true},confirmedAt:{$exists:false}});
  if(!user){
    throw new notFoundException("User not found or already confirmed");
  }

  if(!await compareHash(otp,user.confirmemailOTP!)){
    throw new badRequestException("Invalid OTP");
  }

  await userModel.updateOne({email,},{confirmedAt:new Date(),$unset: {confirmemailOTP:true}});


   
return res.status(201).json({message:"User created successfully",user});
}


  login=async(req:Request,res:Response):Promise<Response> => {
  const {email,password}:ILoginDTO = req.body;
  
  const user = await userModel.findOne({email, confirmedAt:{$exists:true}});
  if(!user){
    throw new notFoundException("invalid account");
  }

  if(!await compareHash(password,user.password)){
    throw new badRequestException("Invalid password");
  }

  const credentials = await createLoginCredentials(user);

return res.status(200).json({message:"done", credentials});
}
}
export default new AuthService();

