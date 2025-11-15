import type { BerlinClockTime, DecodeResponse } from '../types';

const API_BASE = '/api';

export const api = {
  getCurrentTime: async (): Promise<BerlinClockTime> => {
    const response = await fetch(`${API_BASE}/time`);
    if (!response.ok) throw new Error('Failed to fetch current time');
    return response.json();
  },

  convertTime: async (time: string): Promise<BerlinClockTime> => {
    const response = await fetch(`${API_BASE}/time/convert?time=${encodeURIComponent(time)}`);
    if (!response.ok) throw new Error('Failed to convert time');
    return response.json();
  },

  decodeTime: async (berlinTime: BerlinClockTime): Promise<DecodeResponse> => {
    const response = await fetch(`${API_BASE}/time/decode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(berlinTime),
    });
    if (!response.ok) throw new Error('Failed to decode time');
    return response.json();
  },
};