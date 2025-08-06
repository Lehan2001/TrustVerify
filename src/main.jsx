import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResultPage from './ResultPage.jsx'; // ✅ Make sure to create this file

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
