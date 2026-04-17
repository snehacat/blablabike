import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseRides from './pages/BrowseRides';
import RideDetail from './pages/RideDetail';
import PostRide from './pages/PostRide';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import KYCPage from './pages/KYCPage';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ProfileSection from './components/ProfileSection';
import Notification from './components/Notification';

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('App.js - User data from localStorage:', userData);
      return userData;
    } catch (error) {
      console.log('App.js - Error parsing user data:', error);
      return null;
    }
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setShowSignup(false);
    
    // Show success notification
    setNotification({
      message: `Welcome back, ${userData.fullName}!`,
      type: 'success'
    });
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setShowSignup(false);
    
    // Show success notification
    setNotification({
      message: `Welcome to BikePooling, ${userData.fullName}!`,
      type: 'success'
    });
  };

  const handleLogout = () => {
    // Show confirmation
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Show success notification
      setNotification({
        message: 'Logged out successfully!',
        type: 'success'
      });
    }
  };

  const handleUserUpdate = (updated) => setUser(updated);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      console.log('App.js - Syncing user to localStorage:', user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      console.log('App.js - Clearing user from localStorage');
      localStorage.removeItem('user');
    }
  }, [user]);

  const navProps = {
    user,
    onLoginClick: () => setShowLogin(true),
    onSignupClick: () => setShowSignup(true),
    onLogout: handleLogout,
    onProfileClick: () => setShowProfile(true),
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
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
        />
      )}

      <Navbar {...navProps} />

      <Routes>
        <Route path="/" element={<Home user={user} onSignupClick={() => setShowSignup(true)} onLoginClick={() => setShowLogin(true)} onProfileUpdate={handleUserUpdate} />} />
        <Route path="/browse" element={<BrowseRides user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/rides/:id" element={<RideDetail user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/post-ride" element={<PostRide user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/profile" element={<Profile user={user} onUpdate={handleUserUpdate} />} />
        <Route path="/my-profile" element={<MyProfile user={user} onUpdateUser={handleUserUpdate} />} />
        <Route path="/kyc" element={<KYCPage user={user} />} />
      </Routes>

      {/* Profile Section */}
      {showProfile && user && (
        <ProfileSection
          user={user}
          onUpdateProfile={handleUserUpdate}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Footer />
    </BrowserRouter>
  );
};

export default App;
