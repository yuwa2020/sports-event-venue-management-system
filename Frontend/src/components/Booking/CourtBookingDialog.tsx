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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

interface CourtBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (sport: string, courts: number, total: number) => void;
  availableSports: string[];
  courtPrices: {
    [key: string]: number;
  };
}

export default function CourtBookingDialog({
  open,
  onClose,
  onConfirm,
  availableSports,
  courtPrices
}: CourtBookingDialogProps) {
  const [selectedSport, setSelectedSport] = useState('');
  const [courts, setCourts] = useState(1);

  const handleSportChange = (event: any) => {
    setSelectedSport(event.target.value);
    setCourts(1);
  };

  const handleCourtsChange = (delta: number) => {
    const newCourts = Math.max(1, Math.min(3, courts + delta));
    setCourts(newCourts);
  };

  const handleConfirm = () => {
    if (selectedSport) {
      const total = courts * courtPrices[selectedSport];
      onConfirm(selectedSport, courts, total);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Book Courts
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="sport-select-label">Select Sport</InputLabel>
            <Select
              labelId="sport-select-label"
              value={selectedSport}
              label="Select Sport"
              onChange={handleSportChange}
            >
              {availableSports.map((sport) => (
                <MenuItem key={sport} value={sport}>
                  {sport} - ₹{courtPrices[sport]} per court
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedSport && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Number of Courts
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
                  <Typography variant="subtitle1">Standard Court</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{courtPrices[selectedSport]} per court
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small"
                    onClick={() => handleCourtsChange(-1)}
                    disabled={courts <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <Typography sx={{ minWidth: '40px', textAlign: 'center' }}>
                    {courts}
                  </Typography>
                  
                  <IconButton 
                    size="small"
                    onClick={() => handleCourtsChange(1)}
                    disabled={courts >= 3}
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
                <Typography>₹{courts * courtPrices[selectedSport]}</Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          variant="contained"
          fullWidth
          onClick={handleConfirm}
          disabled={!selectedSport}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
} 