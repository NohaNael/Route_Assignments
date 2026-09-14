import { CorsOptions } from "cors";
import { env } from "../../config/config.service";

export const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL,
  credentials: true,
};
