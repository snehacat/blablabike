import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, Car, Star, Edit2, Camera, Lock, X, ArrowRight } from 'lucide-react';
import getApiConfig from '../config/api';

const MyProfile = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Check KYC status and submission time from localStorage
  const [kycStatus, setKycStatus] = useState(() => {
    return localStorage.getItem('kycStatus') || 'PENDING';
  });
  
  const [kycSubmittedTime, setKycSubmittedTime] = useState(() => {
    const stored = localStorage.getItem('kycSubmittedTime');
    return stored ? new Date(stored) : null;
  });

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const apiConfig = getApiConfig();
      console.log('API Config:', apiConfig);
      
      // TODO: Replace with backend API when available
      // Future implementation:
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${apiConfig.baseURL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          console.log('Backend profile response:', data);
          
          if (data.success) {
            setProfileData(data.data);
            setEditForm({
              fullName: data.data.fullName,
              email: data.data.email,
              phone: data.data.phone
            });
            return;
          }
        } catch (err) {
          console.log('Backend API not available, using localStorage fallback');
        }
      }
      
      // Fallback to localStorage and user data
      console.log('Fetching profile data from localStorage...');
      
      // Try to get profile from localStorage - check both keys
      const savedUser = localStorage.getItem('user');
      const savedProfile = localStorage.getItem('userProfile');
      const userFromStorage = savedUser ? JSON.parse(savedUser) : null;
      const profileFromStorage = savedProfile ? JSON.parse(savedProfile) : null;
      
      console.log('Found user in localStorage:', userFromStorage);
      console.log('Found profile in localStorage:', profileFromStorage);
      
      // Create profile data from user info and saved profile data
      const profileData = {
        fullName: user?.fullName || userFromStorage?.fullName || profileFromStorage?.fullName || 'User',
        email: user?.email || userFromStorage?.email || profileFromStorage?.email || 'user@example.com',
        phone: user?.phone || userFromStorage?.phone || profileFromStorage?.phone || '1234567890',
        memberSince: 'April 2026',
        kycStatus: user?.kycStatus || userFromStorage?.kycStatus || profileFromStorage?.kycStatus || 'PENDING',
        phoneVerified: true,
        kycVerified: false,
        drivingLicenseVerified: false,
        canPostRides: false,
        totalRidesPosted: 0,
        totalRidesBooked: 0,
        vehicles: [],
        averageRating: 0.0,
        totalReviews: 0,
        recentReviews: [],
        ...userFromStorage, // Override with user data from localStorage
        ...profileFromStorage // Override with saved profile data
      };
      
      setProfileData(profileData);
      setEditForm({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone
      });
      
      console.log('Profile data loaded:', profileData);
      
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // TODO: Replace with backend API when available
    // Future implementation:
    // const token = localStorage.getItem('token');
    // const response = await fetch('https://bike-cytc.onrender.com/api/users/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(editForm)
    // });
    
    try {
      // For now, save to localStorage and update state immediately
      console.log('Updating profile with:', editForm);
      
      // Save to localStorage - update both keys for consistency
      localStorage.setItem('userProfile', JSON.stringify(editForm));
      
      // Also update the user key to ensure login system picks up the name
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update profileData state
      setProfileData(prev => ({
        ...prev,
        ...editForm
      }));
      
      // Update user in parent component
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      
      setSuccess('Profile updated successfully! (Saved locally)');
      setEditing(false);
      
      console.log('Profile saved to localStorage:', editForm);
      
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Changing password...');
      
      const response = await fetch('https://bike-cytc.onrender.com/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      console.log('Password change response status:', response.status);
      
      const data = await response.json();
      console.log('Password change response data:', data);
      
      if (data.success) {
        setSuccess('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('Failed to change password. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleAvatarUpload = () => {
    if (!avatarFile) {
      setError('Please select an image first');
      return;
    }

    // TODO: Replace with backend API when available
    // Future implementation:
    // const formData = new FormData();
    // formData.append('avatar', avatarFile);
    // const response = await fetch('/api/users/avatar', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` },
    //   body: formData
    // });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      
      // Save to localStorage (temporary solution)
      localStorage.setItem('userAvatar', base64Image);
      
      // Update user state
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          avatar: base64Image
        });
      }
      
      setSuccess('Profile picture updated successfully! (Saved locally)');
      setPreviewImage(null);
      setAvatarFile(null);
      
      console.log('Avatar saved to localStorage:', base64Image.substring(0, 50) + '...');
    };
    reader.readAsDataURL(avatarFile);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'VERIFIED': return 'text-green-600 bg-green-100';
      case 'SUBMITTED': return 'text-blue-600 bg-blue-100';
      case 'SUBMITTED': return 'text-blue-600 bg-blue-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 bg-primary-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {editing ? <X size={20} /> : <Edit2 size={20} />}
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : localStorage.getItem('userAvatar') ? (
                  <img src={localStorage.getItem('userAvatar')} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary-orange p-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
              <p className="text-gray-400">Member since {profileData.memberSince}</p>
              {previewImage && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleAvatarUpload}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Save Photo
                  </button>
                  <button
                    onClick={() => {
                      setPreviewImage(null);
                      setAvatarFile(null);
                    }}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {editing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <span>Member since {profileData.memberSince}</span>
              </div>
            </div>
          )}
        </div>

        {/* Verification Status */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-6">Verification Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400" />
                <span>Phone Verification</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(profileData.phoneVerified ? 'VERIFIED' : 'PENDING')}`}>
                {profileData.phoneVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-400" />
                <span>KYC Verification</span>
              </div>
              
              {/* Show KYC status and buttons based on localStorage status */}
              {kycStatus === 'PENDING' ? (
                <>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('PENDING')}`}>
                    KYC Pending
                  </span>
                  <button
                    onClick={() => navigate('/kyc')}
                    className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors"
                  >
                    Complete KYC
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : kycStatus === 'SUBMITTED' ? (
                (() => {
                  const hoursSinceSubmission = kycSubmittedTime ? 
                    (Date.now() - kycSubmittedTime.getTime()) / (1000 * 60 * 60) : 0;
                  
                  if (hoursSinceSubmission < 12) {
                    return (
                      <>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('SUBMITTED')}`}>
                          KYC Submitted
                        </span>
                        <button
                          onClick={() => navigate('/kyc')}
                          className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
                        >
                          Update KYC
                          <Edit2 size={14} />
                        </button>
                      </>
                    );
                  } else {
                    return (
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('SUBMITTED')}`}>
                        KYC Submitted
                      </span>
                    );
                  }
                })()
              ) : kycStatus === 'VERIFIED' ? (
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('VERIFIED')}`}>
                  KYC Verified
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('PENDING')}`}>
                  KYC Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Riding Stats */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-6">Riding Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Car size={40} className="text-primary-orange mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.totalRidesPosted}</div>
              <div className="text-gray-400">Rides Posted</div>
            </div>
            <div className="text-center">
              <User size={40} className="text-primary-orange mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.totalRidesBooked}</div>
              <div className="text-gray-400">Rides Booked</div>
            </div>
            <div className="text-center">
              <Star size={40} className="text-primary-orange mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.averageRating.toFixed(1)}</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Security</h3>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Lock size={20} />
              Change Password
            </button>
          </div>
          <p className="text-gray-400">Last password change: Not available</p>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-6">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-primary-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifications */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {error}
            <button onClick={() => setError('')} className="ml-4">
              <X size={20} />
            </button>
          </div>
        )}
        {success && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {success}
            <button onClick={() => setSuccess('')} className="ml-4">
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;