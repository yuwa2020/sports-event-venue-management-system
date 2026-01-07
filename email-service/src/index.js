import express from "express";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Email Service");
});

app.use("/api", emailRoutes);

app.listen(port, () => {
  console.log(` Server listening at http://localhost:${port}`);
});

export default app;