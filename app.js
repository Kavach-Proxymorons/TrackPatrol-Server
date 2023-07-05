import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import swaggerui from "swagger-ui-express";
import mongoose from "mongoose";
import swaggerFile from "./docs/swagger_output.json" assert { type: "json" };
import router from "./routes/router.js";

const app = express();

app.use(morgan("dev"));
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

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
}); 