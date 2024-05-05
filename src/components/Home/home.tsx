import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './home.module.css';

function Home() {
    const [type, setType] = useState<string>('tracks');
    const [range, setRange] = useState<string>('long_term');
    const [logged, setLogged] = useState<boolean>(false);
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if(searchParams.get("logged")){
            setLogged(true);
        }
    }, []);

    const onPlay = () => {
        if(logged){
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