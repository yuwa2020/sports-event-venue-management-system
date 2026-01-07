import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
    >
      <Typography variant="h4" gutterBottom>
        Payment Failed
      </Typography>
      <Typography variant="body1" mb={3}>
        Oops! Something went wrong with your payment. Please try again.
      </Typography>
      <Button variant="contained" color="error" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Box>
  );
};

export default PaymentFailed;
