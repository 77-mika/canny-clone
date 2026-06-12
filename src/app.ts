import express, { Application, Request, Response } from "express";
import v1Route from "./routes/v1";

const app: Application = express();
app.use(express.json());

app.use("/api/v1", v1Route);

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});
export default app;
