import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import {
  Box,
  Typography,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import  LocationOnIcon  from '@mui/icons-material/LocationOn';

// Optional: Hardcoded ZIP -> City/State map for recognized ZIP codes
const zipMap: Record<string, string> = {
  "06770": "Naugatuck, CT",
  "10001": "New York, NY",
  "94105": "San Francisco, CA",
};

export default function HeroSection() {
  // 1) Get geolocation data using react-geolocated (hook version)
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });

  // 2) Manage state for the location Autocomplete
  const [locationValue, setLocationValue] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState<string>("");

  // 3) If geolocation is available and enabled, automatically fill lat/lon.
  useEffect(() => {
    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
      const autoLocation = `Lat: ${coords.latitude.toFixed(2)}, Lon: ${coords.longitude.toFixed(2)}`;
      setLocationInput(autoLocation);
      setLocationValue(autoLocation);
    }
  }, [isGeolocationAvailable, isGeolocationEnabled, coords]);

  // 4) Build dropdown options
  // No "Your location" entry here. Only a recognized ZIP if typed.
  const options: string[] = [];
  if (zipMap[locationInput]) {
    options.push(`${locationInput}, ${zipMap[locationInput]}`);
  }

  // 5) Clear location input (X icon)
  const handleClearLocation = () => {
    setLocationInput("");
    setLocationValue(null);
  };

  // 6) When a dropdown option is selected (in this case, only ZIP-based)
  const handleLocationChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    setLocationValue(newValue);
  };

  return (
    <Box
      sx={{
        position: "relative",
        background: "url('/hero-bg.jpg') center/cover", // Update as needed
        textAlign: "center",
        py: 10,
        color: "white",
      }}
    >
      {/* Optional overlay for better text contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h3" gutterBottom>
          Find Your Perfect Venue
        </Typography>
        <Typography variant="h6" gutterBottom>
          Search for venues, categories, and locations
        </Typography>

        {/* Container for the search bar + location */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, px: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "50px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              overflow: "hidden",
              maxWidth: 600,
              width: "100%",
            }}
          >
            {/* Left side: Search input */}
            <TextField
              variant="outlined"
              placeholder="Search Venues, Categories, Locations..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
              }}
            />

            {/* Divider between search and location */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(0,0,0,0.2)", mx: 1 }}
            />

            {/* Right side: Location Autocomplete */}
            <Autocomplete
              freeSolo
              value={locationValue}
              onChange={handleLocationChange}
              inputValue={locationInput}
              onInputChange={(e, newInput) => setLocationInput(newInput)}
              options={options}
              filterOptions={(x) => x} 
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
              // Default rendering for each option
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Your location..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                    
                  }}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
