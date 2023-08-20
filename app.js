import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerui from "swagger-ui-express";
import mongoose from "mongoose";
import ErrorHandler from "./utils/errorHandler.js";
import swaggerFile from "./docs/swagger_output.json" assert { type: "json" };
import router from "./routes/router.js";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/doc", swaggerui.serve, swaggerui.setup(swaggerFile));

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

app.use("/api/v1", router);

app.get("*", (req, res) => {
    res.status(404).send("Not Found");
});

app.use(ErrorHandler);

export default app;
