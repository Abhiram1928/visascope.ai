
import sys
import json
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# 1. ENHANCED MOCK DATASET
data = {
    'nationality': ['India', 'China', 'USA', 'UK', 'Nigeria', 'Brazil', 'India', 'China', 'USA', 'Germany'],
    'destination': ['USA', 'UK', 'Canada', 'France', 'Germany', 'USA', 'Australia', 'Japan', 'UK', 'USA'],
    'visa_type': ['Tourist', 'Student', 'Work', 'Tourist', 'Student', 'Work', 'Tourist', 'Tourist', 'Business', 'Work'],
    'monthly_income': [5000, 2000, 8000, 4000, 1500, 6000, 3000, 4500, 7000, 9000],
    'has_travel_history': [1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    'approved': [1, 1, 1, 1, 0, 1, 0, 1, 1, 1]
}

df = pd.DataFrame(data)

# 2. PREPROCESSING
le_nat = LabelEncoder().fit(df['nationality'])
le_dest = LabelEncoder().fit(df['destination'])
le_type = LabelEncoder().fit(df['visa_type'])

# Helper to handle unknown labels
def safe_encode(le, val):
    if val in le.classes_:
        return le.transform([val])[0]
    return 0

# 3. MODEL TRAINING
X = pd.DataFrame({
    'nat': df['nationality'].map(lambda x: safe_encode(le_nat, x)),
    'dest': df['destination'].map(lambda x: safe_encode(le_dest, x)),
    'type': df['visa_type'].map(lambda x: safe_encode(le_type, x)),
    'income': df['monthly_income'],
    'history': df['has_travel_history']
})
y = df['approved']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

def predict_visa(input_data):
    try:
        # Encode inputs
        nat_enc = safe_encode(le_nat, input_data.get('nationality', ''))
        dest_enc = safe_encode(le_dest, input_data.get('destination', ''))
        type_enc = safe_encode(le_type, input_data.get('visaType', 'Tourist'))
        income = float(input_data.get('monthlyIncome', 3000))
        history = 1 if input_data.get('travelHistory') else 0

        # Predict
        features = [[nat_enc, dest_enc, type_enc, income, history]]
        prob = model.predict_proba(features)[0][1]
        
        # Generate structured response matching the UI expectations
        result = {
            "approvalProbability": int(prob * 100),
            "estimatedDays": 15 if prob > 0.6 else 30,
            "riskLevel": "Low" if prob > 0.7 else "Medium" if prob > 0.4 else "High",
            "keyFactors": [
                {
                    "factor": "Income Level",
                    "impact": "positive" if income > 4000 else "neutral",
                    "description": f"Monthly income of ${income} provides a stable financial baseline."
                },
                {
                    "factor": "Travel History",
                    "impact": "positive" if history else "negative",
                    "description": "Previous international travel is a strong indicator of visa compliance." if history else "Lack of travel history requires stronger local ties."
                }
            ],
            "recommendations": [
                "Ensure all financial statements are notarized.",
                "Provide a detailed cover letter explaining the purpose of visit.",
                "Include proof of property or employment in home country."
            ],
            "recentTrends": "Local ML Model Analysis: Processing times are currently stable. High approval rates for applicants with strong financial documentation.",
            "sources": [{"title": "Local ML Engine", "uri": "#"}]
        }
        return result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_json = json.loads(sys.argv[1])
        print(json.dumps(predict_visa(input_json)))
    else:
        print(json.dumps({"error": "No input data provided"}))
