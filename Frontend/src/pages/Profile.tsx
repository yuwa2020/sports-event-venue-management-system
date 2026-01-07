import { Box, Typography, TextField, Button, FormControl, FormHelperText, List, ListItem, ListItemText } from '@mui/material';
import { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input/input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { createProfile, fetchProfileById, updateProfile } from '../store/slices/profilesSlice';

export default function Profile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const { selected: profile, status } = useSelector((state: RootState) => state.profiles);


  const [view, setView] = useState<'accountInfo' | 'changeEmail' | 'setPassword'>('accountInfo');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [oldEmail, setoldEmail] = useState(''); 
  const [newEmail, setnewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmEmailError, setConfirmEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [zipError, setZipError] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfileById(parseInt(user.id)));
    }
  }, [dispatch, user]);

  const validateZipCode = (zip: string) => {
    const zipRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return zipRegex.test(zip);
  };

  useEffect(() => {
    console.log("profile from db: ", profile)
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhoneNumber(profile.phone_number || '');
      setCity(profile.city_town || '');
      setCountry(profile.country || '');
      setZipCode(profile.zipcode || '');
      setoldEmail(profile.email || '');
    }
  }, [profile]);

  const handleSubmit = async () => {
    let isValid = true;

    // Validate first name
    if (!firstName.trim()) {
      setFirstNameError('First name is required.');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    // Validate last name
    if (!lastName.trim()) {
      setLastNameError('Last name is required.');
      isValid = false;
    } else {
      setLastNameError('');
    }

    // Validate phone number
    if (!phoneNumber) {
      setPhoneError('Phone number is required.');
      isValid = false;
    } else if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError('Invalid phone number format. Please use a valid US number. e.g., 1 123-456-7890');
      isValid = false;
    } else {
      setPhoneError('');
    }

    // Validate zip code
    if (!validateZipCode(zipCode)) {
      setZipError('Invalid zip code. Use format XXXXX or XXXXX-XXXX.');
      isValid = false;
    } else {
      setZipError('');
    }

    if (isValid) {
      try {
        const profileData = {
          id: profile?.id,
          user_id: parseInt(user.id),
          first_name: firstName,
          last_name: lastName,
          bio: profile?.bio || '',
          phone_number: phoneNumber,
          city_town: city,
          country: country,
          zipcode: zipCode,
          email: user.email,
          updated_at: new Date().toISOString()
        };

        // Use Redux to update the profile
        dispatch(profile?.id
          ? updateProfile(profileData)
          : createProfile(profileData)
        );
      } catch (error) {
        console.error('Error while updating profile:', error);
      }
    }
  };

  const handleEmailSubmit = async () => {
    let isValid = true;
  
    // Validate new email
    if (!newEmail.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError('Invalid email format.');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    // Confirm email validation
    if (newEmail !== confirmEmail) {
      setConfirmEmailError('Email addresses do not match.');
      isValid = false;
    } else {
      setConfirmEmailError('');
    }
  
    if (isValid) {
      try {
        let updatedProfile = {
          id: profile?.id,
          user_id: parseInt(user.id),
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          bio: profile?.bio || '',
          phone_number: profile?.phone_number || '',
          city_town: profile?.city_town || '',
          country: profile?.country || '',
          zipcode: profile?.zipcode || '',
          email: newEmail, 
          updated_at: new Date().toISOString(),
        };
        console.log("updated profile: ", updatedProfile)
        // Dispatch to update profile
        dispatch(profile?.id
          ? updateProfile(updatedProfile)
          : createProfile(updatedProfile)
        );
      } catch (error) {
        console.error('Error while updating email in profile:', error);
      }
    }
  };
  

  const handlePasswordSubmit = () => {
    let isValid = true;

    // New password validation
    if (!password.trim()) {
      setPasswordError('Password must not be empty.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long for security.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Confirm password does not match.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isValid) {
      console.log('Password updated:', password);
    }
  };

  return (
    <Box sx={{ display: 'flex', py: 4, px: 1 }}>
      {/* Left Sidebar */}
      <Box sx={{ width: '20%', borderRight: '1px solid #ccc', pr: 2, bgcolor: '#eeeeee' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('pages.profile.sidebarTitle', 'Account Settings')}
        </Typography>
        <List>
          <ListItem
            button selected={view === 'accountInfo'}
            onClick={() => setView('accountInfo')}
            sx={{
              bgcolor: view === 'accountInfo' ? 'white' : 'inherit', // White background when selected
              '&:hover': { bgcolor: 'white' }, // Hover effect
            }}>
            <ListItemText primary="Account Info" />
          </ListItem>
          <ListItem
            button selected={view === 'changeEmail'}
            onClick={() => setView('changeEmail')}
            sx={{
              bgcolor: view === 'changeEmail' ? 'white' : 'inherit', // White background when selected
              '&:hover': { bgcolor: 'white' }, // Hover effect
            }}>
            <ListItemText primary="Change Email" />
          </ListItem>
          <ListItem
            button selected={view === 'setPassword'}
            onClick={() => setView('setPassword')}
            sx={{
              bgcolor: view === 'setPassword' ? 'white' : 'inherit', // White background when selected
              '&:hover': { bgcolor: 'white' }, // Hover effect
            }}>
            <ListItemText primary="Set Password" />
          </ListItem>
        </List>
      </Box>

      {/* Account Info Panel */}
      <Box sx={{ flex: 1, textAlign: 'center', pl: 3 }}>
        {view === 'accountInfo' && (
          <>
            <Typography variant="h2" sx={{ mb: 5 }}>
              {t('pages.profile.title')}
            </Typography>
            <Box component="form" sx={{ maxWidth: 300, mx: 'auto' }}>
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!firstNameError}
                helperText={firstNameError}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!lastNameError}
                helperText={lastNameError}
                sx={{ marginBottom: '20px' }}
              />
              <FormControl fullWidth sx={{ mb: 2 }} error={!!phoneError}>
                <PhoneInput
                  country="US"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  style={{
                    width: '100%',
                    border: phoneError ? '1px solid red' : '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px',
                    fontSize: '20px',
                  }}
                />
                {phoneError && <FormHelperText>{phoneError}</FormHelperText>}
              </FormControl>
              <TextField
                fullWidth
                label="City/Town"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                error={!!zipError}
                helperText={zipError}
                sx={{ marginBottom: '20px' }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#49284D', color: 'white' }}
                onClick={handleSubmit}
              >
                Save My Profile
              </Button>
            </Box>
          </>
        )}

        {/* Change Email */}
        {view === 'changeEmail' && (
          <>
            <Typography variant="h2" sx={{ mb: 5 }}>
              Change Email
            </Typography>
            <Box component="form" sx={{ maxWidth: 300, mx: 'auto' }}>
              <TextField
                fullWidth
                label="New Email"
                // value={newEmail}
                onChange={(e) => setnewEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Confirm Email"
                // value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                error={!!confirmEmailError}
                helperText={confirmEmailError}
                sx={{ marginBottom: '20px' }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#49284D', color: 'white' }}
                onClick={handleEmailSubmit}
              >
                Save New Email
              </Button>
            </Box>
          </>
        )}

        {/* Set Password */}
        {view === 'setPassword' && (
          <>
            <Typography variant="h2" sx={{ mb: 5 }}>
              Set Password
            </Typography>
            <Box component="form" sx={{ maxWidth: 300, mx: 'auto' }}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                sx={{ marginBottom: '20px' }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#49284D', color: 'white' }}
                onClick={handlePasswordSubmit}
              >
                Set New Password
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}