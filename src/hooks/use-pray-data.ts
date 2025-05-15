
import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';

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
  const { account } = useWeb3();
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
    // When connected to MetaMask, we track taps but coins are handled by the blockchain
    const miningPower = Math.floor(1 + (data.tapsCount / 100));
    
    setData(prev => ({
      ...prev,
      tapsCount: prev.tapsCount + 1,
      // Only update the local coin count if not connected to wallet
      coins: !account ? prev.coins + miningPower : prev.coins,
    }));
  };
  
  const incrementReferrals = () => {
    setData(prev => ({
      ...prev,
      referrals: prev.referrals + 1,
      // Only update the local coin count if not connected to wallet
      coins: !account ? prev.coins + 10 : prev.coins, // Add 10 coins per referral
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
      // Only update the local coin count if not connected to wallet
      coins: !account ? prev.coins + 5 : prev.coins, // Add 5 coins for daily reward
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
