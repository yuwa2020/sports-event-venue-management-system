import React, { useState } from "react";
import { Button, Box, Typography, IconButton, Grid, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface VenueData {
  venue_name: string;
  location: string;
  description: string;
  image: string;
  sports: Array<{
    sport_name: string;
    price_per_court: number;
    total_courts: number;
  }>;
}

interface VenueImagesProps {
  venueData: VenueData;
  setVenueData: React.Dispatch<React.SetStateAction<VenueData>>;
}

const VenueImages: React.FC<VenueImagesProps> = ({ venueData, setVenueData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setVenueData(prev => ({
        ...prev,
        image: URL.createObjectURL(files[0])
      }));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setVenueData(prev => ({
      ...prev,
      image: ""
    }));
    const fileInput = document.getElementById("upload-venue-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Paper sx={{ p: 3, width: "100%", maxWidth: 600 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Venue Image
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: '#fafafa',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f0f0f0',
              },
            }}
          >
            <input
              id="upload-venue-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="upload-venue-image" style={{ cursor: 'pointer' }}>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Click to Upload Image
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Supported formats: JPG, PNG, GIF
              </Typography>
            </label>
          </Box>
          {selectedFile && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" component="span">
                Selected: {selectedFile.name}
              </Typography>
              <IconButton size="small" onClick={clearFile}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Grid>
        {venueData.image && (
          <Grid item xs={12}>
            <Box
              sx={{
                width: "100%",
                height: "200px",
                overflow: "hidden",
                borderRadius: 1,
                border: '1px solid #ccc',
              }}
            >
              <img
                src={venueData.image}
                alt="Venue preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default VenueImages; 