// src/pages/DuoCallback.tsx
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyDuo } from '../api/auth';
import { login } from '../store/slices/authSlice';

const DuoCallback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('duo_code');
  const state = searchParams.get('state');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const verifiedRef = useRef(false);

  useEffect(() => {

    if (verifiedRef.current) return;
    verifiedRef.current = true;
    const verify = async () => {
      if (!code || !state) {
        alert("Missing Duo authentication details.");
        navigate("/login");
        return;
      }

      try {
        console.log("hello callback frontend")
        const res = await verifyDuo({ code, state });
        console.log("res from verify duo", res)
        const { token, user } = res.data;

        dispatch(login({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        }));

        localStorage.setItem("authToken", token);

        navigate(user.role === "venue_owner" ? "/venue-owner-dashboard" : "/dashboard");

      } catch (err) {
        console.error("Duo verification failed", err);
        alert("Duo verification failed.");
        navigate("/login");
      }
    };

    verify();
  }, [code, state, dispatch, navigate]);

  return <p>Verifying Duo 2FA...</p>;
};

export default DuoCallback;
