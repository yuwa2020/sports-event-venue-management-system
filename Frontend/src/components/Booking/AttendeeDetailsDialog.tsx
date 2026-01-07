import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AttendeeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirm: (details: AttendeeDetails) => void;
  ticketInfo: {
    quantity?: number;
    total: number;
  };
}

interface AttendeeDetails {
  fullName: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
}

export default function AttendeeDetailsDialog({
  open,
  onClose,
  onBack,
  onConfirm,
  ticketInfo
}: AttendeeDetailsDialogProps) {
  const [details, setDetails] = useState<AttendeeDetails>({
    fullName: '',
    email: '',
    phone: '',
    acceptedTerms: false
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
    terms: false
  });

  const handleChange = (field: keyof AttendeeDetails) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetails(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: !details.fullName,
      email: !details.email || !/\S+@\S+\.\S+/.test(details.email),
      phone: !details.phone || !/^\d{10}$/.test(details.phone),
      terms: !details.acceptedTerms
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(details);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={onBack} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Attendee Details</Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Standard Ticket: {ticketInfo.quantity || 1} {ticketInfo.quantity === 1 ? 'Ticket' : 'Tickets'}
          </Typography>
          
          <TextField
            fullWidth
            label="Full Name"
            value={details.fullName}
            onChange={handleChange('fullName')}
            error={errors.fullName}
            helperText={errors.fullName ? 'Full name is required' : ''}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={details.email}
            onChange={handleChange('email')}
            error={errors.email}
            helperText={errors.email ? 'Valid email is required' : ''}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Phone"
            value={details.phone}
            onChange={handleChange('phone')}
            error={errors.phone}
            helperText={errors.phone ? 'Valid 10-digit phone number is required' : ''}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={details.acceptedTerms}
                onChange={handleChange('acceptedTerms')}
              />
            }
            label={
              <Typography variant="body2">
                I accept the <Link href="#" underline="hover">Terms of Service</Link> and have read the{' '}
                <Link href="#" underline="hover">Privacy Policy</Link>
              </Typography>
            }
          />
          {errors.terms && (
            <Typography color="error" variant="caption" display="block">
              You must accept the terms to continue
            </Typography>
          )}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 1
        }}>
          <Typography>Total:</Typography>
          <Typography>₹{ticketInfo.total}</Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          variant="contained"
          fullWidth
          onClick={handleConfirm}
        >
          Continue to Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
} 