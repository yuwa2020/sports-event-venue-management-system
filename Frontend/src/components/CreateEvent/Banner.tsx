import React, { useState } from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Banner: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("upload-banner") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div style={{width: "100%", margin: "20px", padding: "20px"}}>
      <h3>Upload Image</h3>
      <Box mt={2} display="flex" alignItems="center" gap={2}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="upload-banner"
        />
        <label htmlFor="upload-banner">
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        {selectedFile && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">{selectedFile.name}</Typography>
            <IconButton size="small" onClick={clearFile}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
      <p style={{fontSize: "small", color: "grey", padding: 0, margin:0}}>Feature Image must be at least 1170 pixels wide by 504 pixels high</p>
      <p style={{fontSize: "small", color: "grey", padding: 0, margin:0}}>Valid file formats: JPG, GIF, PNG</p>
    </div>
  );
};

export default Banner;
