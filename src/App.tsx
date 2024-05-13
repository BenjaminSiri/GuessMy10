import React, { useState } from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';

import Home from './components/Home/home';
import Play from './components/Play/play';
import Root from './components/Root/root';
import CallBack from './components/callback';


function App() {

  const [logged, setLogged] = useState<boolean>(false);

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />} >
      <Route index element={<Home setLogged={setLogged} logged={false}/>} />
      <Route path="play" element={<Play />} />
      <Route path="callback" element={<CallBack />} />
    </Route>

  ));

  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;