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
  const [user, setUser] = useState<{id: string; url: string}>({id: ' ', url: "https://via.placeholder.com/50"});

  useEffect(() => {
    if(searchParams.get("logged") === "true"){
      console.log("Logged in")
      props.setLogged(true);
    }

    if (Spotify.checkAccessToken()) {
      Spotify.getUserInfo().then((data) => {
          setUser({
              id: data.id,
              url: data.images[0].url
          });
      });
    }
  }, [searchParams]);

  const onClick = () => {
    props.setType('');
    nav('/?logged=true');
  }

  const onLogin = () => {
    if(props.logged) {
      props.setLogged(false);
      nav('/?logged=false');
    } else {
      props.setLogged(true);
      nav('/?logged=true');
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
        {props.logged ?
            <div className={styles.user}>
                <p>{user.id}</p>
                <img src={user.url} alt="user" />
            </div> :
            <button onClick={onLogin} className={styles.loginButton}>{loggedStr}</button>
    }
      </div>
    </div>
  );
}

export default Header;