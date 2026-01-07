import { proxyToAuthService } from '../services/proxyServices.js';

export const register = async (req, res) => {
  try {
    const result = await proxyToAuthService('/register', req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("❌ Gateway Register Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .json(error?.response?.data || { error: "Gateway Error" });
  }
};

export const login = async (req, res) => {
  try {
    const result = await proxyToAuthService('/login', req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("❌ Gateway Login Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .json(error?.response?.data || { error: "Gateway Error" });
  }
};

export const verifyDuo = async (req, res) => {
  try {
    const result = await proxyToAuthService('/duo/callback', req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("❌ Gateway Duo Verify Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .json(error?.response?.data || { error: "Gateway Error" });
  }
};

export const duoRedirect = async (req, res) => {
  try {
    const duoRedirectUrl = `https://blue-rock-0d2af4e10.6.azurestaticapps.net/duo/callback${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;
    return res.redirect(duoRedirectUrl);
  } catch (error) {
    console.error("❌ Gateway Duo Redirect Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .send(error?.response?.data || "Gateway Error");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await proxyToAuthService('/forgot-password', req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("❌ Gateway Forgot Password Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .json(error?.response?.data || { error: "Gateway Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await proxyToAuthService('/reset-password', req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("❌ Gateway Reset Password Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .json(error?.response?.data || { error: "Gateway Error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const authServiceUrl = `https://auth-service-latest-jd1q.onrender.com/google`;
    return res.redirect(authServiceUrl);
  } catch (error) {
    console.error("❌ Gateway Google Auth Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .send(error?.response?.data || "Gateway Error");
  }
};

export const googleCallback = async (req, res) => {
  try {
    const authServiceCallbackUrl = `https://auth-service-latest-jd1q.onrender.com/google/callback${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;
    return res.redirect(authServiceCallbackUrl);
  } catch (error) {
    console.error("❌ Gateway Google Callback Error:", error?.response?.data || error.message);
    return res
      .status(error?.response?.status || 500)
      .send(error?.response?.data || "Gateway Error");
  }
};
