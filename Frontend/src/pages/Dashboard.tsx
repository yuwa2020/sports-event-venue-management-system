import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.auth.user);

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  useEffect(() => {
    console.log("User from Redux:", user);
  }, [user]);

  return (
    <Box sx={{ textAlign: 'center', py: 4 ,height: '100vh' }}>
      <Typography variant="h2">{t('pages.dashboard.title')}</Typography>
      <h1>Welcome, {user.username}</h1>
      <p>Your role: {user.role}</p>
    </Box>
  );
} 