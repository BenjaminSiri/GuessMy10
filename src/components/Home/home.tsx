import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import styles from './home.module.css';

interface HomeProps {
    setLogged: (logged: boolean) => void;
    logged: boolean;
}

function Home(props: HomeProps) {
    const nav = useNavigate();

    const [type, setType] = useState<string>('tracks');
    const [range, setRange] = useState<string>('long_term');
    const [searchParams, setSearchParams] = useSearchParams();
    const [setGameType]: any = useOutletContext();

    useEffect(() => {
        if(searchParams.get("logged")){
            props.setLogged(true);
        }
    }, []);

    const onPlay = () => {
        if(searchParams.get("logged") === "true"){
            setGameType(type);
            nav(`/play?type=${type}&range=${range}`);
        }
        console.log("Not logged in")
    }

    const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setType(event.target.value);
    }

    const onRangeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setRange(event.target.value);
    }

  return (
    <div className={styles.home}>
        <h1>Welcome to Guess My Tunes</h1>
        <h4>Guess the top ten songs or artists you've listened to on Spotify. Select artists or tracks and the past time period you want to be tested on.
            Before you start you must login to your Spotify account.</h4>
      <div className={styles.start}>
        <div className={styles.parameters}>
            <select onChange={onTypeChange}>
                <option value="tracks">Songs</option>
                <option value="artists">Artists</option>
            </select>
            <select onChange={onRangeChange}>
                <option value="long_term">1 year</option>
                <option value="medium_term">3 months</option>
                <option value="short_term">4 weeks</option>
            </select>
        </div>
        <button onClick={onPlay} className={styles.startButton}>Start</button>
      </div>
    </div>
  );
}

export default Home;