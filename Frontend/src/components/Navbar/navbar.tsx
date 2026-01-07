import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Button,
  Box,
  IconButton,
  Typography,
  ThemeProvider
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../../assets/Logo.png';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Replace with actual Redux state when available
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const customerTabs = ["/explore", "/about", "/contact"];
  // const venueOwnerTabs = ["/venue-owner-dashboard", "/my-venues", "/bookings", "/reviews", "/create-event"];
  const venueOwnerTabs = ["/venue-owner-dashboard", "/bookings"];

  const userRole = user?.role;

  const tabRoutes = isAuthenticated
    ? userRole === "venue_owner"
      ? venueOwnerTabs
      : customerTabs
    : ["/about", "/contact"];

  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  useEffect(() => {
    const currentTab = tabRoutes.indexOf(location.pathname);
    setSelectedTab(currentTab !== -1 ? currentTab : null);
  }, [location.pathname, tabRoutes]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    navigate(tabRoutes[newValue]);
  };

  return (
      <AppBar 
        position="static" 
        sx={{ 
          background: "primary", 
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          px: 2 
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          {/* Minimalist Logo */}
          <Box
            component="img"
            sx={{ height: 40, width: "auto", cursor: "pointer" }}
            alt="TeamUp Logo"
            src={Logo}
            onClick={() => navigate("/")}
          />
          <Typography sx={{ flexGrow: 1 }}></Typography>

          {/* Centered Navigation Tabs with Hover Animation */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center"
            }}
          >
          {tabRoutes.map((route, index) => (
            <Tab key={route} sx={{color:"white"}} label={t(`components.navbar.${userRole === "venue_owner" ? "venueOwner" : "user"}.${route.replace("/", "")}.title`)} />
          ))}
          </Tabs>

          {/* Action Buttons (Profile/Login) with Prominent Styling */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {isAuthenticated ? (
              <>
              <IconButton color="secondary" onClick={() => navigate("/profile")}>
                <AccountCircle />
              </IconButton>
              <Button variant="outlined" color="secondary" onClick={() => {dispatch(logout()); navigate("/")}}>
                Logout
              </Button>
            </>
            ) : (
              <Button
                variant="contained" 
                color="secondary" 
                onClick={() => navigate("/register")}
                sx={{ 
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                  textTransform: "none"
                }}
              >
                {t("components.navbar.login.title")}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
  );
}
