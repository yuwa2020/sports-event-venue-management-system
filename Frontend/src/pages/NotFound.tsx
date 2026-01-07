import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 4,width: '100vw' ,height: '100vh',}}>
      <Typography variant="h2">{t('pages.notFound.title')}</Typography>
      <Typography sx={{ mt: 2 }}>{t('pages.notFound.message')}</Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
        sx={{ mt: 3 }}
      >
        {t('common.backToHome', 'Back to Home')}
      </Button>
    </Box>
  );
} 