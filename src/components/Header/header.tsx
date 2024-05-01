import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Spotify from '../../util/spotify';

import styles from './header.module.css';

function Header() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const onClick = () => {
    nav('/?logged=true');
  }

  const [user, setUser] = useState<{id: string; url: string}>({id: 'Test ID', url: "https://via.placeholder.com/50"});

  useEffect(() => {
    if (Spotify.checkAccessToken()) {
        Spotify.getUserInfo().then((data) => {
            setUser({
                id: data.id,
                url: data.images[0].url
            });
        });
    }
}, []);

  const onLogin = () => {
    if(Spotify.getAccessToken()) {
      Spotify.getUserInfo().then((data) => {
          console.log(data);
          setUser({
              id: data.id,
              url: data.images[0].url
          });
      });
    }
}

  return (
    <div className={styles.header}>
      <h1 onClick={onClick} >Guess My 10</h1>
      <div className={styles.login}>
            <div className={styles.user}>
                <p>{user.id}</p>
                <img src={user.url} alt="user" />
            </div>
            <button onClick={onLogin} className={styles.loginButton}>Login</button>
      </div>
    </div>
  );
}

export default Header;