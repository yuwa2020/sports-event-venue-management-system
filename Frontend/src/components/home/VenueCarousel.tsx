import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Container, Paper, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';

interface VenueItem {
  id: string | number;
  title?: string;
  image?: string;
  category?: string;
  date?: string;
  location?: string;
}

interface VenueCarouselProps {
  items: VenueItem[];
  navigateToDetail: (id: string | number) => void;
}

interface CarouselItemProps {
  item: VenueItem;
  onClick: () => void;
}

const VenueCarousel: React.FC<VenueCarouselProps> = ({ items, navigateToDetail }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: 'slick-dots custom-dots',
  };

  const handlePrev = (): void => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = (): void => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
 

      <Box 
        sx={{ 
          position: 'relative',
          '.slick-dots': {
            bottom: 16,
            '& li button:before': {
              fontSize: 10,
              color: 'white',
              opacity: 0.5,
            },
            '& li.slick-active button:before': {
              opacity: 1,
              color: 'white',
            }
          },
          '.slick-slide > div': {
            px: { xs: 0, md: 1 }
          }
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {items.map((item) => (
            <CarouselItem 
              key={item.id}
              item={item}
              onClick={() => navigateToDetail(item.id)}
            />
          ))}
        </Slider>
      </Box>
    </Container>
  );
};

const CarouselItem: React.FC<CarouselItemProps> = ({ item, onClick }) => {
  const { t } = useTranslation();
  return (
    <Paper 
      elevation={0}
      sx={{ 
        position: 'relative',
        height: { xs: 300, sm: 400, md: 500 },
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      <Box 
        sx={{
          backgroundImage: `url(${item.image || 'https://via.placeholder.com/1200x500'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
          width: '100%',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
          }
        }}
      />
      
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%',
          p: { xs: 3, md: 5 },
          color: 'white'
        }}
      >

        
        <Typography variant="h4" component="h3" fontWeight="bold" gutterBottom>
          {item.title}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
          {item.date && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body1">
                {item.date}
              </Typography>
            </Box>
          )}
          
          {item.location && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body1">
                {item.location}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          sx={{ 
            mt: 3, 
            borderRadius: 50, 
            px: 3,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
         {t("components.venueCarousel.buttonText")}
        </Button>
      </Box>
    </Paper>
  );
};

export default VenueCarousel;