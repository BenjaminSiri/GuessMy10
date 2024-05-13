import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const onClick = () => {
    props.setType('');
    nav('/?logged=true');
  }

  const [user, setUser] = useState<{id: string; url: string}>({id: 'Test ID hhhhhhhhh', url: "https://via.placeholder.com/50"});

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

  var loggedStr;
  if(!props.logged) {
    loggedStr = "Log in";
  } else {
    loggedStr = "Log out";
  }

  return (
    <div className={styles.header}>
      <h1 onClick={onClick} >Guess My 10</h1>
      <h2>
        {props.type}
      </h2>
      <div className={styles.login}>
            <div className={styles.user}>
                <p>{user.id}</p>
                <img src={user.url} alt="user" />
            </div>
            <button onClick={onLogin} className={styles.loginButton}>{loggedStr}</button>
      </div>
    </div>
  );
}

export default Header;