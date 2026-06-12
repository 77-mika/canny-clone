import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import logger from "./logging";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running in http://localhost:${PORT}`);
    });
});
