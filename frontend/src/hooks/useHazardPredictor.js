import { useState, useCallback } from 'react';
import { predictHazard } from '../services/apiService';

export function useHazardPredictor() {
  const [params, setParams] = useState({
    slope_angle: 42.5,
    rainfall_24h: 185.0,
    soil_moisture: 78.0,
    ndvi: 0.15,
    location_name: 'Gangtok-Pakyong Belt, Sikkim'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const executePrediction = useCallback(async (customParams) => {
    setLoading(true);
    setError(null);
    try {
      const payload = customParams || params;
      const data = await predictHazard(payload);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to calculate hazard risk index');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  return {
    params,
    updateParam,
    loading,
    result,
    error,
    executePrediction
  };
}
