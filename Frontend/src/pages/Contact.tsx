import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Paper elevation={3} sx={{ p: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          {t('pages.contact.title') || 'Get in Touch'}
        </Typography>

        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
          {t('pages.contact.description') || 'Need help or have questions about TeamUp? Reach out to us using the details below.'}
        </Typography>

        <Stack spacing={4} mt={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <EmailIcon color="primary" />
            <Typography variant="body1">
              teamup.support@gmail.com
            </Typography>
          </Box>

        </Stack>
      </Paper>
    </Container>
  );
}
