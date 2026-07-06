import multer from "multer";
import path from "path";
import fs from "node:fs";

export const fileValidator = {images: ["image/jpeg", "image/png", "image/jpg"], videos: ["video/mp4", "video/mkv"],documents: ["application/pdf",] };



export const localfileupload =({customPath="general"},validation=[]) => {


    const basePath=`uploads/${customPath}`;

    const storage = multer.diskStorage({
        destination:(req, file, cb) => {

            let userBasePath=basePath;
            if(req.user?._id) userBasePath +=`/${req.user._id}`;
            const fullPath = path.resolve(`./src/${userBasePath}`);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
        
                cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            const uniqueFilename = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

            req.finalPath = `${basePath}/${req.user?._id}/${uniqueFilename}`;
            cb(null, uniqueFilename);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (validation.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."), false); 

        }
        }   
    

    return multer({ fileFilter,storage });    
        };