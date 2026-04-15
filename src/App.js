import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseRides from './pages/BrowseRides';
import RideDetail from './pages/RideDetail';
import PostRide from './pages/PostRide';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUserUpdate = (updated) => setUser(updated);

  const navProps = {
    user,
    onLoginClick: () => setShowLogin(true),
    onSignupClick: () => setShowSignup(true),
    onLogout: handleLogout,
  };

  return (
    <BrowserRouter>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
        />
      )}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
        />
      )}

      <Navbar {...navProps} />

      <Routes>
        <Route path="/" element={<Home user={user} onSignupClick={() => setShowSignup(true)} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/browse" element={<BrowseRides user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/rides/:id" element={<RideDetail user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/post-ride" element={<PostRide user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/profile" element={<Profile user={user} onUpdate={handleUserUpdate} />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
