import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { apiClient } from '../../api/apiClient';

interface OrderSummaryDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  ticketInfo: {
    quantity?: number;
    sport?: string;
    courts?: number;
    total: number;
  };
  attendeeDetails: {
    fullName: string;
    email: string;
    phone: string;
  } | null;
  userId?: any;
  venueId?: any;
  type: 'event' | 'venue';
  sportId?: number;
  bookingDate: any;  
  startTime: any;    
  ownerEmail: any;
}

export default function OrderSummaryDialog({
  open,
  onClose,
  onBack,
  ticketInfo,
  attendeeDetails,
  userId,
  venueId,
  type,
  sportId,
  bookingDate,
  startTime,
  ownerEmail
}: OrderSummaryDialogProps) {
  if (!attendeeDetails) return null;

  const tax = Math.round(ticketInfo.total * 0.059); 
  const totalWithTax = ticketInfo.total + tax;

  const handlePayment = async () => {
    try {
      const response = await apiClient.post('/payments/create-checkout-session', {
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name:
                  type === 'venue'
                    ? `${ticketInfo.sport} Court Booking`
                    : 'Event Ticket',
              },
              unit_amount: ticketInfo.total * 100
            },
            quantity: ticketInfo.quantity || ticketInfo.courts || 1
          }
        ],
        customer_email: attendeeDetails.email,
        metadata: {
          email: attendeeDetails.email,
          user_id: userId?.toString() || '',
          venue_id: venueId?.toString() || '',
          sport_id: sportId?.toString() || '',
          type,
          ticketInfo: JSON.stringify(ticketInfo),
          date: bookingDate,
          time: startTime,
          owner_email: ownerEmail
        }
      });

      const data = response.data;
      if (data.url) window.location.href = data.url;
      else console.error('Stripe checkout URL not received.');
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={onBack} size="small"><ArrowBackIcon /></IconButton>
            <Typography variant="h6">Order Summary</Typography>
          </Stack>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Paper 
          elevation={0} 
          sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
        >
          {type === 'venue' ? (
            <>
              <Typography variant="subtitle1">
                {ticketInfo.sport} - {ticketInfo.courts} Court(s)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {attendeeDetails.email}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                ₹{ticketInfo.total}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="subtitle1">
                Event Ticket ({ticketInfo.quantity})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {attendeeDetails.email}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                ₹{ticketInfo.total}
              </Typography>
            </>
          )}
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Sub Total:</Typography>
            <Typography>₹{ticketInfo.total.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Tax:</Typography>
            <Typography>₹{tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Order Total:</Typography>
            <Typography variant="h6" color="primary">
              ₹{totalWithTax.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          variant="contained"
          fullWidth
          onClick={handlePayment}
          sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
        >
          Pay Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}

