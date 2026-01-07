import React, { useState } from "react";
import { Button, Box, Typography, IconButton, Grid, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface EventData {
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  ticket_price: number;
  image_url: string;
  total_capacity: number;
  owner_email: string;
}

interface EventImagesProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
}

const EventImages: React.FC<EventImagesProps> = ({ eventData, setEventData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setEventData(prev => ({
        ...prev,
        image_url: URL.createObjectURL(files[0])
      }));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setEventData(prev => ({
      ...prev,
      image_url: ""
    }));
    const fileInput = document.getElementById("upload-event-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Paper sx={{ p: 3, width: "100%", maxWidth: 600 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Event Image
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
              id="upload-event-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="upload-event-image" style={{ cursor: 'pointer' }}>
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
        {eventData.image_url && (
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
                src={eventData.image_url}
                alt="Event preview"
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

export default EventImages; 