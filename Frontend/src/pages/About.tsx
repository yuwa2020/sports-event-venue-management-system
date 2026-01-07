import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {t('pages.about.title') || 'What is TeamUp?'}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          A smart, digital sports facility platform that connects players with venues — think Airbnb for sports!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              The Problem
            </Typography>
            <Typography color="text.secondary">
              70% of sports venues struggle with underutilization during off-peak hours, while players waste an average of 45 minutes trying to find available courts. TeamUp eliminates this inefficiency.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Our Solution
            </Typography>
            <Typography color="text.secondary">
              We enable real-time venue discovery, booking, and payment processing. For players, it's 5x faster. For venue owners, it's up to 40% more revenue. Plus, built-in player-matching and smart recommendations.
            </Typography>
          </Paper>
        </Grid>
      </Grid>


      <Box mt={8}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Why Now?
        </Typography>
        <Typography color="text.secondary">
          With the global sports industry projected to reach $614.1B by 2027, and 75% of players preferring online bookings, TeamUp meets the demand for smarter sports access. We’re targeting an untapped local market with a scalable tech solution.
        </Typography>
      </Box>
    </Container>
  );
}
