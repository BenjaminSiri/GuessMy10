import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header/header';

import styles from './root.module.css';

function Root() {
    const [gameType, setGameType] = useState<string>('');

    return (
        <div className={styles.root}>
            <Header type={gameType} setType={setGameType}/>
            <main>
                <Outlet context={[setGameType]}/>
            </main>
        </div>
    )
}

export default Root;