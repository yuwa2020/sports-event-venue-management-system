// src/services/proxyServices.js
import axios from 'axios';



export const proxyToAuthService = async (path, req, methodOverride) => {
  const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_URL;
  
  try {
    const method = methodOverride || req.method.toLowerCase();
    const fullUrl = method === 'get'
      ? `${AUTH_SERVICE_BASE_URL}${req.originalUrl}`
      : `${AUTH_SERVICE_BASE_URL}${path}`;
    console.log("➡️ Proxying to:", fullUrl);

    const response = await axios({
      method,
      url: fullUrl,
      headers: {
        ...req.headers,
        host: undefined, // remove host header to avoid issues when proxying
      },
      data: req.body,
    });

    return response;
  } catch (err) {
    // Log full details of the error for easier debugging
    if (err.response) {
      console.error("❌ Error proxying to Auth Service:");
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("❌ Error proxying to Auth Service:", err.message);
    }

    throw err;
  }
};
