import express, { Application, Request, Response, NextFunction } from "express";
import v1Route from "./routes/v1";
import AppError from "./errors/AppError";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();
app.use(express.json());

app.use("/api/v1", v1Route);

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});


app.use((req:Request,res:Response,next:NextFunction)=>{
    next(new AppError(`Route ${req.originalUrl} not found`,404));
})


app.use(errorHandler)

export default app;
