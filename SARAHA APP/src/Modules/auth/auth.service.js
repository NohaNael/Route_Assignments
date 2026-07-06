import User from "../../DB/models/user.model.js";
import { findone, create } from "../../DB/db.repo.js";
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
import { Client_ID } from "../../../config/config.service.js";
import { OAuth2Client } from "google-auth-library";
import { provider} from "../../utils/enums/user.enum.js"; 


// ========================= SIGN UP =========================






export const signUp = async (req, res) => {
  
  const { Fname, Lname, email, password, phone, DOB, gender } = req.body;

  if (await findone({ model: User, filter: { email } }))
    throw conflictResponse("email already exists");

  if (!phone)
    throw badRequestResponse("phone is required");

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
    },
  });

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
    filter: { email },
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