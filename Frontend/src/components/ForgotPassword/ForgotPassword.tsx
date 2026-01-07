import { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import FormContainer from '../components/FormComponent/FormContainer';
// import { sendPasswordResetEmail } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import FormContainer from '../FormComponent/FormContainer';
import { sendPasswordResetEmail } from '../../store/slices/authSlice';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!email) return;

    const result = await dispatch(sendPasswordResetEmail(email));

    if (sendPasswordResetEmail.fulfilled.match(result)) {
      setSubmitted(true);
    } else {
      alert('Error sending reset email. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Reset Password
      </Typography>
      {!submitted ? (
        <>
          <Typography sx={{ mb: 2 }}>
            Enter your email to receive a password reset link.
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleReset}
            sx={{ bgcolor: '#49284D', color: 'white' }}
          >
            Send Reset Email
          </Button>
        </>
      ) : (
        <Typography sx={{ color: 'green' }}>
          A password reset link has been sent to your email.
        </Typography>
      )}
    </div>
  );
};

export default ForgotPassword;
