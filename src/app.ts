import express, { Application, Request, Response, NextFunction } from "express";
import v1Route from "./routes/v1";
import AppError from "./errors/AppError";
import errorHandler from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import morgan from "morgan";
import logger from "./logging";
import path from "path";

const app: Application = express();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
    morgan("combined", {
        stream: {
            write: (message: string) => logger.http(message.trim()),
        },
    }),
);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", v1Route);

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export default app;
