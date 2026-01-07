import { useState, ChangeEvent } from 'react';
import { useDispatch } from "react-redux";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice'; // use only loginUser thunk now
import FormContainer from '../components/FormComponent/FormContainer';
import ReCAPTCHA from 'react-google-recaptcha';

declare global {
  interface Window {
    Duo?: any;
  }
}

const SITE_KEY = '6Lf5qhgrAAAAAMu9iGL7SXp29zqmuIdk2GdmpfIG';

const Login = () => {
  const navigate = useNavigate();
  const dispatch: any = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const onRoleChange = (event: SelectChangeEvent) => setRole(event.target.value);
  const onCaptchaChange = (token: string | null) => setCaptchaToken(token);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password || !role) {
      alert("Please fill in all fields!");
      return;
    }
    if (!captchaToken) {
      alert("Please verify the CAPTCHA!");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({
        email,
        password,
        role: role.toLowerCase().replace(" ", "_"), // format for backend
        captchaToken
      }));

      // If successful loginUser thunk returns payload
      if (loginUser.fulfilled.match(resultAction)) {
        const { requires2FA, authUrl, user } = resultAction.payload;

        if (requires2FA && authUrl) {
          window.location.href = authUrl;
        } else {
          navigate(user.role === "venue_owner" ? "/venue-owner-dashboard" : "/dashboard");
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <FormContainer title="Login" socialAction="Login">
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel id="role">Role</InputLabel>
        <Select
          id="select-role"
          label="Role"
          value={role}
          onChange={onRoleChange}
        >
          <MenuItem value={"User"}>User</MenuItem>
          <MenuItem value={"Venue Owner"}>Venue Owner</MenuItem>
        </Select>
      </FormControl>
      <TextField onChange={onEmailChange} fullWidth label="Email" sx={{ marginBottom: '20px' }} />
      <TextField onChange={onPasswordChange} fullWidth type="password" label="Password" sx={{ marginBottom: '20px' }} />
      <ReCAPTCHA sitekey={SITE_KEY} onChange={onCaptchaChange} />
      <Button onClick={onSubmit} variant="contained" fullWidth sx={{ bgcolor: '#49284D', color: 'white' }}>
        Login
      </Button>
      <Button
        onClick={() => navigate('/forgot-password')}
        sx={{ marginBottom: '20px', textTransform: 'none', color: '#49284D' }}
      >
        Forgot Password?
      </Button>
    </FormContainer>
  );
};

export default Login;
