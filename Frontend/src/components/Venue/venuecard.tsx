import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";

export interface Venue {
  id?: number;
  venue_name?: string;
  event_name?: string;
  location: string;
  description: string;
  image: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface VenueCardProps {
  venue: Venue;
  type?: "venue" | "event"; // optional, defaults to "venue"
  onClick?: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, type = "venue", onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (venue.id) {
      navigate(`/${type}/${venue.id}`);
    }
  };

  const name = type === "event" ? venue.event_name : venue.venue_name;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ aspectRatio: "16/9", objectFit: "cover" }}
            image={venue.image || "https://via.placeholder.com/400x225"}
            alt={name}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="primary" fontWeight="bold" component="div">
              {venue.created_at ? new Date(venue.created_at).toLocaleDateString() : ""}
            </Typography>
            <Typography variant="h6" component="h3" fontWeight="bold" noWrap>
              {name}
            </Typography>
          </Box>

          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" noWrap>
                {venue.location}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary" noWrap>
            {venue.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VenueCard;
