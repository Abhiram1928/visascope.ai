
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { VisaApplicationData, PredictionResult, VisaType } from './types';
import { VISA_TYPES, COUNTRIES, OCCUPATION_TYPES } from './constants';
import { predictVisaStatus } from './services/mlService';
import { PredictionDisplay } from './components/PredictionDisplay';
import { SearchableSelect } from './components/SearchableSelect';
import { Database, Info } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<VisaApplicationData>({
    nationality: '',
    destination: '',
    visaType: 'Tourist',
    occupation: 'Employed Full-Time',
    monthlyIncome: 3000,
    travelHistory: '',
    purposeOfVisit: '',
    documentsPrepared: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, monthlyIncome: parseInt(e.target.value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictVisaStatus(formData);
      setPrediction(result);
    } catch (err) {
      setError('The ML Engine encountered an error. Please ensure the backend service is running and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Centered Header Section */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-slate-600 uppercase bg-slate-100 rounded-full border border-slate-200">
              ML Engine v1.0 • Enterprise Grade
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Visa Status <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Estimator</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Fill in your application details. I will predict your processing time and likelihood of approval.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Form Section */}
            <div className="lg:col-span-5 space-y-8">
              <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SearchableSelect
                    label="Nationality"
                    options={COUNTRIES}
                    value={formData.nationality}
                    onChange={(val) => setFormData(p => ({ ...p, nationality: val }))}
                    placeholder="Select country"
                  />
                  <SearchableSelect
                    label="Destination"
                    options={COUNTRIES}
                    value={formData.destination}
                    onChange={(val) => setFormData(p => ({ ...p, destination: val }))}
                    placeholder="Select destination"
                  />
                </div>

                <div className="space-y-3">
                  <SearchableSelect
                    label="Visa Category"
                    options={VISA_TYPES}
                    value={formData.visaType}
                    onChange={(val) => setFormData(p => ({ ...p, visaType: val as VisaType }))}
                    placeholder="Select visa category"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SearchableSelect
                    label="Occupation/Activity"
                    options={OCCUPATION_TYPES}
                    value={formData.occupation}
                    onChange={(val) => setFormData(p => ({ ...p, occupation: val }))}
                    placeholder="Select occupation"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Monthly Income (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input 
                        type="number" 
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleMonthlyIncomeChange}
                        className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Travel History</label>
                  <textarea 
                    name="travelHistory"
                    value={formData.travelHistory}
                    onChange={handleInputChange}
                    placeholder="e.g., Previously visited Schengen Area, UK, and USA. No overstays."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-28 resize-none transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Purpose of Visit</label>
                  <input 
                    type="text"
                    name="purposeOfVisit"
                    value={formData.purposeOfVisit}
                    onChange={handleInputChange}
                    placeholder="e.g., 2-week vacation to Paris and Nice"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-2xl shadow-blue-200 transition-all flex items-center justify-center group ${
                    isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing ML Model...
                    </>
                  ) : (
                    <>
                      <Database className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Run ML Prediction
                    </>
                  )}
                </button>
              </form>
            </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {prediction ? (
              <PredictionDisplay result={prediction} />
            ) : isLoading ? (
              <div className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl border border-white shadow-xl shadow-blue-100/50 flex flex-col items-center justify-center space-y-6 animate-pulse">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                  <svg className="w-12 h-12 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Calculating your odds...</h2>
                  <p className="text-slate-500 text-center max-w-sm mx-auto font-medium">
                    Our AI is currently analyzing global visa data, embassy processing times, and historical outcomes for your profile.
                  </p>
                </div>
                <div className="w-full max-w-xs bg-slate-100 h-3 rounded-full overflow-hidden p-1">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full w-1/2 animate-[progress_2s_infinite]"></div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center space-y-4">
                <div className="text-red-500 mx-auto w-12 h-12">
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-red-900">Estimation Error</h3>
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-white p-12 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-50 rounded-full opacity-50 blur-3xl"></div>
                
                <div className="bg-blue-50 p-4 rounded-full">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Ready for Analysis</h2>
                  <p className="text-slate-500 max-w-md">
                    Complete the form on the left to start the analysis. We'll provide a comprehensive report including approval likelihood, timeline, and personalized advice.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs font-semibold text-slate-500">
                    <div className="text-blue-600 text-lg mb-1">500k+</div>
                    Global Records
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs font-semibold text-slate-500">
                    <div className="text-blue-600 text-lg mb-1">Real-time</div>
                    Search Data
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </Layout>
  );
};

export default App;
