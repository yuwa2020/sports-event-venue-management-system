import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { publicRoutes, privateRoutes } from './routes/routes';
import RootLayout from './layouts/RootLayout';
import Footer from './components/Footer/footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar/navbar';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RootLayout />}>
          {/* Public Routes */}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            {privateRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>
      </Routes>
      {!isAuthPage && <Footer />}
    </Suspense>
  );
}
export default App;