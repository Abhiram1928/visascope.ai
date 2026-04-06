
import React from 'react';
import { PredictionResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SAMPLE_TREND_DATA } from '../constants';

interface Props {
  result: PredictionResult;
}

export const PredictionDisplay: React.FC<Props> = ({ result }) => {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Probability Card */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-blue-100/50 border border-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Approval Odds</h3>
          <div className="relative flex items-center justify-center w-32 h-32 mb-4">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                <circle cx="64" cy="64" r="58" stroke="url(#blueGradient)" strokeWidth="10" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * result.approvalProbability) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
             </svg>
             <span className="absolute text-4xl font-black text-slate-900 tracking-tighter">{result.approvalProbability}%</span>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${getRiskColor(result.riskLevel)}`}>
            {result.riskLevel} Risk
          </span>
        </div>

        {/* Processing Time Card */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-blue-100/50 border border-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Estimated Time</h3>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-2">
            {result.estimatedDays}
          </div>
          <div className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4">Days</div>
          <p className="text-xs font-medium text-slate-500 px-4">Based on current embassy queue & processing trends.</p>
        </div>

        {/* Trend Insights */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-blue-100/50 border border-white flex flex-col relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Processing Trend</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                   {SAMPLE_TREND_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === SAMPLE_TREND_DATA.length - 1 ? '#2563eb' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Factors */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 20.944a11.955 11.955 0 01-8.618-3.04m12.724-1.391a11.03 11.03 0 002.56-5.56m-2.56 5.56a11.03 11.03 0 01-2.56-5.56M12 20.944a11.955 11.955 0 01-8.618-3.04m12.724-1.391A11.034 11.034 0 019 12.053M12 20.944V12.053" /></svg>
            Key Analysis Factors
          </h3>
          <div className="space-y-4">
            {result.keyFactors.map((factor, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                <div className={`mt-1 p-1 rounded-full ${factor.impact === 'positive' ? 'bg-green-100 text-green-600' : factor.impact === 'negative' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {factor.impact === 'positive' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{factor.factor}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations & Context */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              AI Recommendations
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-center text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3 flex-shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 002 2h4" /></svg>
              Recent Policy Trends
            </h3>
            <p className="text-sm text-blue-50 leading-relaxed">
              {result.recentTrends}
            </p>
          </div>
        </div>
      </div>

      {result.sources && result.sources.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Grounding Sources</h3>
          <div className="flex flex-wrap gap-2">
            {result.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-colors"
              >
                <svg className="w-3 h-3 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
