import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';

import Home from './components/Home/home';
import Play from './components/Play/play';
import Root from './components/Root/root';


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />} >
      <Route index element={<Home />} />
      <Route path="play" element={<Play />} />
    </Route>

  ));

  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
