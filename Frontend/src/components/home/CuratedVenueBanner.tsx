import React from 'react';
import { useTranslation } from 'react-i18next';




export interface CuratedVenuesBannerProps {
  // If you need props, define them here
}

const CuratedVenuesBanner: React.FC<CuratedVenuesBannerProps> = () => {

  const { t } = useTranslation();
  return (
    <section style={styles.bannerContainer}>
      <h2 style={styles.heading}>{t("components.venueBanner.heading")}</h2>
      <p style={styles.subtext}>
      {t("components.venueBanner.subText")}
      </p>
      <button style={styles.button}>{t("components.venueBanner.buttonText")}</button>
    </section>
  );
};

export default CuratedVenuesBanner;

const styles: { [key: string]: React.CSSProperties } = {
  bannerContainer: {
    // Updated gradient with more contrast and explicit color stops
    background: 'linear-gradient(135deg, #5ee6f7 0%, #3aa8d8 100%)',
    // Fallback background color (if gradient fails)
    backgroundColor: '#5ee6f7',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '2rem auto',
    minHeight: '150px', // Ensuring enough height to show the gradient
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#000000',
  },
  subtext: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#000000',
  },
  button: {
    background: 'linear-gradient(135deg, #e18138, #f3a76b)',
    color: '#FFFFFF',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};
