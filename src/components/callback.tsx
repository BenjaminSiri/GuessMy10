import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import Spotify from '../util/spotify';

function Callback() {
    const nav = useNavigate();

    useEffect(() => {
       // Spotify.getAccessToken();
        nav('/?logged=true');
    }, [])

  return (
    <div>
      <h1>Callback</h1>
    </div>
  );
}

export default Callback;