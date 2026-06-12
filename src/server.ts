import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const PORT = process.env.PORT;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running in http://localhost:${PORT}`);
    });
});
