import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

interface TicketBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (type: string, quantity: number, total: number) => void;
  ticketPrice: number;
}

export default function TicketBookingDialog({
  open,
  onClose,
  onConfirm,
  ticketPrice
}: TicketBookingDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [ticketType] = useState('Standard Ticket');

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleConfirm = () => {
    onConfirm(ticketType, quantity, quantity * ticketPrice);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Book Tickets
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Number of Tickets
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
          }}>
            <Box>
              <Typography variant="subtitle1">Standard Ticket</Typography>
              <Typography variant="body2" color="text.secondary">
                ₹{ticketPrice} per ticket
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              
              <Typography sx={{ minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </Typography>
              
              <IconButton 
                size="small"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            mt: 3
          }}>
            <Typography>Total:</Typography>
            <Typography>₹{quantity * ticketPrice}</Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          variant="contained"
          fullWidth
          onClick={handleConfirm}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
} 