import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import authAPI from '../authAPI';

const KYCPage = ({ user }) => {
  const navigate = useNavigate();

  const [digilockerUrl, setDigilockerUrl] = useState('');
  const [isDigilockerInitiated, setIsDigilockerInitiated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [digilockerStatus, setDigilockerStatus] = useState(null);
  
  // Local notification for status check
  const [localMessage, setLocalMessage] = useState('');
  const [localMessageType, setLocalMessageType] = useState(''); // 'success' or 'error'

  const checkDigilockerStatus = async () => {
    // Clear previous messages - only clear local notifications, keep global ones for other operations
    setLocalMessage('');
    
    try {
      console.log('=== DEBUGGING DIGILOCKER STATUS ===');
      console.log('Checking DigiLocker status...');
      console.log('API URL: https://bike-cytc.onrender.com/api/digilocker/status');
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      console.log('Token first 10 chars:', token?.substring(0, 10));
      
      if (!token) {
        setLocalMessage('No authentication token found. Please log in again.');
        setLocalMessageType('error');
        console.error('ERROR: No token found in localStorage');
        return;
      }
      
      const response = await authAPI.getDigiLockerStatus();
      console.log('DigiLocker status response:', response);
      
      if (response && response.success) {
        const data = response.data;
        console.log('DL Verified:', data.dlVerified);
        console.log('DL Number:', data.dlNumber);
        console.log('DL Document URL:', data.dlDocumentUrl);
        console.log('Can Post Rides:', data.canPostRides);
        console.log('Message:', data.message);
        
        setDigilockerStatus(data);
        
        // If DL is verified, show success message and update KYC status
        if (data.dlVerified) {
          setLocalMessage(`DL verified! ${data.message || 'You can now add vehicles and post rides.'}`);
          setLocalMessageType('success');
          
          // Update KYC status to VERIFIED
          localStorage.setItem('kycStatus', 'VERIFIED');
          
          // Update user data to reflect KYC verification
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          userData.kycStatus = 'VERIFIED';
          userData.dlVerified = true;
          userData.canPostRides = data.canPostRides;
          localStorage.setItem('user', JSON.stringify(userData));
          
          console.log('KYC status updated to VERIFIED');
        } else {
          setLocalMessage('DL verification not yet completed. Please complete verification first.');
          setLocalMessageType('error');
        }
      }
    } catch (err) {
      console.error('=== DIGILOCKER STATUS ERROR DEBUGGING ===');
      console.error('Error:', err);
      console.error('Status:', err.response?.status);
      console.error('Status Text:', err.response?.statusText);
      console.error('Response Data:', err.response?.data);
      console.error('Headers:', err.response?.headers);
      console.error('Config:', err.config);
      
      if (err.response?.status === 403) {
        setLocalMessage('403 Forbidden: Authentication issue. Please check your login status or contact support.');
        setLocalMessageType('error');
      } else {
        setLocalMessage('Failed to check DigiLocker status.');
        setLocalMessageType('error');
      }
    }
  };

  React.useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    checkDigilockerStatus();
  }, [user, navigate]);

  const initiateDigilocker = async () => {
    setLoading(true);
    // Clear all notifications
    setError('');
    setSuccess('');
    setLocalMessage('');

    try {
      console.log('=== DEBUGGING DIGILOCKER INITIATION ===');
      console.log('Initiating DigiLocker verification...');
      console.log('API URL: https://bike-cytc.onrender.com/api/digilocker/initiate');
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      console.log('Token first 10 chars:', token?.substring(0, 10));
      
      if (!token) {
        setLocalMessage('No authentication token found. Please log in again.');
        setLocalMessageType('error');
        console.error('ERROR: No token found in localStorage');
        return;
      }
      
      const response = await authAPI.initiateDigiLocker();
      console.log('DigiLocker initiation response:', response);

      if (response && response.success) {
        const url = response.data.digiLockerUrl;
        const state = response.data.state;
        const message = response.data.message;
        
        console.log('DigiLocker URL:', url);
        console.log('State:', state);
        console.log('Message:', message);
        
        if (!url) {
          setLocalMessage('DigiLocker URL not received. Please try again.');
          setLocalMessageType('error');
          return;
        }
        
        setDigilockerUrl(url);
        setIsDigilockerInitiated(true);
        setLocalMessage(message || 'DigiLocker verification initiated!');
        setLocalMessageType('success');

        window.open(url, '_blank');
        
        // Check status after a delay to allow user to complete verification
        setTimeout(() => {
          console.log('Checking DigiLocker status after initiation...');
          checkDigilockerStatus();
        }, 5000);
      } else {
        setLocalMessage(response?.message || 'Failed to initiate DigiLocker verification.');
        setLocalMessageType('error');
      }
    } catch (err) {
      console.error('=== DIGILOCKER INITIATION ERROR DEBUGGING ===');
      console.error('Error:', err);
      console.error('Status:', err.response?.status);
      console.error('Status Text:', err.response?.statusText);
      console.error('Response Data:', err.response?.data);
      console.error('Headers:', err.response?.headers);
      console.error('Config:', err.config);
      
      if (err.response?.status === 403) {
        setLocalMessage('403 Forbidden: Authentication issue. Please check your login status or contact support.');
        setLocalMessageType('error');
      } else {
        setLocalMessage(err?.response?.data?.message || 'Failed to initiate DigiLocker verification.');
        setLocalMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual DL verification removed - API handles verification automatically

  const handleSubmit = async () => {
    await initiateDigilocker();
  };

  const renderVerificationInfo = () => {
    if (!digilockerStatus) {
      return (
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-orange-500" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white">DigiLocker Verification</h3>
              <p className="text-sm text-gray-400">Verify your Driving License instantly through DigiLocker</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin" />
              <span className="text-gray-500 text-sm">Not Verified</span>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Click "Request DigiLocker Verification" to verify your Driving License.
            </p>
          </div>
        </div>
      );
    }

    // If DL is verified via DigiLocker, show verified status
    if (digilockerStatus.dlVerified) {
      return (
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-orange-500" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white">DigiLocker Verification</h3>
              <p className="text-sm text-gray-400">Verify your Driving License instantly through DigiLocker</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-green-600 font-medium">Verified</span>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              {digilockerStatus.message || 'Your DigiLocker is verified. You can now add vehicles and post rides.'}
            </p>
            {digilockerStatus.dlNumber && (
              <p className="text-xs text-gray-400 mt-1">
                DL Number: {digilockerStatus.dlNumber}
              </p>
            )}
            {digilockerStatus.canPostRides && (
              <p className="text-xs text-green-600 mt-1">
                Can Post Rides: Yes
              </p>
            )}
            {digilockerStatus.dlDocumentUrl && (
              <div className="mt-2">
                <a 
                  href={digilockerStatus.dlDocumentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 block"
                  onClick={(e) => {
                    console.log('Opening DL Document URL:', digilockerStatus.dlDocumentUrl);
                    // Add error handling for blank page
                    const newWindow = window.open(digilockerStatus.dlDocumentUrl, '_blank');
                    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                      e.preventDefault();
                      alert('Unable to open document. The link may be invalid or blocked by popup settings.');
                    }
                  }}
                >
                  View DL Document
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  Note: Test document link - may show blank page
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // If not verified, show verification required
    return (
      <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-orange-500" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white">DigiLocker Verification</h3>
            <p className="text-sm text-gray-400">Verify your Driving License instantly through DigiLocker</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-yellow-400 rounded-full animate-spin" />
            <span className="text-yellow-400 font-medium">DL Verification Required</span>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            Please complete the DigiLocker verification to proceed.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 p-4 sm:pt-24 sm:p-6">
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

      {/* Local Notification for Status Check */}
      {localMessage && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${
          localMessageType === 'success' 
            ? 'bg-green-900 text-green-200 border border-green-700' 
            : 'bg-red-900 text-red-200 border border-red-700'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              {localMessageType === 'success' ? (
                <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm">{localMessage}</span>
            </div>
            <button
              onClick={() => setLocalMessage('')}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">
                KYC Verification
              </h2>
              <p className="mt-2 text-sm text-gray-400 max-w-3xl">
                Verify your Driving License through DigiLocker and unlock full account access.
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-300">
            <div className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-orange-300">
              <Shield size={16} />
            </div>
            <span className="max-w-3xl">
              Secure DigiLocker Verification
            </span>
          </div>
        </div>

        {/* Top DigiLocker Button */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Quick Verification</h3>
                <p className="text-sm text-gray-400">Start your DigiLocker verification instantly</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={checkDigilockerStatus}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Check Status
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || digilockerStatus?.dlVerified}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? 'Verifying...' : digilockerStatus?.dlVerified ? 'Already Verified' : 'Request DigiLocker Verification'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">DigiLocker Verification</h2>
            <p className="text-gray-400">
              Complete your KYC verification through our secure DigiLocker integration.
            </p>
          </div>

          {renderVerificationInfo()}
        </div>
      </div>
    </div>
  );
};

export default KYCPage;