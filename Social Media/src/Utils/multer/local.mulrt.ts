import {Request} from "express";
import multer,{FileFilterCallback, StorageEngine} from "multer";
import {existsSync,mkdirSync} from "fs";
import {resolve} from "path";
import {randomUUID} from "crypto";
import {badRequestException} from "../response/error.response";



export const filevalidation={
    image:["image/jpeg","image/png","image/jpg"],
    video:["video/mp4","video/mkv","video/avi"],
    audio:["audio/mpeg","audio/wav","audio/ogg"]
};

export const uploadDir=resolve("./uploads");

export const localfileupload = ({
    validation=filevalidation.image,
    folder="general",
    maxSize=5
}:{
    validation?:string[],
    folder?:string,
    maxSize?:number
}={}) => {

    const storage:StorageEngine=multer.diskStorage({
        destination:(req:Request,file,cb)=>{
            const destpath=resolve(uploadDir,folder);
            if(!existsSync(destpath)){
                mkdirSync(destpath,{recursive:true});
            }
            cb(null,destpath);
        },
        filename:(req:Request,file,cb)=>{
            const ext=file.originalname.split(".").pop();
            cb(null,`${Date.now()}-${randomUUID()}.${ext}`);
        },


})
     const fileFilter=(req:Request,file: Express.Multer.File
        ,cb:FileFilterCallback): void=>{
            if(!validation.includes(file.mimetype)){
                return cb(new badRequestException(`Invalid file type. Only ${validation.join(", ")} are allowed.`));
            }
            cb(null,true);
        }
        return multer({
            storage,
            fileFilter,
            limits:{fileSize:maxSize*1024*1024}
        });
}

