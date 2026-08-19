import { HUserDoc } from "../DB/models/user.model";
import { ITokenPayload } from "../Utils/sec/token";

declare global {
    namespace Express {
        interface Request {
            user: HUserDoc;
            decoded: ITokenPayload;
        }
    }
}
