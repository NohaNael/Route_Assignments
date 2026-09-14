import type { IUser } from "./interfaces";

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        destination?: string;
        filename?: string;
        path?: string;
      }
    }

    interface Request {
      user?: IUser;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export {};
