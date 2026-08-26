/**
 * RAKSHA-AI API Service Client
 * Handles communication with FastAPI backend endpoints.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function predictHazard(payload) {
  try {
    const response = await fetch(`${BASE_URL}/api/predict-hazard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Server error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Hazard Prediction API Error:', error);
    throw error;
  }
}

export async function optimizeDispatch(payload) {
  try {
    const response = await fetch(`${BASE_URL}/api/optimize-dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Server error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Dispatch Optimization API Error:', error);
    throw error;
  }
}
