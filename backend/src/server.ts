import express from "express";
const app = express();
import cors from "cors";
import authroute from "./routes/auth.routes.js"
import urlroute from "./routes/url.routes.js"
import { redirectUrl } from "./controllers/url.controllers.js";
app.use(cors());
app.use(express.json());

app.use("/api/auth",authroute)
app.use("/api",urlroute)
app.get("/:code",redirectUrl)

app.listen(3000, () => console.log("Server is running"));
