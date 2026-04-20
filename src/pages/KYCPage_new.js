import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

const KYCPage = ({ user }) => {
  const navigate = useNavigate();
  
  // Initialize with empty form - stored data will be loaded in useEffect
  const [formData, setFormData] = useState({
    idProof: null,
    drivingLicense: null,
    addressProof: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [kycSubmitted, setKycSubmitted] = useState(false);

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
          
          // Load document data from storage
          const mergedData = {
            idProof: kycData.idProof || null,
            drivingLicense: kycData.drivingLicense || null,
            addressProof: kycData.addressProof || null,
          };
          
          console.log('Merged KYC data:', mergedData);
          setFormData(mergedData);
          setKycSubmitted(true);
          
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
            
            // Load document data from storage
            const mergedData = {
              idProof: kycData.idProof || null,
              drivingLicense: kycData.drivingLicense || null,
              addressProof: kycData.addressProof || null,
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
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required documents
      if (!formData.idProof || !formData.drivingLicense || !formData.addressProof) {
        setError('Please upload all required documents (ID Proof, Driving License, and Address Proof).');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual KYC submission API
      // For now, simulate KYC submission
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const successMessage = 'Your DigiLocker verification request has been submitted. We will verify your documents and update your KYC status soon.';
      
      setSuccess(successMessage);
      
      // Update user KYC status (temporary localStorage solution)
      localStorage.setItem('kycStatus', 'SUBMITTED');
      localStorage.setItem('kycSubmittedTime', new Date().toISOString());
      
      // Save KYC data for future editing
      const kycDataToStore = { ...formData };
      console.log('Saving KYC data to localStorage:', kycDataToStore);
      localStorage.setItem('kycSubmissionData', JSON.stringify(kycDataToStore));
      
      // Mark KYC as submitted
      setKycSubmitted(true);
      
    } catch (err) {
      console.error('KYC submission error:', err);
      setError('Failed to submit KYC documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">
                KYC Verification
              </h2>
              <p className="mt-2 text-sm text-gray-400 max-w-3xl">
                Submit your documents for DigiLocker verification and unlock full account access.
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-300">
            <div className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-orange-300">
              <Shield size={16} />
            </div>
            <span className="max-w-3xl">
              Once submitted, we'll verify your documents through DigiLocker and notify you once completed.
            </span>
          </div>
        </div>

        {/* KYC Form */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">DigiLocker Verification</h2>
            <p className="text-gray-400">
              Complete your KYC verification by uploading your documents through our secure DigiLocker integration.
            </p>
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSubmit}>
            {renderVerificationInfo()}

            <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/my-profile')}
                className="w-full sm:w-auto px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
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
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
