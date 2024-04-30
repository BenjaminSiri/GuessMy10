import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './header.module.css';

function Header() {
  const nav = useNavigate();
  const onClick = () => {
    nav('/');
  }

  return (
    <div className={styles.header}>
      <h1 onClick={onClick} >Guess My 10</h1>
    </div>
  );
}

export default Header;