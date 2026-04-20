import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, Star, Edit2, Camera, Lock, X, ArrowRight, Zap, Plus, Trash2 } from 'lucide-react';
import getApiConfig from '../config/api';
import authAPI from '../authAPI';

// Fixed Car import issue - Updated for 2-wheeler app
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

  // Vehicle management state
  const [vehicles, setVehicles] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    bikeNumber: '',
    bikeName: '',
    bikeModel: '',
    bikeCompany: ''
  });

  


  // Vehicle management functions
  const fetchVehicles = async () => {
    try {
      setVehicleLoading(true);
      console.log('Fetching vehicles...');
      console.log('API URL: https://bike-cytc.onrender.com/api/vehicles/my');
      
      const response = await authAPI.getMyVehicles();
      console.log('Vehicles response:', response);
      
      if (response && response.success) {
        const vehicles = response.data || [];
        console.log('Vehicles data:', vehicles);
        setVehicles(vehicles);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError('Failed to fetch vehicles');
    } finally {
      setVehicleLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!vehicleForm.bikeNumber || !vehicleForm.bikeName) {
      setError('Please fill in bike number and name');
      return;
    }

    try {
      setVehicleLoading(true);
      console.log('Adding vehicle...');
      console.log('API URL: https://bike-cytc.onrender.com/api/vehicles');
      console.log('Vehicle data:', vehicleForm);
      
      const response = await authAPI.addVehicle(vehicleForm);
      console.log('Add vehicle response:', response);
      
      if (response && response.success) {
        setSuccess('Vehicle added successfully!');
        setVehicleForm({ bikeNumber: '', bikeName: '', bikeModel: '', bikeCompany: '' });
        setShowVehicleForm(false);
        fetchVehicles();
      } else {
        setError(response.message || 'Failed to add vehicle');
      }
    } catch (err) {
      console.error('Add vehicle error:', err);
      if (err.response?.status === 403) {
        setError('Please complete KYC verification to add vehicles');
      } else {
        setError('Failed to add vehicle');
      }
    } finally {
      setVehicleLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      setVehicleLoading(true);
      const response = await authAPI.deleteVehicle(vehicleId);
      if (response.success) {
        setSuccess('Vehicle removed successfully!');
        fetchVehicles();
      } else {
        setError(response.message || 'Failed to remove vehicle');
      }
    } catch (err) {
      console.error('Delete vehicle error:', err);
      setError('Failed to remove vehicle');
    } finally {
      setVehicleLoading(false);
    }
  };

  // Check KYC status from localStorage
  const [kycStatus, setKycStatus] = useState(() => {
    return localStorage.getItem('kycStatus') || 'PENDING';
  });

  // Local notification for DigiLocker status check
  const [digiLockerMessage, setDigiLockerMessage] = useState('');
  const [digiLockerMessageType, setDigiLockerMessageType] = useState(''); // 'success' or 'error'

  // Check DigiLocker status and update KYC accordingly
  const checkDigiLockerStatus = async () => {
    // Clear previous messages
    setDigiLockerMessage('');
    setError('');
    setSuccess('');
    
    try {
      console.log('=== CHECKING DIGILOCKER STATUS FROM PROFILE ===');
      console.log('Checking DigiLocker status in MyProfile...');
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      
      if (!token) {
        setDigiLockerMessage('No authentication token found. Please log in again.');
        setDigiLockerMessageType('error');
        return;
      }
      
      console.log('Making API call to GET /digilocker/status...');
      const response = await authAPI.getDigiLockerStatus();
      console.log('DigiLocker status response:', response);
      
      if (response && response.success) {
        const data = response.data;
        console.log('DigiLocker status data:', data);
        console.log('DL Verified:', data.dlVerified);
        console.log('DL Number:', data.dlNumber);
        console.log('Can Post Rides:', data.canPostRides);
        
        if (data.dlVerified) {
          // Update KYC status to VERIFIED only if DL is actually verified
          localStorage.setItem('kycStatus', 'VERIFIED');
          setKycStatus('VERIFIED');
          console.log('KYC status updated to VERIFIED based on DigiLocker verification');
          
          // Update user data
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          userData.kycStatus = 'VERIFIED';
          userData.dlVerified = true;
          userData.canPostRides = data.canPostRides;
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Show local success message
          setDigiLockerMessage(`DigiLocker verification completed! DL: ${data.dlNumber || 'Verified'}. You can now add vehicles.`);
          setDigiLockerMessageType('success');
        } else {
          // Keep status as PENDING if DL not verified
          localStorage.setItem('kycStatus', 'PENDING');
          setKycStatus('PENDING');
          console.log('KYC status remains PENDING - DigiLocker not verified yet');
          
          // Show local info message
          setDigiLockerMessage('DigiLocker verification not yet completed. Please complete verification first.');
          setDigiLockerMessageType('error');
        }
      } else {
        setDigiLockerMessage(response?.message || 'Failed to check DigiLocker status.');
        setDigiLockerMessageType('error');
      }
    } catch (err) {
      console.error('=== DIGILOCKER STATUS CHECK ERROR ===');
      console.error('Error:', err);
      console.error('Status:', err.response?.status);
      console.error('Status Text:', err.response?.statusText);
      console.error('Response Data:', err.response?.data);
      
      if (err.response?.status === 403) {
        setDigiLockerMessage('403 Forbidden: Authentication issue. Please check your login status or contact support.');
        setDigiLockerMessageType('error');
      } else {
        setDigiLockerMessage('Failed to check DigiLocker status. Please try again.');
        setDigiLockerMessageType('error');
      }
    }
  };

  useEffect(() => {
    // Check DigiLocker status on component mount
    checkDigiLockerStatus();
  }, []);

  // Load vehicles when KYC is verified
  useEffect(() => {
    if (kycStatus === 'VERIFIED') {
      fetchVehicles();
    }
  }, [kycStatus]);

  // Auto-redirect based on final KYC status
  useEffect(() => {
    if (kycStatus === 'VERIFIED') {
      navigate('/kyc/success');
    } else if (kycStatus === 'FAILED') {
      navigate('/kyc/failure');
    }
  }, [kycStatus, navigate]);

  // Listen for KYC status changes from backend
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'kycStatus') {
        setKycStatus(e.newValue || 'PENDING');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
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
          
          {/* DigiLocker Verification Section */}
          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            {/* Heading */}
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-gray-400" />
              <span className="font-semibold text-lg">DigiLocker Verification</span>
            </div>
            
            {/* Status Badge */}
            <div className="mb-4">
              {kycStatus === 'PENDING' ? (
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('PENDING')}`}>
                  DigiLocker Pending
                </span>
              ) : kycStatus === 'VERIFIED' ? (
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('VERIFIED')}`}>
                  DigiLocker Verified
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('PENDING')}`}>
                  DigiLocker Pending
                </span>
              )}
            </div>
            
            {/* Buttons - Below Heading */}
            <div className="space-y-2 mb-4">
              {kycStatus === 'PENDING' ? (
                <>
                  <button
                    onClick={() => navigate('/kyc')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors"
                  >
                    Complete Verification
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={checkDigiLockerStatus}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                  >
                    Check Status
                  </button>
                </>
              ) : kycStatus === 'VERIFIED' ? (
                <button
                  onClick={checkDigiLockerStatus}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                >
                  Refresh
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/kyc')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors"
                  >
                    Complete Verification
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={checkDigiLockerStatus}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                  >
                    Check Status
                  </button>
                </>
              )}
            </div>
            
            {/* Local Notification - Right Below Buttons */}
            {digiLockerMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                digiLockerMessageType === 'success' 
                  ? 'bg-green-900 text-green-200 border border-green-700' 
                  : 'bg-red-900 text-red-200 border border-red-700'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {digiLockerMessageType === 'success' ? (
                      <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="text-sm">{digiLockerMessage}</span>
                  </div>
                  <button
                    onClick={() => setDigiLockerMessage('')}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          
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
          </div>
        </div>

        {/* Vehicle Management - Only show when KYC is verified */}
        {kycStatus === 'VERIFIED' ? (
          <div className="bg-gray-800 rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Zap size={20} className="text-orange-400" />
                My Vehicles
              </h3>
              <button
                onClick={() => setShowVehicleForm(!showVehicleForm)}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus size={16} />
                Add Vehicle
              </button>
            </div>

            {/* Add Vehicle Form */}
            {showVehicleForm && (
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold mb-4">Add New Vehicle</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Bike Number (e.g., UP80AB1234)"
                    value={vehicleForm.bikeNumber}
                    onChange={(e) => setVehicleForm({...vehicleForm, bikeNumber: e.target.value})}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Bike Name (e.g., Black Beast)"
                    value={vehicleForm.bikeName}
                    onChange={(e) => setVehicleForm({...vehicleForm, bikeName: e.target.value})}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Bike Model (e.g., Splendor Plus)"
                    value={vehicleForm.bikeModel}
                    onChange={(e) => setVehicleForm({...vehicleForm, bikeModel: e.target.value})}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Bike Company (e.g., Hero)"
                    value={vehicleForm.bikeCompany}
                    onChange={(e) => setVehicleForm({...vehicleForm, bikeCompany: e.target.value})}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddVehicle}
                    disabled={vehicleLoading}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {vehicleLoading ? 'Adding...' : 'Add Vehicle'}
                  </button>
                  <button
                    onClick={() => setShowVehicleForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Vehicles List */}
            {vehicles.length > 0 ? (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{vehicle.bikeName}</h4>
                      <p className="text-gray-400">{vehicle.bikeNumber}</p>
                      <p className="text-sm text-gray-500">{vehicle.bikeModel} - {vehicle.bikeCompany}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      disabled={vehicleLoading}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Zap size={48} className="mx-auto mb-4 opacity-50" />
                <p>No vehicles added yet</p>
                <p className="text-sm">Click "Add Vehicle" to get started</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-8 mb-6">
            <div className="text-center py-8">
              <Zap size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold mb-2">Vehicle Management</h3>
              <p className="text-gray-400 mb-2">Complete verification to unlock your ride-sharing journey</p>
              <p className="text-orange-400 text-sm mb-4">Add vehicles, post rides, and start earning! Your bike awaits its next adventure. </p>
              <button
                onClick={() => navigate('/kyc')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
              >
                Complete Verification
              </button>
            </div>
          </div>
        )}

        {/* Change Password */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
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

        {/* Riding Stats */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-6">Riding Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Star size={40} className="text-primary-orange mx-auto mb-2" />
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