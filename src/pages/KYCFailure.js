import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';

const KYCFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-4 text-red-400 mb-6">
          <AlertCircle size={28} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">KYC Verification Failed</h1>
            <p className="text-sm text-gray-400 mt-1">We couldn’t complete verification with the details you submitted.</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-200">
          <p>Please check your DigiLocker-linked mobile, Aadhaar, and PAN details, then try again.</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Confirm the mobile number entered is linked to your DigiLocker account.</li>
            <li>Verify that your Aadhaar and PAN details are correct and currently active.</li>
            <li>If needed, update the information and resubmit for verification.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/kyc')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Retry KYC
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-profile')}
            className="inline-flex items-center justify-center rounded-full border border-gray-700 bg-transparent px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-orange-500 hover:text-white"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCFailure;
