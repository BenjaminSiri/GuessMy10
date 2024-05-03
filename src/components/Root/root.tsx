import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header/header';

import styles from './root.module.css';

function Root() {

    return (
        <div className={styles.root}>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Root;