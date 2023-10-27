import config from "config";
import connectDB from "./db/connect";
import express from "express";
import bodyParser from "body-parser";
import createHttpError, { isHttpError } from "http-errors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan<Request, Response>("dev"));
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "EndPoint"));
});

app.use(
  session({
    secret: config.get("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: config.get("database.MONGO_URL"),
    }),
  })
);

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);

  let errorMessage: string = "An Unknown Error Occured";
  let statusCode: number = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
});

app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

const start = async () => {
  try {
    await connectDB(config.get("database.MONGO_URL"));
    app.listen(config.get("PORT"), () => {
      console.log("Server is Listening on PORT", config.get("PORT"));
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

start();

export default app;
