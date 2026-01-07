import { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Update this path based on your structure

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token'); // Get token from the URL query params

  // Validate the token on component mount
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
    }
  }, [token]);

  const handleResetPassword = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      // If you need to call your backend service (e.g., Gateway) to validate the token and reset the password
      const response = await fetch('http://https://auth-service-latest-jd1q.onrender.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmed(true); // Display confirmation message
      } else {
        setError(data.message || 'Error resetting password');
      }
    } catch (error) {
      setError('Failed to reset password');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!confirmed ? (
        <>
          {error && <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>}
          <Typography sx={{ mb: 2 }}>Enter your new password.</Typography>
          <TextField
            type="password"
            fullWidth
            label="New Password"
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleResetPassword}
            sx={{ bgcolor: '#49284D', color: 'white' }}
          >
            Reset Password
          </Button>
        </>
      ) : (
        <Typography sx={{ color: 'green' }}>Password updated! You can now log in.</Typography>
      )}
    </div>
  );
};

export default ResetPassword;
