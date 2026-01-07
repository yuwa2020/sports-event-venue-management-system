import React from 'react';
import { lazy } from 'react';
import VenueOwnerDashboard from '../components/Dashboards/VenueOwnerDashboard';
import CreateEvent from '../components/CreateEvent/CreateEvent';
import CreateVenue from '../components/CreateVenue/CreateVenue';
import EditVenue from '../components/EditVenue/EditVenue';
import EditEvent from '../components/EditEvent/EditEvent';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import ResetPassword from '../components/ForgotPassword/ResetPassword';
import VenueOwnerBookings from '../pages/Bookings';
import Contact from '../pages/Contact';

const Home = lazy(() => import('../pages/Home'));
const Venues = lazy(() => import('../pages/Venues'));
const About = lazy(() => import('../pages/About'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));
const EventDetails = lazy(() => import('../pages/EventDetails'));
const VenueDetails = lazy(() => import('../pages/VenueDetails'));
const DuoCallback = lazy(() => import('../pages/DuoCallback'));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess'));
const PaymentFailed = lazy(() => import('../pages/PaymentFailed'));

type AppRoute = {
  path: string;
  element: React.ReactElement;
};

export const publicRoutes: AppRoute[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/venue',
    element: <Venues />,
  },
  {
    path: '/venue/:id',
    element: <VenueDetails />,
  },
  {
    path: '/event/:id',
    element: <EventDetails />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />, // Optional placeholder
  },
  {
    path: '/duo/callback',
    element: <DuoCallback />,
  },
  {
    path: '/success',
    element: <PaymentSuccess />,
  },
  {
    path: '/failed',
    element: <PaymentFailed />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  }
];

export const privateRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    element: <Home />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/venue-owner-dashboard',
    element: <VenueOwnerDashboard />,
  },
  {
    path: '/bookings',
    element: <VenueOwnerBookings />,
  },
  {
    path: '/create-event',
    element: <CreateEvent />,
  },
  {
    path: '/create-venue',
    element: <CreateVenue />,
  },
  {
    path: '/edit-venue/:id',
    element: <EditVenue />,
  },
  {
    path: '/edit-event/:id',
    element: <EditEvent />,
  },
  {
    path: '/explore',
    element: <Venues />,
  },

  
];
