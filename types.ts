
export type VisaType = 'Tourist' | 'Student' | 'Work' | 'Business' | 'Digital Nomad' | 'Permanent Residency' | 'Family Reunion' | 'Medical' | 'Transit' | 'Cultural/Sports';

export interface VisaApplicationData {
  nationality: string;
  destination: string;
  visaType: VisaType;
  occupation: string;
  monthlyIncome: number;
  travelHistory: string;
  purposeOfVisit: string;
  documentsPrepared: string[];
}

export interface PredictionResult {
  approvalProbability: number;
  estimatedDays: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  keyFactors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  recommendations: string[];
  recentTrends: string;
  sources?: { title: string; uri: string }[];
}

export interface ProcessingTrendData {
  month: string;
  days: number;
  volume: number;
}
