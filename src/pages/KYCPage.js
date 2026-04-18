import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, FileText, ArrowLeft, CheckCircle, Edit2 } from 'lucide-react';

// Last updated: 2026-04-18 19:40 - ESLint fixes deployed

const KYCPage = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  // Initialize with empty form - stored data will be loaded in useEffect
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    digilockerMobile: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNumber: '',
    panNumber: '',
    drivingLicenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [showUpdateClickNotification, setShowUpdateClickNotification] = useState(false);
  const [modifiedFields, setModifiedFields] = useState(new Set());

  // Check if KYC was submitted and track time for Update Details button
  const [kycSubmittedTime] = useState(() => {
    const stored = localStorage.getItem('kycSubmittedTime');
    return stored ? new Date(stored) : null;
  });

  // Check if user is logged in and load stored KYC data
  React.useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    // Always load the latest KYC data from localStorage
    const loadLatestKycData = () => {
      const storedKycData = localStorage.getItem('kycSubmissionData');
      
      if (storedKycData) {
        try {
          const kycData = JSON.parse(storedKycData);
          console.log('Loading latest KYC data:', kycData);
          // Merge stored data with user data as fallback for missing fields
          const mergedData = {
            fullName: kycData.fullName || user?.fullName || '',
            email: kycData.email || user?.email || '',
            phone: kycData.phone || user?.phone || '',
            digilockerMobile: kycData.digilockerMobile || '',
            digilockerMobile: kycData.digilockerMobile || '',
            dateOfBirth: kycData.dateOfBirth || '',
            address: kycData.address || '',
            city: kycData.city || '',
            state: kycData.state || '',
            pincode: kycData.pincode || '',
            aadhaarNumber: kycData.aadhaarNumber || '',
            panNumber: kycData.panNumber || '',
            drivingLicenseNumber: kycData.drivingLicenseNumber || ''
          };
          console.log('Merged KYC data:', mergedData);
          setFormData(mergedData);
          setKycSubmitted(true);
          
          // Show notification that data has been loaded
          if (kycData.fullName || kycData.email) {
            setShowUpdateNotification(true);
            setTimeout(() => setShowUpdateNotification(false), 3000);
            // Reset modified fields when loading new data
            setModifiedFields(new Set());
          }
        } catch (error) {
          console.log('Error loading stored KYC data:', error);
        }
      }
    };

    loadLatestKycData();
    
    // Add event listener for storage changes (in case of multiple tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'kycSubmissionData') {
        loadLatestKycData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, navigate]);

  // Refresh data when component gains focus (user returns from profile)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        const storedKycData = localStorage.getItem('kycSubmissionData');
        
        if (storedKycData) {
          try {
            const kycData = JSON.parse(storedKycData);
            console.log('Refreshing KYC data on visibility change:', kycData);
            // Merge stored data with user data as fallback for missing fields
            const mergedData = {
              fullName: kycData.fullName || user?.fullName || '',
              email: kycData.email || user?.email || '',
              phone: kycData.phone || user?.phone || '',
              dateOfBirth: kycData.dateOfBirth || '',
              address: kycData.address || '',
              city: kycData.city || '',
              state: kycData.state || '',
              pincode: kycData.pincode || '',
              aadhaarNumber: kycData.aadhaarNumber || '',
              panNumber: kycData.panNumber || '',
              drivingLicenseNumber: kycData.drivingLicenseNumber || ''
            };
            console.log('Merged KYC data on refresh:', mergedData);
            setFormData(mergedData);
            setKycSubmitted(true);
          } catch (error) {
            console.log('Error refreshing KYC data:', error);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setModifiedFields(prev => new Set([...prev, name]));
    setError('');
    setSuccess('');
  };

  const handleUpdateClick = () => {
    // Show green tick notification when update button is clicked
    setShowUpdateClickNotification(true);
    setTimeout(() => setShowUpdateClickNotification(false), 2000);
    
    // Immediately save current form data to localStorage for real-time persistence
    const kycDataToStore = { ...formData };
    console.log('Immediate update - saving to localStorage:', kycDataToStore);
    localStorage.setItem('kycSubmissionData', JSON.stringify(kycDataToStore));
    localStorage.setItem('kycSubmittedTime', new Date().toISOString());
    
    // Show success message for immediate update
    setSuccess('Your KYC draft has been saved locally. Continue editing or submit for DigiLocker verification when ready.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required personal information fields
      const requiredFields = [
        'fullName', 'email', 'phone', 'digilockerMobile', 'dateOfBirth', 'address', 
        'city', 'state', 'pincode', 'aadhaarNumber', 'panNumber', 'drivingLicenseNumber'
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        setError('Please fill in all required fields before requesting DigiLocker verification.');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual KYC submission API
      // For now, simulate KYC submission
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create detailed success message
      const updatedFields = [];
      if (formData.fullName) updatedFields.push('Name');
      if (formData.email) updatedFields.push('Email');
      if (formData.phone) updatedFields.push('Phone');
        if (formData.digilockerMobile) updatedFields.push('DigiLocker Mobile');
      
      let successMessage = '';
      if (kycSubmitted) {
        successMessage = `Your KYC details have been updated and queued for DigiLocker verification. We will review the changes and notify you within 24-48 hours.`;
      } else {
        successMessage = 'Your DigiLocker verification request has been submitted. We will verify the linked mobile, Aadhaar, and PAN details and update your KYC status soon.';
      }
      
      setSuccess(successMessage);
      
      // Update user KYC status (temporary localStorage solution)
      localStorage.setItem('kycStatus', 'SUBMITTED');
      localStorage.setItem('kycSubmittedTime', new Date().toISOString());
      
      // Save KYC data for future editing
      const kycDataToStore = { ...formData };
      console.log('Saving KYC data to localStorage:', kycDataToStore);
      localStorage.setItem('kycSubmissionData', JSON.stringify(kycDataToStore));
      
      // Mark KYC as submitted to hide submit button
      setKycSubmitted(true);
      
    } catch (err) {
      console.error('KYC submission error:', err);
      setError('Failed to submit KYC documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">Full Name *</label>
            {modifiedFields.has('fullName') && (
              <div className="flex items-center gap-1 text-green-400">
                <CheckCircle size={14} />
                <span className="text-xs">Updated</span>
              </div>
            )}
          </div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">Email Address *</label>
            {modifiedFields.has('email') && (
              <div className="flex items-center gap-1 text-green-400">
                <CheckCircle size={14} />
                <span className="text-xs">Updated</span>
              </div>
            )}
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">DigiLocker Linked Mobile *</label>
          <input
            type="tel"
            name="digilockerMobile"
            value={formData.digilockerMobile}
            onChange={handleChange}
            placeholder="Enter the mobile number linked with DigiLocker"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Driving License Number *</label>
          <input
            type="text"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleChange}
            placeholder="DL-XX-YYYY-XXXXXXX"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">PAN Number *</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="XXXXX0000X"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            maxLength={10}
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">Address *</label>
          {modifiedFields.has('address') && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle size={14} />
              <span className="text-xs">Updated</span>
            </div>
          )}
        </div>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">PIN Code *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderVerificationInfo = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-orange-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">DigiLocker Verification</h3>
            <p className="text-gray-400 text-sm">
              Your identity will be verified by our backend using DigiLocker and trusted document sources.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-300">
          <p>
            Please enter the mobile number that is linked to your DigiLocker account. This helps the backend verify your identity
            quickly and securely.
          </p>
          <p>
            Our backend team will use DigiLocker to retrieve and verify your Aadhaar/PAN details if the integration is enabled.
            No manual file uploads are needed on this screen.
          </p>
          <p>
            Once verification is requested, you should receive a notification by SMS or email when your KYC status is updated.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-700 p-4 bg-gray-800">
            <p className="text-xs uppercase tracking-wider text-gray-500">Expected result</p>
            <p className="mt-2 text-sm text-gray-200">Automatic identity verification via DigiLocker with no file uploads required.</p>
          </div>
          <div className="rounded-xl border border-gray-700 p-4 bg-gray-800">
            <p className="text-xs uppercase tracking-wider text-gray-500">What you can do</p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Verify that your Aadhaar and PAN are connected to DigiLocker.</li>
              <li>Keep your registered phone and email active.</li>
              <li>Review your profile details before requesting verification.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-5 text-gray-300">
        <p className="text-sm leading-6">
          When you submit the form, we will send your verified details to the backend.
          The backend will then trigger DigiLocker or other trusted checks, and your KYC status will be updated
          once verification completes.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 p-4 sm:pt-24 sm:p-6">
      {/* Update Notification */}
      {showUpdateNotification && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:top-4 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse max-w-sm sm:max-w-none">
          <CheckCircle size={16} className="flex-shrink-0" />
          <span className="text-sm sm:text-base">Your KYC data has been loaded and updated!</span>
        </div>
      )}

      {/* Update Click Notification */}
      {showUpdateClickNotification && (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 sm:top-20 bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse max-w-sm sm:max-w-none">
          <CheckCircle size={16} className="flex-shrink-0" />
          <span className="text-sm sm:text-base">Update initiated! Your changes are being processed.</span>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">
                {kycSubmitted ? 'Update KYC Details' : 'KYC Verification'}
              </h2>
              <p className="mt-2 text-sm text-gray-400 max-w-3xl">
                {kycSubmitted
                  ? 'Update your submitted KYC information and submit it again for DigiLocker review.'
                  : 'Submit your details for DigiLocker verification and unlock full account access.'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-300">
            <div className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-orange-300">
              <Shield size={16} />
            </div>
            <span className="max-w-3xl">
              {kycSubmitted
                ? 'DigiLocker verification will review the updated information and notify you once completed.'
                : 'Once submitted, we’ll verify your linked mobile, Aadhaar, and PAN through DigiLocker.'}
            </span>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-lg text-green-300">
            {success}
          </div>
        )}

        {/* Update Mode Indicator */}
        {kycSubmitted && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg text-blue-300">
            <div className="flex items-center gap-2">
              <Edit2 size={16} />
              <span className="font-medium">Update Mode</span>
            </div>
            <p className="text-sm mt-1 text-blue-200">
              You're updating your previously submitted KYC information. Your data has been pre-filled below.
            </p>
          </div>
        )}

        {/* KYC Form */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 p-1 bg-gray-700 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all ${
                activeTab === 'personal'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              <User size={18} className="inline mr-2" />
              Personal Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all ${
                activeTab === 'verification'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              <FileText size={18} className="inline mr-2" />
              Verification
            </button>
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSubmit}>
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'verification' && renderVerificationInfo()}

            <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/my-profile')}
                className="w-full sm:w-auto px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              {activeTab === 'personal' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('verification')}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Review Verification
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {loading && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? 'Request Verification' : 'Request DigiLocker Verification'}
                </button>
              )}
            </div>

          {/* Personal Info Tab Buttons */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;