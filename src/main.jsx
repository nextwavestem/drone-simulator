import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import DroneSpaceSimulator from "./pages/playground/DroneSpaceSimulator.jsx";
import DroneCitySimulator from "./pages/playground/DroneCitySimulator.jsx";
import HomePage from './pages/dashboard/Homepage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/space" element={<DroneSpaceSimulator />} />
        <Route path="/city" element={<DroneCitySimulator />} />
        <Route path="/mountains" element={<DroneSpaceSimulator />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);