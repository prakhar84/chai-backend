// require("dotenv").config({ path: "./.env" });
import dotenv from "dotenv";

// approach 1
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" });
connectDB();

/* approach 2
import express from "express";
const app = express();

(async () => {
    try {
        await ongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (err) => {
            console.log("Error :", err);
        });
        app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error: ", error);
    }
})();
*/
