import React from "react";
import {
  TextField,
  Typography,
  Box,
  IconButton,
  Stack,
  Button,
  Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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

interface VenueSportsProps {
  venueData: VenueData;
  setVenueData: React.Dispatch<React.SetStateAction<VenueData>>;
}

const VenueSports: React.FC<VenueSportsProps> = ({ venueData, setVenueData }) => {
  const handleAddSport = () => {
    setVenueData((prev) => ({
      ...prev,
      sports: [
        ...prev.sports.filter(sport => 
          sport.sport_name || sport.price_per_court > 0 || sport.total_courts > 1
        ),
        { sport_name: "", price_per_court: 0, total_courts: 1 },
      ],
    }));
  };

  const handleDeleteSport = (index: number) => {
    setVenueData((prev) => ({
      ...prev,
      sports: prev.sports.filter((_, i) => i !== index),
    }));
  };

  const handleSportChange = (
    index: number,
    field: keyof VenueData["sports"][0],
    value: string | number
  ) => {
    setVenueData((prev) => ({
      ...prev,
      sports: prev.sports.map((sport, i) =>
        i === index ? { ...sport, [field]: value } : sport
      ),
    }));
  };

  return (
    <Paper sx={{ p: 3, width: "100%", maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Sports & Pricing
      </Typography>
      <Stack spacing={2}>
        {venueData.sports.map((sport, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            <div style={{ width: "40%" }}>
              <Stack spacing={0.5}>
                <Typography>Sport Name</Typography>
                <TextField
                  size="small"
                  required
                  value={sport.sport_name}
                  onChange={(e) =>
                    handleSportChange(index, "sport_name", e.target.value)
                  }
                />
              </Stack>
            </div>
            <div style={{ width: "25%" }}>
              <Stack spacing={0.5}>
                <Typography>Price per Court</Typography>
                <TextField
                  type="number"
                  size="small"
                  required
                  value={sport.price_per_court}
                  onChange={(e) =>
                    handleSportChange(
                      index,
                      "price_per_court",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </Stack>
            </div>
            <div style={{ width: "25%" }}>
              <Stack spacing={0.5}>
                <Typography>Total Courts</Typography>
                <TextField
                  type="number"
                  size="small"
                  required
                  value={sport.total_courts}
                  onChange={(e) =>
                    handleSportChange(
                      index,
                      "total_courts",
                      parseInt(e.target.value)
                    )
                  }
                />
              </Stack>
            </div>
            <div style={{ width: "10%", display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handleDeleteSport(index)}
                disabled={venueData.sports.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddSport}
          variant="outlined"
        >
          Add Sport
        </Button>
      </Box>
    </Paper>
  );
};

export default VenueSports; 