import { useState } from "react";
import { 
  Container, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventDetails from "./EventDetails";
import EventImages from "./EventImages";
import EventReview from "./EventReview";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../store/slices/eventsSlice";
import { RootState } from "../../store/store";

const steps = ["Event Details", "Images", "Review"];

interface EventData {
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  ticket_price: number;
  image_url: string;
  total_capacity: number;
  owner_email: any;
  user_id: number;
}


const CreateEvent = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    event_name: "",
    event_date: "",
    event_time: "",
    location: "",
    description: "",
    ticket_price: 0,
    image_url: "",
    total_capacity: 0,
    owner_email: "",
    user_id: 0
  });



  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBackToDashboard = () => {
    navigate('/venue-owner-dashboard');
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return (
          eventData.event_name &&
          eventData.event_date &&
          eventData.event_time &&
          eventData.location &&
          eventData.description &&
          eventData.ticket_price > 0 &&
          eventData.total_capacity > 0
        );
      case 1:
        return true; // Image is optional
      default:
        return true;
    }
  };

  const profile = useSelector((state: RootState) => state.profiles.selected);


  const handleSubmit = async () => {
    try {
      // TODO: Upload image to storage and get URL
      // const imageUrl = await uploadImage(eventData.image_url);

      const eventPayload = {
        event_name: eventData.event_name,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        location: eventData.location,
        description: eventData.description,
        ticket_price: eventData.ticket_price,
        image_url: eventData.image_url,
        total_capacity: eventData.total_capacity,
        available_tickets: eventData.total_capacity, // Initially all tickets are available
        status: 'active',
        owner_email: profile?.email,
        user_id : profile?.user_id
      };

      await dispatch(createEvent(eventPayload)).unwrap();
      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Event created:', eventPayload);
      
      setShowSuccess(true);
      // Don't navigate automatically, let user click "Back to Dashboard"
    } catch (error) {
      console.error('Error creating event:', error);
      // TODO: Show error message to user
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
          <EventDetails
            eventData={eventData}
            setEventData={setEventData}
          />
        )}
        {activeStep === 1 && (
          <EventImages
            eventData={eventData}
            setEventData={setEventData}
          />
        )}
        {activeStep === 2 && (
          <EventReview eventData={eventData} />
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {activeStep === steps.length - 1 ? (
          <>
            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Create Event
            </Button>
            <Button
              variant="outlined"
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
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
            <Button
              variant="outlined"
              onClick={handleBackToDashboard}
            >
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
          Event successfully created!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateEvent;
