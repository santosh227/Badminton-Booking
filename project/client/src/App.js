import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import BookingsPage from './pages/BookingsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/booking" replace />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;