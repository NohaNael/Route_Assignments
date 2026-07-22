import User from "../../DB/models/user.model.js";
import { findone, create, findoneandupdate, updateone } from "../../DB/db.repo.js";
import {
  badRequestResponse,
  conflictResponse,
  notFoundResponse,
} from "../../utils/err.response.js";
import { hashenum } from "../../utils/enums/sec.enum.js";
import {
  compareHash,
  generateHash,
} from "../../utils/security/hash.security.js";
import { encrypt } from "../../utils/security/enc.sec.js";
import { successResponse } from "../../utils/success.response.js";
import { getNewloginCredentials } from "../../utils/tokens/token.js";
import TokenModel from "../../DB/models/token.model.js";
import { Client_ID } from "../../../config/config.service.js";
import { OAuth2Client } from "google-auth-library";
import { provider as providerEnum} from "../../utils/enums/user.enum.js"; 
import { logoutenum } from "../../utils/enums/user.enum.js";
import {sendEmail, emailsubject} from '../../utils/email/email.utils.js'
import { generateOTP } from "../../utils/generateOTP.utils.js";
import { emailEventEmitter } from "../../utils/events/email.event.js";
import { v4 as uuidv4 } from 'uuid';
import { getRevokedToken, setRevokedToken, revoketokenKey } from "../../DB/models/redis.srvice.js";
import { Access_Token_Admin_Expires_In } from "../../../config/config.service.js";
// ========================= SIGN UP =========================



export const signUp = async (req, res) => {
  
  const { Fname, Lname, email, password, phone, DOB, gender } = req.body;

  if (await findone({ model: User, filter: { email } }))
    throw conflictResponse("email already exists");

  if (!phone)
    throw badRequestResponse("phone is required");
  
  const otp=String(generateOTP());
  const otphashed=await generateHash({plain_text:otp,algorithm:hashenum.ARGON2});

  const hash = await generateHash({
    plain_text: password,
    algorithm: hashenum.ARGON2,
  });

  const encrypted_phone = encrypt(phone);

  const user = await create({
    model: User,
    data: {
      Fname,
      Lname,
      email,
      password: hash,
      phone: encrypted_phone,
      DOB,
      gender,
      confirm_email_Otp: otphashed,
    },
  });

  //send email 
  emailEventEmitter.emit('sendEmail',{to:email,Fname,otp});

  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: { user },
  });
};

// ========================= LOGIN =========================

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findone({
    model: User,
    filter: { email,confirm_email: { $exists: true } },
  });

  if (!user)
    throw notFoundResponse("User not found");

  const isMatch = await compareHash({
    plain_text: password,
    cipher_text: user.password,
    algorithm: hashenum.ARGON2,
  });

  if (!isMatch)
    throw badRequestResponse("Invalid email or password");

  const tokens = await getNewloginCredentials(user);

  return successResponse({
    res,
    statusCode: 200,
    message: "User logged in successfully",
    data: { tokens },
  });
};

// ========================= REFRESH TOKEN =========================
export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;
  
  const user = await findone({  
    model: User,
    filter: { email , confirm_email_Otp: { $exists: true } , confirm_email: { $exists: false } ,}
    ,  
  })
  if (!user) {
    throw notFoundResponse("User not found or email already confirmed");
  }

  const isMatch = await compareHash({
    plain_text: otp,
    cipher_text: user.confirm_email_Otp,
    algorithm: hashenum.ARGON2,
  });

  if (!isMatch) {
    throw badRequestResponse("Invalid OTP");
  }
  await updateone({
    model: User,
    filter: {email},
    update: { confirm_email:Date.now(), $unset: { confirm_email_Otp:true } },
  });
  successResponse({
    res,
    statusCode: 200,
    message: "Email confirmed successfully",
  });
}
export const refreshToken = async (req, res) => {
  const token = await getNewloginCredentials(req.user);

  return successResponse({
    res,
    statusCode: 200,
    message: "Token refreshed successfully",
    data: { token },
  });
};

// ========================= VERIFY GOOGLE TOKEN =========================

async function verifyGoogleToken({ idToken }) {
  const client = new OAuth2Client(Client_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: Client_ID,
  });

  return ticket.getPayload();
}

// ========================= LOGIN WITH GOOGLE =========================

export const loginwithgoogle = async (req, res) => {
  const { idToken } = req.body;

  const {
    email,
    email_verified,
    given_name,
    family_name,
  } = await verifyGoogleToken({ idToken });

  if (!email_verified) {
    throw badRequestResponse("Email is not verified by Google");
  }

  let user = await findone({
    model: User,
    filter: { email },
  });

  // Existing user
  if (user) {
    // User registered with normal email/password
    if (user.provider !== providerEnum.GOOGLE) {
      throw badRequestResponse(
        "This account was registered using email and password."
      );
    }

    const credentials = await getNewloginCredentials(user);

    return successResponse({
      res,
      statusCode: 200,
      message: "User logged in successfully",
      data: { credentials },
    });
  }

  // Create new Google user
  user = await create({
    model: User,
    data: {
      Fname: given_name,
      Lname: family_name,
      email,
      provider: providerEnum.GOOGLE,
    },
  });

  const credentials = await getNewloginCredentials(user);

  return successResponse({
    res,
    statusCode: 201,
    message: "User registered successfully",
    data: { credentials },
  });
};


export const logout = async (req, res) => {
  const {flag}= req.body;
  let status =200;

  switch(flag){
    case logoutenum.logout:
      await create({ model: TokenModel, data: { jti: req.decoded.jti, userId: req.user._id, expiresIn: new Date(req.decoded.exp * 1000) } });
      
  
  return successResponse({
    res,
    statusCode: status,
    message: "User logged out successfully",
  }); 
        status=201;  
        case logoutenum.logoutAll:
          await  updateMany({ model: TokenModel, filter: { userId: req.user._id }, update: {changeCredentialsTime:Date.now()} });
          status = 201;

  return successResponse({
    res,
    statusCode: status,
    message: "User logged out from all devices successfully",
  });



  }



}


export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const otp = String(generateOTP());
  const hashedOTP = await generateHash({ plain_text:otp, algorithm: hashenum.ARGON2 });

  const user = await findoneandupdate({
    model: User,
    filter: { email },
    confirm_email: { $exists: true },
    provider: providerEnum.SYSTEM,
    update: { forgot_password_Otp: hashedOTP },
  });
  if (!user) {
    throw notFoundResponse("User not found or email not confirmed");
  }

  emailEventEmitter.emit('forgetpassword', { to: email, username: user.username, otp });
  successResponse({
    res,
    statusCode: 200,
    message: "OTP sent to email successfully",
  });
};

export const forgetPassword = async (req, res) => {
  const { email, otp,newPassword } = req.body;

  const user = await findone({
    model: User,
    filter: { email ,
    confirm_email: { $exists: true },
    provider: providerEnum.SYSTEM,
    forget_password_Otp: { $exists: true },
}});

  if (!user) {
    throw notFoundResponse("User not found");
  }
  const isValidOTP = await compareHash({plain_text: otp, cipher_text: user.forgot_password_Otp, algorithm: hashenum.ARGON2});
  
  if (!isValidOTP) {
    throw badRequestResponse("Invalid OTP");
  }
  const hashedPassword = await generateHash({ plain_text: newPassword, algorithm: hashenum.ARGON2 });
  await updateOne({
    model: User,
    filter: { email },
    update: { password: hashedPassword, $unset: { forgot_password_Otp:true } },
  });



  
  emailEventEmitter.emit('forgetpassword', { to: email, username: user.username, otp });
  successResponse({
    res,
    statusCode: 200,
    message: "OTP sent to email successfully",
  });
};


export const logoutWithRedis = async (req, res) => {

  await setRevokedToken({ key: revoketokenKey({userId:req.user._id,jti: req.decoded.jti}), value: req.decoded.jti, ttl: req.decoded.iat+Access_Token_Admin_Expires_In});
  successResponse({
    res,
    statusCode: 200,
    message: "logged out successfully",
  });


}