import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FormContainer from '../components/FormComponent/FormContainer';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import ReCAPTCHA from 'react-google-recaptcha';

const SITE_KEY = '6Lf5qhgrAAAAAMu9iGL7SXp29zqmuIdk2GdmpfIG';

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch: any = useDispatch();

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const onRoleChange = (event: SelectChangeEvent) => setRole(event.target.value);
  const onCaptchaChange = (token: string | null) => setCaptchaToken(token);

  const onSubmit = async () => {
    if (!username || !email || !password || !role) {
      alert("Please fill in all fields!");
      return;
    }

    if (!captchaToken) {
      alert("Please verify the CAPTCHA!");
      return;
    }

    try {
      const resultAction = await dispatch(registerUser({
        username,
        email,
        password,
        role: role.toLowerCase().replace(" ", "_"),
        captchaToken
      }));

      if (registerUser.fulfilled.match(resultAction)) {
        alert("Account created!");

        const user = resultAction.payload.user;

        // Store user in Redux
        dispatch(login({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        }));

        navigate(user.role === "venue_owner" ? "/venue-owner-dashboard" : "/dashboard");
      } else {
        alert((resultAction.payload as string) || "Registration failed.");
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <FormContainer title="Create Account" socialAction="Sign Up">
      <FormControl fullWidth sx={{ marginBottom: '20px' }} >
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
      <TextField onChange={onUsernameChange} fullWidth label="Username" id="username" sx={{ marginBottom: '20px' }} />
      <TextField onChange={onEmailChange} fullWidth label="Email" id="email" sx={{ marginBottom: '20px' }} />
      <TextField onChange={onPasswordChange} fullWidth label="Password" type="password" id="password" sx={{ marginBottom: '20px' }} />
      <ReCAPTCHA sitekey={SITE_KEY} onChange={onCaptchaChange} />
      <Button onClick={onSubmit} variant="contained" fullWidth sx={{ bgcolor: '#49284D', color: 'white' }}>
        Create Account
      </Button>
    </FormContainer>
  );
};

export default Register;
