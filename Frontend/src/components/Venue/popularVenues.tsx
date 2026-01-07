import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VenueCard, { Venue } from "./venuecard";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { Event as EventType } from "../../store/slices/eventsSlice"; // ✅ Fix here


const PopularVenuesAndEvents: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: venues } = useSelector((state: RootState) => state.venues);
  const { data: events } = useSelector((state: RootState) => state.events);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 8 }}>
        {/* Section Heading - Venues */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" fontWeight="bold">
            {t("components.popularVenues.heading")}
          </Typography>
          <Button
            onClick={() => navigate("/venue")}
            variant="outlined"
            sx={{ borderRadius: "50px" }}
          >
            {t("components.popularVenues.buttonText")}
          </Button>
        </Box>

        {/* Venue Cards */}
        <Fade in timeout={500}>
          <Grid container spacing={3}>
            {venues.length > 0 ? (
              venues.slice(0, 6).map((venue: Venue, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`venue-${index}`}>
                  <VenueCard venue={venue} type ="venue" />
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 3 }}>
                {t("components.popularVenues.defaultFilter")}
              </Typography>
            )}
          </Grid>
        </Fade>

        {/* Section Heading - Events */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 8,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" fontWeight="bold">
            {t("components.popularEvents.heading")}
          </Typography>
        </Box>

        {/* Event Cards */}
        <Fade in timeout={500}>
          <Grid container spacing={3}>
            {events.length > 0 ? (
              events.slice(0, 6).map((event: EventType, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`event-${index}`}>
                  <VenueCard
                    venue={{
                      ...event,
                      venue_name: event.event_name,
                      image: event.image_url,
                    }}
                    type="event"
                  />
                </Grid>
              
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 3 }}>
                {t("components.popularEvents.defaultFilter")}
              </Typography>
            )}
          </Grid>
        </Fade>
      </Box>
    </Container>
  );
};

export default PopularVenuesAndEvents;
