import React from 'react';
import { useState } from 'react'
import './App.css';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowRestaurantOnMap from './pages/map';



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ShowRestaurantOnMap" element={<ShowRestaurantOnMap />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
