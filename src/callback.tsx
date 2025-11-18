import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spotify from './util/spotify';

function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Spotify auth error:', error);
        navigate('/', { replace: true });
        return;
      }

      if (code) {
        try {
          console.log('Exchanging code for token...');
          await Spotify.getAccessToken(code);
          console.log('Successfully authenticated!');
          navigate('/?logged=true', { replace: true });
        } catch (error) {
          console.error('Failed to exchange code:', error);
          navigate('/', { replace: true });
        }
      } else {
        // No code, redirect home
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, []); // Empty dependency array

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Authenticating with Spotify...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
}

export default Callback;