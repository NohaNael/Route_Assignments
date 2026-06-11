import User from "../../DB/models/user.model.js";
import { findone, create } from "../../DB/db.repo.js";
import { badRequestResponse, conflictResponse, notFoundResponse } from "../../utils/err.response.js";
import { hashenum } from "../../utils/enums/sec.enum.js";
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { successResponse } from "../../utils/success.response.js";


export const signUp=async(req,res)=>{
    const { Fname, Lname, email, password, DOB, gender } = req.body;

    if(await findone({model:User, filter:{email}})) 
        return conflictResponse("email already exists");

    const hash = await generateHash({plain_text: password,algorithm: hashenum.ARGON2 });    

    const user = await create({
        model: User,
        data: { Fname, Lname, email, password: hash, DOB, gender }
    });

    successResponse({
        res,
        statusCode: 201,
        message: "user registered successfully",
        data: { user }
    });
};

export const login=async(req,res)=>{
    const {email, password } = req.body;

    const user = await findone({model:User, filter:{email}});
    if(!user) 
        throw notFoundResponse("user not found");
    const isMatch = await compareHash({plain_text: password, cipher_text: user.password, algorithm: hashenum.ARGON2 });
    if(!isMatch) 
        throw badRequestResponse("invalid email or password");


    successResponse({
        res,
        statusCode: 200 ,
        message: "user logged in successfully",
        data: { user }
    });

};
