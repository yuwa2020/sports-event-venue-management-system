import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      width="100vw"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" gutterBottom>
        {t('pages.payment.successTitle') || 'Payment Successful!'}
      </Typography>
      <Typography variant="body1" mb={3}>
        {t('pages.payment.successMessage') || 'Thank you for your booking. A confirmation email has been sent.'}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        {'Go to Home'}
      </Button>
    </Box>
  );
};

export default PaymentSuccess;
