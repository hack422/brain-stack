import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Check if user is already authenticated
    if (!isClient || !router.isReady) return;
    
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        if (response.ok) {
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [router, isClient]);

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  // Don't render the component until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#23234b] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login - Brainstack Education</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#23234b] flex items-center justify-center px-4">
        <div className="bg-[#181828] rounded-xl p-8 w-full max-w-md shadow-2xl border border-white/10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Brainstack Education</h1>
            <p className="text-gray-400 text-sm">Sign in with Google to continue</p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg flex items-center justify-center gap-3"
          >
            <FaGoogle className="text-red-500" size={20} />
            Continue with Google
          </button>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}