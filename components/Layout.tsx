
import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User as UserIcon, MapPin, Mail, Globe, ShieldCheck } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock user for local offline mode
  const [user, setUser] = useState<{ displayName: string, email: string, photoURL: string } | null>({
    displayName: "Local User",
    email: "local@example.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=local"
  });
  const [location, setLocation] = useState<string>('Detecting location...');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || 'Unknown';
          const country = data.address.country || 'Unknown';
          setLocation(`${city}, ${country}`);
        } catch (error) {
          setLocation('Location unavailable');
        }
      }, () => {
        setLocation('Location access denied');
      });
    } else {
      setLocation('Geolocation not supported');
    }
  }, []);

  const handleGoogleLogin = async () => {
    // Mock login
    setUser({
      displayName: "Local User",
      email: "local@example.com",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=local"
    });
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.657M16 8l1-4m-3 0l-1 4m-2-2.25V7a2 2 0 114 0v.75M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">VisaScope <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI</span></span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-slate-500 text-sm bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                <span className="font-medium truncate max-w-[150px]">{location}</span>
              </div>

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-xs font-bold text-slate-900 leading-none">{user.displayName || user.email?.split('@')[0]}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
            <div className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 text-sm font-medium">Choose your preferred sign-in method</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-200 transition-all group"
                >
                  <Globe className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>Continue with Google</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-200 transition-all group">
                  <Mail className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span>Continue with Email</span>
                </button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or manually</span></div>
                </div>
                <button className="w-full flex items-center justify-center space-x-3 bg-slate-900 p-4 rounded-2xl font-bold text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  <UserIcon className="w-5 h-5" />
                  <span>Manual Login</span>
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 font-medium">
                By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="w-full bg-slate-50 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 border-t border-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm font-medium">© 2026 VisaScope AI. Powered by Local ML Engine. Information provided is for estimation only.</p>
        </div>
      </footer>
    </div>
  );
};
