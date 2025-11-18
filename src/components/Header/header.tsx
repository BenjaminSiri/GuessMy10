import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';

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
    url: "https://ui-avatars.com/api/?name=User&background=1DB954&color=fff"
  });

  useEffect(() => {
    // If we have a valid token, fetch user info
    if (Spotify.hasValidToken() && props.logged) {
      Spotify.getUserInfo().then((data) => {
        if (data) {
          setUser({
            id: data.id,
            url: data.images[0]?.url || "https://ui-avatars.com/api/?name=" + data.id + "&background=1DB954&color=fff"
          });
        }
      });
    }
  }, [props.logged]);

  const onClick = () => {
    props.setType('');
    if (searchParams.get('logged')) {
      nav('/?logged=true');
    } else {
      nav('/');
    }
  }

  const onLogin = async () => {
    if (props.logged) {
      // Log out
      props.setLogged(false);
      setUser({
        id: ' ',
        url: "https://ui-avatars.com/api/?name=User&background=1DB954&color=fff"
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