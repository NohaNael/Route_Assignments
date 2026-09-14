import "reflect-metadata"; // required by class-validator/class-transformer decorators
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/config.service";
import { corsOptions } from "./Utils/cors/cors";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { globalErrorHandler, notFoundException } from "./Utils/response/error.response";
import { authcontroller, chatcontroller, companycontroller, jobcontroller, usercontroller } from "./Modules";
import connectDB from "./DB/connection";
import { Server, Socket } from "socket.io";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { buildcontext } from "./Modules/graphql/graphql.context";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);
import { verifyAccessToken } from "./Utils/token/token.util";
import { UserRepository } from "./DB/repositories/user.repository";
import { CompanyModel } from "./DB/models/company.model";
import { setIO } from "./Utils/socket/socket.util";
import { registerChatSocketHandlers } from "./Modules/chat/chat.gateway";
import { scheduleOtpCleanupJob } from "./jobs/otp-cleanup.cron";
import { IUser } from "./types/interfaces";

interface AuthenticatedSocket extends Socket {
  user?: IUser;
}

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers,
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const bootstrap = async (): Promise<void> => {
  const app: Express = express();

  app.use(helmet(), limiter, cors(corsOptions));
  app.use(express.json());

  await connectDB();

  app.all(
    "/graphql",
    createHandler({
      schema: schema,
      context: async (req) => {
        const raw = req.raw as Request;
        const context = await buildcontext(raw.headers.authorization);
        return context as unknown as Record<PropertyKey, unknown>;
      },
    })
  );

  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Hello Job Search App!" });
  });

  app.use("/api/v1/auth", authcontroller);
  app.use("/api/v1/user", usercontroller);
  app.use("/api/v1/company", companycontroller);
  app.use("/api/v1/job", jobcontroller); // top-level, unscoped-to-company job listing/filters
  app.use("/api/v1/chat", chatcontroller);

  app.use((req: Request, res: Response, next) => {
    throw new notFoundException("Route not found");
  });

  app.use(globalErrorHandler);

  const HTTPServer = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

  scheduleOtpCleanupJob();

  const io = new Server(HTTPServer, {
    cors: {
      origin: env.CLIENT_URL,
    },
  });
  setIO(io);

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token) return next(new Error("Authentication token is required"));

      const payload = verifyAccessToken(token);
      const user = await UserRepository.findById(payload.id);
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", async (socket: AuthenticatedSocket) => {
    console.log(socket.id);
    const user = socket.user!;

    // Personal room so we can target a single user (e.g. chat delivery) regardless of device count.
    socket.join(`user:${user._id.toString()}`);

    // If this user is an HR/owner of a company, join that company's room to receive
    // "new application submitted" notifications.
    const ownedOrHrCompanies = await CompanyModel.find({
      $or: [{ createdBy: user._id }, { HRs: user._id }],
    }).select("_id");
    ownedOrHrCompanies.forEach((company) => socket.join(`company:${company._id.toString()}`));

    registerChatSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`logout from :${socket.id}`);
    });
  });
};
