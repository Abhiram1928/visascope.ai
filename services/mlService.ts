
import { VisaApplicationData, PredictionResult } from "../types";

export const predictVisaStatus = async (data: VisaApplicationData): Promise<PredictionResult> => {
  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch prediction from ML Engine");
    }

    const result = await response.json();
    return result as PredictionResult;
  } catch (error) {
    console.error("Error predicting visa status:", error);
    throw error;
  }
};
