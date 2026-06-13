import app from "./app";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import logger from "./logging";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running in http://localhost:${PORT}`);
    });
});
