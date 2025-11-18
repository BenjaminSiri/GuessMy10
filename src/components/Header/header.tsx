import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Spotify from '../../util/spotify';

import styles from './header.module.css';

interface HeaderProps {
  type: string;
  logged: boolean;
  setType: (type: string) => void;
  setLogged: (logged: boolean) => void;
}

function Header(props: HeaderProps) {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<{id: string; url: string}>({
    id: ' ', 
    url: "https://via.placeholder.com/50"
  });

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we're returning from Spotify with a code
      const code = searchParams.get('code');
      
      if (code) {
        try {
          // Exchange code for access token
          await Spotify.getAccessToken(code);
          props.setLogged(true);
          
          // Fetch user info
          const data = await Spotify.getUserInfo();
          if (data) {
            setUser({
              id: data.id,
              url: data.images[0]?.url || "https://via.placeholder.com/50"
            });
          }
          
          // Clean up URL
          nav('/', { replace: true });
        } catch (error) {
          console.error('Auth error:', error);
          nav('/', { replace: true });
        }
      } else if (Spotify.hasValidToken()) {
        // We already have a valid token
        props.setLogged(true);
        
        const data = await Spotify.getUserInfo();
        if (data) {
          setUser({
            id: data.id,
            url: data.images[0]?.url || "https://via.placeholder.com/50"
          });
        }
      }
    };

    handleAuthCallback();
  }, [searchParams, nav, props]);

  const onClick = () => {
    props.setType('');
    nav('/');
  }

  const onLogin = async () => {
    if (props.logged) {
      // Log out
      props.setLogged(false);
      setUser({
        id: ' ',
        url: "https://via.placeholder.com/50"
      });
    } else {
      // Redirect to Spotify login
      await Spotify.redirectToAuthCodeFlow();
    }
  }

  const loggedStr = !props.logged ? "Log in" : "Log out";

  return (
    <div className={styles.header}>
      <h1 onClick={onClick}>Guess My Tunes</h1>
      <h2>{props.type}</h2>
      <div className={styles.login}>
        {props.logged ? (
          <div className={styles.user}>
            <p>{user.id}</p>
            <img src={user.url} alt="user" />
          </div>
        ) : (
          <button onClick={onLogin} className={styles.loginButton}>
            {loggedStr}
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;