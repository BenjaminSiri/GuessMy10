import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Spotify from '../../util/spotify';

import styles from './home.module.css';

function Home() {

    const [type, setType] = useState('tracks');
    const [range, setRange] = useState('long_term');
    const [loggedIn, setLoggedIn] = useState(false);
    const nav = useNavigate();
    const [user, setUser] = useState<{id: string; url: string}>({id: 'Test ID', url: "https://via.placeholder.com/50"});

    useEffect(() => {
        if (Spotify.checkAccessToken()) {
            setLoggedIn(true);
            Spotify.getUserInfo().then((data) => {
                console.log(data);
                setUser({
                    id: data.id,
                    url: data.images[0].url
                });
            });
        }
    }, []);

    const onLogin = () => {
        setLoggedIn(true);
        Spotify.getUserInfo().then((data) => {
            console.log(data);
            setUser({
                id: data.id,
                url: data.images[0].url
            });
        });
    }

    const onPlay = () => {
        if (!loggedIn) {
            console.log('Not logged in');
            return;
        }
        nav('/play' + `?type=${type}&range=${range}`);
    }

    const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setType(event.target.value);
    }

    const onRangeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setRange(event.target.value);
    }

  return (
    <div className={styles.home}>
      <div className={styles.login}>
            <div className={styles.user}>
                <p>{user.id}</p>
                <img src={user.url} alt="user" />
            </div>
            <button onClick={onLogin} className={styles.loginButton}>Login</button>
      </div>
      <div className={styles.start}>
        <div className={styles.parameters}>
            <select onChange={onTypeChange}>
                <option value="tracks">Songs</option>
                <option value="artists">Artists</option>
            </select>
            <select onChange={onRangeChange}>
                <option value="long_term">1 year</option>
                <option value="short_term">4 weeks</option>
                <option value="medium_term">3 months</option>
            </select>
        </div>
        <button onClick={onPlay} className={styles.startButton}>Start</button>
      </div>
    </div>
  );
}

export default Home;