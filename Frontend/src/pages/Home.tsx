import { useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

import PopularVenues from '../components/Venue/popularVenues';
import VenueCarousel from '../components/home/VenueCarousel';
import CuratedVenuesBanner from '../components/home/CuratedVenueBanner';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchVenues } from '../store/slices/venuesSlice';
import { fetchEvents } from '../store/slices/eventsSlice';
import { fetchProfileById } from '../store/slices/profilesSlice';
import Profile from './Profile';

function handleNavigateToDetail(id: string | number) {
  console.log('Navigating to detail page for venue:', id);
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const venueState = useSelector((state: RootState) => state.venues);
  const eventState = useSelector((state: RootState) => state.events);
  const AuthState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (venueState.status === 'idle') dispatch(fetchVenues());
    if (eventState.status === 'idle') dispatch(fetchEvents());
    dispatch(fetchProfileById(AuthState?.user?.id))
        .unwrap()
        .then((res) => {
          console.log("Profile fetch response:", res);
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
  }, [dispatch, venueState.status, eventState.status]);
  const profile = useSelector((state: RootState) => state.profiles.selected);


  if (venueState.status === 'failed') return <p>Error loading venues: {venueState.error}</p>;
  if (eventState.status === 'failed') return <p>Error loading events: {eventState.error}</p>;

  return (
    <div>
      <Box sx={{ textAlign: 'left', py: 4, width: '100vw' }}>
        {venueState.status === 'loading' || eventState.status === 'loading' ? (
          <Skeleton variant="rectangular" width="100%" height={300} />
        ) : (
          <VenueCarousel items={venueState.data.slice(0, 3).map((venue) => 
            ({ ...venue, id: venue.id ?? String(Math.random()),}))} 
            navigateToDetail={handleNavigateToDetail}/>
        )}

        <Box sx={{ alignItems: 'left', padding: 4 }}>
          {venueState.status === 'loading' ? (
            <>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
            </>
          ) : (
            <PopularVenues />
          )}

          {/* {venueState.status === 'loading' ? (
            <>
              <Skeleton variant="text" width="30%" height={30} sx={{ mt: 4 }} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
            </>
          ) : (
            <CuratedVenuesBanner />
          )} */}
        </Box>
      </Box>
    </div>
  );
}
