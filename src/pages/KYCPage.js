import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, FileText, AlertCircle, Upload, ArrowLeft } from 'lucide-react';

// Last updated: 2026-04-18 19:15 - Next button fix deployed

const KYCPage = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNumber: '',
    panNumber: '',
    drivingLicenseNumber: '',
    idProof: null,
    addressProof: null,
    drivingLicense: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [kycSubmitted, setKycSubmitted] = useState(false);

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
    
    // Load previously submitted KYC data if exists
    const storedKycData = localStorage.getItem('kycSubmissionData');
    if (storedKycData) {
      try {
        const kycData = JSON.parse(storedKycData);
        setFormData(kycData);
        setKycSubmitted(true);
      } catch (error) {
        console.log('Error loading stored KYC data:', error);
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if all required documents are uploaded (only runs when submit button is clicked)
      if (!formData.idProof || !formData.addressProof || !formData.drivingLicense) {
        setError('Please upload all required documents (ID Proof, Address Proof, and Driving License) before submitting.');
        setLoading(false);
        return;
      }

      // Validate required personal information fields (from both tabs)
      const personalInfoFields = [
        'fullName', 'email', 'phone', 'dateOfBirth', 'address', 
        'city', 'state', 'pincode', 'panNumber'
      ];
      
      const documentFields = ['aadhaarNumber', 'drivingLicenseNumber'];
      
      const missingPersonalFields = personalInfoFields.filter(field => !formData[field]);
      const missingDocumentFields = documentFields.filter(field => !formData[field]);
      
      if (missingPersonalFields.length > 0 || missingDocumentFields.length > 0) {
        setError('Please fill in all required fields in both Personal Information and Document Upload tabs before submitting.');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual KYC submission API
      // For now, simulate KYC submission
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('KYC documents submitted successfully! Our team will verify your documents within 24-48 hours.');
      
      // Update user KYC status (temporary localStorage solution)
      localStorage.setItem('kycStatus', 'SUBMITTED');
      localStorage.setItem('kycSubmittedTime', new Date().toISOString());
      
      // Save KYC data for future editing
      localStorage.setItem('kycSubmissionData', JSON.stringify(formData));
      
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
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none resize-none"
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
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

  const renderDocumentUpload = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Aadhaar Number *</label>
          <input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            placeholder="XXXX-XXXX-XXXX"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            maxLength={14}
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
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">ID Proof (Aadhaar Card) *</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <input
              type="file"
              name="idProof"
              onChange={handleChange}
              accept="image/*,.pdf"
              className="hidden"
              id="idProof"
            />
            <label htmlFor="idProof" className="cursor-pointer">
              <span className="text-gray-300">Click to upload ID proof</span>
              <p className="text-gray-500 text-sm mt-2">PNG, JPG, PDF up to 10MB</p>
            </label>
            {formData.idProof && (
              <p className="text-green-400 text-sm mt-2">{formData.idProof.name}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Driving License *</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <input
              type="file"
              name="drivingLicense"
              onChange={handleChange}
              accept="image/*,.pdf"
              className="hidden"
              id="drivingLicense"
            />
            <label htmlFor="drivingLicense" className="cursor-pointer">
              <span className="text-gray-300">Click to upload driving license</span>
              <p className="text-gray-500 text-sm mt-2">Front and back in one file</p>
            </label>
            {formData.drivingLicense && (
              <p className="text-green-400 text-sm mt-2">{formData.drivingLicense.name}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address Proof *</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <input
              type="file"
              name="addressProof"
              onChange={handleChange}
              accept="image/*,.pdf"
              className="hidden"
              id="addressProof"
              required
            />
            <label htmlFor="addressProof" className="cursor-pointer">
              <span className="text-gray-300">Click to upload address proof</span>
              <p className="text-gray-500 text-sm mt-2">Utility bill, bank statement, etc.</p>
            </label>
            {formData.addressProof && (
              <p className="text-green-400 text-sm mt-2">{formData.addressProof.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-orange-900/20 border border-orange-800/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-orange-400 mt-1 flex-shrink-0" size={20} />
          <div className="text-sm text-orange-300">
            <p className="font-medium mb-2">Important Requirements for Bike Pooling:</p>
            <ul className="list-disc list-inside space-y-1 text-orange-200">
              <li><strong>Valid driving license is MANDATORY</strong> for posting rides</li>
              <li>Driving license must be current and not expired</li>
              <li>Both front and back of license should be visible</li>
              <li>License should clearly show your name and photo</li>
              <li>Documents must be clear and readable</li>
              <li>Name on all documents should match your profile name</li>
              <li>Address proof should be recent (within 3 months)</li>
              <li>Verification process takes 24-48 hours</li>
              <li>You cannot post rides until driving license is verified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {kycSubmitted ? 'Update KYC Details' : 'KYC Verification'}
              </h2>
              {kycSubmitted && (
                <p className="text-gray-400 text-sm mt-1">
                  Review and update your submitted KYC information
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/my-profile')}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Profile
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">KYC Verification</h1>
              <p className="text-gray-400">Complete your identity verification to unlock all features</p>
            </div>
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

        {/* KYC Form */}
        <div className="bg-gray-800 rounded-2xl p-8">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 p-1 bg-gray-700 rounded-lg">
            <button
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
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all ${
                activeTab === 'documents'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              <FileText size={18} className="inline mr-2" />
              Document Upload
            </button>
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSubmit}>
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'documents' && (
              <>
                {renderDocumentUpload()}
                
                {/* Document Upload Status */}
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Document Upload Status:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">ID Proof (Aadhaar Card):</span>
                      <span className={formData.idProof ? "text-green-400" : "text-red-400"}>
                        {formData.idProof ? "✓ Uploaded" : "✗ Required"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Driving License:</span>
                      <span className={formData.drivingLicense ? "text-green-400" : "text-red-400"}>
                        {formData.drivingLicense ? "✓ Uploaded" : "✗ Required"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Address Proof:</span>
                      <span className={formData.addressProof ? "text-green-400" : "text-red-400"}>
                        {formData.addressProof ? "✓ Uploaded" : "✗ Required"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4">
                  {(() => {
                const hoursSinceSubmission = kycSubmittedTime ? 
                  (Date.now() - kycSubmittedTime.getTime()) / (1000 * 60 * 60) : 0;
                
                // Show normal form if not submitted OR can still update (within 12 hours)
                return !kycSubmitted || hoursSinceSubmission < 12;
              })() ? (
                    <>
                      <button
                        type="button"
                        onClick={() => navigate('/my-profile')}
                        className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !formData.idProof || !formData.addressProof || !formData.drivingLicense}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        {loading && (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? (kycSubmitted ? 'Updating...' : 'Submitting...') : (kycSubmitted ? 'Update KYC' : 'Submit KYC')}
                      </button>
                    </>
                  ) : (
                    // Show "Already Submitted" message only after 12 hours
                    <div className="flex items-center gap-3 text-blue-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">KYC Already Submitted</span>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Personal Info Tab Buttons */}
            {activeTab === 'personal' && (
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-profile')}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;