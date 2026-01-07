import axios from "axios";

export const forwardToMainService = async (req, res) => {
  const MAIN_SERVICE_URL = process.env.MAIN_SERVICE_URL;
  const path = req.originalUrl.replace(/^\/main/, "");
  const targetUrl = `${MAIN_SERVICE_URL}${path}`;

  console.log("🔁 Forwarding to MAIN →", targetUrl);

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: new URL(MAIN_SERVICE_URL).host,
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || err.message || "Unknown error"
      });
  }
};
