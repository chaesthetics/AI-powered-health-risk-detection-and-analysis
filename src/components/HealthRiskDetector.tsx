import React, { useState, FormEvent } from "react";
import { Heart, Activity, Coffee, Moon, Zap, User, Play } from "lucide-react";
import axios from "axios";

type FormData = {
  id: number;
  age: number;
  gender: number;
  coffee_intake: number;
  caffeine_mg: number;
  sleep_hours: number;
  sleep_quality: number;
  bmi: number;
  heart_rate: number;
  stress_level: number;
  physical_activity_hours: number;
  smoking: number;
  alcohol_consumption: number;
};

export default function HealthRiskDetector() {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    age: 0,
    gender: 0,
    coffee_intake: 0,
    caffeine_mg: 0,
    sleep_hours: 0,
    sleep_quality: 0,
    bmi: 0,
    heart_rate: 0,
    stress_level: 0,
    physical_activity_hours: 0,
    smoking: 0,
    alcohol_consumption: 0,
  });

  const [result, setResult] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (
    field: keyof FormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const response = await axios.post<{ prediction: number }>(
        "/api/predict",
        formData
      );
      setResult(response.data.prediction);

      const response1 = await axios.post<{ text: string }>("/api/recommend", {
        prompt:
          "Provide 3 recommendations for a patient with the following details (bullet form, short sentence): " +
          JSON.stringify(formData),
      });

      const text = response1.data.text;
      const rawRecommend = text
        .split("\n")
        .filter((line) => line.trim().startsWith("*"))
        .map((line) =>
          line.replace(/^\*\s*/, "").replace(/\*\*/g, "").trim()
        );

      setRecommendations(rawRecommend);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      age: 0,
      gender: 0,
      coffee_intake: 0,
      caffeine_mg: 0,
      sleep_hours: 0,
      sleep_quality: 0,
      bmi: 0,
      heart_rate: 0,
      stress_level: 0,
      physical_activity_hours: 0,
      smoking: 0,
      alcohol_consumption: 0,
    });
    setResult(null);
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== null);
  };

  // Get risk level details based on result
  const getRiskDetails = (risk: number) => {
    switch (risk) {
      case 0:
        return {
          level: 'None',
          color: 'blue',
          bgClass: 'bg-blue-50 border-blue-200',
          iconBgClass: 'bg-blue-100',
          iconClass: 'text-blue-600',
          textClass: 'text-blue-800',
          recommendations,
          recBgClass: 'bg-blue-50',
          recDotClass: 'bg-blue-500',
          recTextClass: 'text-blue-900'
        };
      case 1:
        return {
          level: 'Mild',
          color: 'green',
          bgClass: 'bg-green-50 border-green-200',
          iconBgClass: 'bg-green-100',
          iconClass: 'text-green-600',
          textClass: 'text-green-800',
          recommendations,
          recBgClass: 'bg-green-50',
          recDotClass: 'bg-green-500',
          recTextClass: 'text-green-900'
        };
      case 2:
        return {
          level: 'Moderate',
          color: 'yellow',
          bgClass: 'bg-yellow-50 border-yellow-200',
          iconBgClass: 'bg-yellow-100',
          iconClass: 'text-yellow-600',
          textClass: 'text-yellow-800',
          recommendations,
          recBgClass: 'bg-yellow-50',
          recDotClass: 'bg-yellow-500',
          recTextClass: 'text-yellow-900'
        };
      case 3:
        return {
          level: 'Severe',
          color: 'red',
          bgClass: 'bg-red-50 border-red-200',
          iconBgClass: 'bg-red-100',
          iconClass: 'text-red-600',
          textClass: 'text-red-800',
          recommendations: [
            'High risk detected - immediate medical consultation recommended',
            'Urgent lifestyle changes and professional intervention needed',
            'Consider comprehensive health assessment'
          ],
          recBgClass: 'bg-red-50',
          recDotClass: 'bg-red-500',
          recTextClass: 'text-red-900'
        };
      default:
        return getRiskDetails(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 p-3 rounded-xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Risk Assessment</h1>
              <p className="text-gray-600">AI-powered health risk detection and analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-2 mb-6">
                <User className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Patient Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.id || ''}
                      onChange={(e) => handleInputChange('id', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter ID"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Age in years"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                        required
                      >
                        <option value="0">Female</option>
                        <option value="1">Male</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coffee & Caffeine */}
                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Coffee className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-800">Caffeine Intake</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coffee Cups/Day <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.coffee_intake || ''}
                        onChange={(e) => handleInputChange('coffee_intake', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 2.5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caffeine (mg/day) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.caffeine_mg || ''}
                        onChange={(e) => handleInputChange('caffeine_mg', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 194.7"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sleep */}
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-indigo-800">Sleep Pattern</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sleep Hours <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.sleep_hours || ''}
                        onChange={(e) => handleInputChange('sleep_hours', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 7.5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sleep Quality <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.sleep_quality}
                          onChange={(e) => handleInputChange('sleep_quality', e.target.value)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                          required
                        >
                          <option value="0">Fair</option>
                          <option value="1">Good</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Physical Health */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Activity className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Physical Health</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        BMI <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.bmi || ''}
                        onChange={(e) => handleInputChange('bmi', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 24.5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heart Rate (BPM) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.heart_rate || ''}
                        onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 72"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Physical Activity (hrs/day) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.physical_activity_hours || ''}
                        onChange={(e) => handleInputChange('physical_activity_hours', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 1.5"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Lifestyle Factors */}
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-800">Lifestyle & Stress</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stress Level <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.stress_level}
                          onChange={(e) => handleInputChange('stress_level', e.target.value)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                          required
                        >
                          <option value="0">Low</option>
                          <option value="1">High</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Smoking <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.smoking}
                          onChange={(e) => handleInputChange('smoking', e.target.value)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                          required
                        >
                          <option value="0">Non-smoker</option>
                          <option value="1">Smoker</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alcohol Consumption <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.alcohol_consumption}
                          onChange={(e) => handleInputChange('alcohol_consumption', e.target.value)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                          required
                        >
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isAnalyzing || !isFormValid()}
                    className="flex-1 hover:cursor-pointer bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Analyze Health Risk</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>

                {/* Form Validation Message */}
                {!isFormValid() && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <span className="font-medium">Note:</span> All fields marked with <span className="text-red-500">*</span> are required to proceed with the analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Risk Assessment</h2>
              </div>

              {result === null && !isAnalyzing && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Activity className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Complete all required fields to see your health risk assessment</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
                  </div>
                  <p className="text-gray-600 font-medium">Analyzing health data...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </div>
              )}

              {result !== null && !isAnalyzing && (
                <div className="space-y-6">
                  {/* Risk Level */}
                  <div className={`p-6 rounded-xl border-2 ${getRiskDetails(result).bgClass}`}>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${getRiskDetails(result).iconBgClass}`}>
                        <Heart className={`w-8 h-8 ${getRiskDetails(result).iconClass}`} />
                      </div>
                      <h3 className={`text-xl font-bold ${getRiskDetails(result).textClass}`}>
                        {getRiskDetails(result).level} Risk
                      </h3>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {getRiskDetails(result).recommendations.map((rec, index) => (
                        <div key={index} className={`flex items-start space-x-2 p-3 ${getRiskDetails(result).recBgClass} rounded-lg`}>
                          <div className={`w-2 h-2 ${getRiskDetails(result).recDotClass} rounded-full mt-2 flex-shrink-0`}></div>
                          <p className={`text-sm ${getRiskDetails(result).recTextClass}`}>{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
                    Generate Detailed Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}