import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header/header';

import styles from './root.module.css';

function Root() {
    const [gameType, setGameType] = useState<string>('');
    const [logged, setLogged] = useState<boolean>(false);

    return (
        <div className={styles.root}>
            <Header type={gameType} setType={setGameType} logged={logged} setLogged={setLogged}/>
            <main>
                <Outlet context={[setGameType, setLogged]}/>
            </main>
        </div>
    )
}

export default Root;