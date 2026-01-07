import React, { useState } from "react";
import { Container, Stepper, Step, StepLabel, Button, Box, Snackbar, Alert } from "@mui/material";
import VenueDetails from "./VenueDetails";
import VenueImages from "./VenueImages";
import VenueSports from "./VenueSports";
import VenueReview from "./VenueReview";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createVenue } from "../../store/slices/venuesSlice";
import { RootState } from "../../store/store";
import { createVenueSport } from "../../store/slices/venueSportsSlice";

const steps = ["Venue Details", "Images", "Sports & Pricing", "Review"];

const CreateVenue = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [venueData, setVenueData] = useState({
    venue_name: "",
    location: "",
    description: "",
    image: "",
    sports: [{ sport_name: "", price_per_court: 0, total_courts: 1 }]
  });

  const profile = useSelector((state: RootState) => state.profiles.selected);

  const handleNext = () => {
    if (activeStep === 2) {
      setVenueData(prev => ({
        ...prev,
        sports: prev.sports.filter(sport =>
          sport.sport_name && sport.price_per_court > 0 && sport.total_courts > 0
        )
      }));
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleBackToDashboard = () => {
    navigate('/venue-owner-dashboard');
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return venueData.venue_name && venueData.location && venueData.description;
      case 1:
        return true;
      case 2:
        return venueData.sports.some(sport =>
          sport.sport_name || sport.price_per_court > 0 || sport.total_courts > 1
        ) && venueData.sports.every(sport =>
          (!sport.sport_name && !sport.price_per_court && sport.total_courts === 1) ||
          (sport.sport_name && sport.price_per_court > 0 && sport.total_courts > 0)
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      const validSports = venueData.sports.filter(
        (sport) =>
          sport.sport_name && sport.price_per_court > 0 && sport.total_courts > 0
      );
  
      const now = new Date().toISOString();
      const venuePayload = {
        venue_name: venueData.venue_name,
        location: venueData.location,
        description: venueData.description,
        image: venueData.image,
        owner_email: profile?.email,
        user_id: profile?.user_id,
        created_at: now,
        updated_at: now,
      };
  
      console.log("Creating venue with payload:", venuePayload);
  
      // Step 1: Create venue
      const venueResponse = await dispatch(createVenue(venuePayload)).unwrap();
      const venue_id = venueResponse?.data?.id;
  
      if (!venue_id) throw new Error("Venue ID missing in response");
  
      // Step 2: Create sports for the venue
      await Promise.all(
        validSports.map((sport) =>
          dispatch(
            createVenueSport({
              venue_id,
              sport: {
                sport_name: sport.sport_name,
                price_per_court: sport.price_per_court,
                total_courts: sport.total_courts,
                created_at: now,
                updated_at: now,
                status: "active", // Add this field if your backend expects it
              },
            })
          )
        )
      );
  
      // Step 3: Done!
      setShowSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Venue & sports created successfully");
  
    } catch (error) {
      console.error("Error creating venue and sports:", error);
    }
  };
  
  

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {activeStep === 0 && (
          <VenueDetails venueData={venueData} setVenueData={setVenueData} />
        )}
        {activeStep === 1 && (
          <VenueImages venueData={venueData} setVenueData={setVenueData} />
        )}
        {activeStep === 2 && (
          <VenueSports venueData={venueData} setVenueData={setVenueData} />
        )}
        {activeStep === 3 && (
          <VenueReview venueData={venueData} />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {activeStep === steps.length - 1 ? (
          <>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create Venue
            </Button>
            <Button variant="outlined" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
            </Button>
            <Button variant="outlined" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </>
        )}
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Venue successfully created!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateVenue;
