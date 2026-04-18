import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const KYCSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-4 text-green-400 mb-6">
          <CheckCircle size={28} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">KYC Verified Successfully</h1>
            <p className="text-sm text-gray-400 mt-1">Your identity has been validated and your account is now ready for full access.</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-200">
          <p>Thank you for submitting your DigiLocker verification details. Our backend has confirmed your Aadhaar/PAN match.</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Your profile is now verified for secure ride bookings.</li>
            <li>You can continue to post rides, browse routes, and use premium features.</li>
            <li>If you want, you can review your profile or update details at any time.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/my-profile')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Go to My Profile
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/browse')}
            className="inline-flex items-center justify-center rounded-full border border-gray-700 bg-transparent px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-orange-500 hover:text-white"
          >
            Browse Rides
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCSuccess;
