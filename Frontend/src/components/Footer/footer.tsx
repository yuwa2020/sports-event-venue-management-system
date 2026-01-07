import { Box, Typography, Grid, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Box sx={{ bgcolor: "black", color: "white", py: 4, px: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        {/* Company Info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>{t("components.footer.companyInfo")}</Typography>
          <Link href="/about" color="inherit" underline="none">{t("components.footer.about")}</Link><br />
        </Grid>

        {/* Help Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>{t("components.footer.help")}</Typography>
          <Link href="/contact" color="inherit" underline="none">{t("components.footer.contact")}</Link><br />
        </Grid>

        {/* Categories
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>Categories</Typography>
          <Link href="#" color="inherit" underline="none">Music</Link><br />
          <Link href="#" color="inherit" underline="none">Business</Link><br />
          <Link href="#" color="inherit" underline="none">Fashion</Link>
        </Grid> */}

        
      </Grid>

      {/* Copyright */}
      <Box textAlign="center" sx={{ mt: 3, pt: 2, borderTop: "1px solid gray" }}>
        <Typography variant="body2">
        {t("components.footer.copyright")}
        </Typography>
      </Box>
    </Box>
  );
}
