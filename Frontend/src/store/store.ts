import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';
import supabaseReducer from './slices/supabaseSlice';
import eventsReducer from './slices/eventsSlice';
import venuesReducer from './slices/venuesSlice';
import venueSportsReducer from './slices/venueSportsSlice';
import profilesReducer from './slices/profilesSlice';
import emailReducer from './slices/emailSlice';
import eventBookingsReducer from './slices/eventBookingsSlice';
import venueBookingsReducer from './slices/venueBookingsSlice';
import venueOwnerStatsReducer from './slices/venueOwnerStatsSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  supabase: supabaseReducer,
  events: eventsReducer,
  venues: venuesReducer,
  venueSports: venueSportsReducer,
  profiles: profilesReducer,
  email: emailReducer,
  eventBookings: eventBookingsReducer,
  venueBookings: venueBookingsReducer,
  venueOwnerStats: venueOwnerStatsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist the auth slice (or whatever slice holds your user)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(logger),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 