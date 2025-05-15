
import { useState, useEffect } from 'react';

interface PrayData {
  coins: number;
  tapsCount: number;
  referrals: number;
  lastDailyReward?: string;
  miningPower?: number;
}

const defaultData: PrayData = {
  coins: 0,
  tapsCount: 0,
  referrals: 0,
  miningPower: 1
};

export function usePrayData() {
  const [data, setData] = useState<PrayData>(() => {
    const savedData = localStorage.getItem('praybitData');
    return savedData ? JSON.parse(savedData) : defaultData;
  });
  
  useEffect(() => {
    localStorage.setItem('praybitData', JSON.stringify(data));
  }, [data]);
  
  // Calculate and update mining power based on taps
  useEffect(() => {
    const miningPower = Math.floor(1 + (data.tapsCount / 100));
    if (miningPower !== data.miningPower) {
      setData(prev => ({
        ...prev,
        miningPower
      }));
    }
  }, [data.tapsCount, data.miningPower]);
  
  const updateCoins = (amount: number) => {
    setData(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  };
  
  const incrementTaps = () => {
    const miningPower = Math.floor(1 + (data.tapsCount / 100));
    
    setData(prev => ({
      ...prev,
      tapsCount: prev.tapsCount + 1,
      coins: prev.coins + miningPower, // Add coins based on current mining power
    }));
  };
  
  const incrementReferrals = () => {
    setData(prev => ({
      ...prev,
      referrals: prev.referrals + 1,
      coins: prev.coins + 10, // Add 10 coins per referral
    }));
  };
  
  const claimDailyReward = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (data.lastDailyReward === today) {
      return false; // Already claimed today
    }
    
    setData(prev => ({
      ...prev,
      lastDailyReward: today,
      coins: prev.coins + 5, // Add 5 coins for daily reward
    }));
    
    return true; // Successfully claimed
  };
  
  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem('praybitData');
  };
  
  return {
    data,
    updateCoins,
    incrementTaps,
    incrementReferrals,
    claimDailyReward,
    resetData,
  };
}
