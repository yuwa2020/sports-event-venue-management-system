import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import mainRoutes from "./routes/main.js";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/email.js";

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 10000;

// Secure HTTP headers
app.use(helmet());

// CORS with frontend access and credentials
app.use(cors({
  origin: "https://blue-rock-0d2af4e10.6.azurestaticapps.net",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use('/main/api/paymentWebhook', express.raw({ type: 'application/json' }));

// JSON body parsing
app.use(express.json());

// Route mounting
app.use("/main", mainRoutes);
app.use("/", authRoutes);
app.use("/email", emailRoutes);

// Health check
app.get("/", (req, res) => res.send("✅ Gateway is live"));

app.listen(PORT, () => {
  console.log(`🚀 Gateway running at http://localhost:${PORT}`);
});
