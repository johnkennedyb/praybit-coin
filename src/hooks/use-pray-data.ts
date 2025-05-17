
import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useSupabase } from '@/contexts/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const { user } = useSupabase();
  const [data, setData] = useState<PrayData>(() => {
    const savedData = localStorage.getItem('praybitData');
    return savedData ? JSON.parse(savedData) : defaultData;
  });
  
  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          // Check if user has existing data in Supabase
          // Using explicit types to avoid TypeScript errors
          const { data: userData, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user stats:', error);
            return;
          }
          
          if (userData) {
            // If user data exists, use it
            setData({
              coins: userData.coins || 0,
              tapsCount: userData.taps_count || 0,
              referrals: userData.referrals || 0,
              lastDailyReward: userData.last_daily_reward,
              miningPower: Math.floor(1 + ((userData.taps_count || 0) / 100))
            });
          } else if (user.id) {
            // If no user data in Supabase but we have local data, save it to Supabase
            const localData = JSON.parse(localStorage.getItem('praybitData') || JSON.stringify(defaultData));
            
            try {
              await supabase.from('user_stats').insert({
                user_id: user.id,
                coins: localData.coins,
                taps_count: localData.tapsCount,
                referrals: localData.referrals,
                last_daily_reward: localData.lastDailyReward
              });
            } catch (insertError) {
              console.error('Error inserting user stats:', insertError);
              toast({
                title: "Error",
                description: "Failed to save your data",
                variant: "destructive"
              });
            }
          }
        } catch (err) {
          console.error('Error in fetchUserData:', err);
        }
      };
      
      fetchUserData();
    }
  }, [user, toast]);
  
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
  
  // Sync data with Supabase when it changes and user is logged in
  useEffect(() => {
    const updateSupabaseData = async () => {
      if (!user) return;
      
      try {
        await supabase.from('user_stats').upsert({
          user_id: user.id,
          coins: data.coins,
          taps_count: data.tapsCount,
          referrals: data.referrals,
          last_daily_reward: data.lastDailyReward
        });
      } catch (err) {
        console.error('Error updating Supabase data:', err);
      }
    };
    
    // Debounce the updates to avoid too many API calls
    const timeoutId = setTimeout(updateSupabaseData, 1000);
    return () => clearTimeout(timeoutId);
  }, [data, user]);
  
  const updateCoins = (amount: number) => {
    setData(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  };
  
  const incrementTaps = () => {
    // Everyone can mine coins, regardless of wallet connection
    const miningPower = Math.floor(1 + (data.tapsCount / 100));
    
    setData(prev => ({
      ...prev,
      tapsCount: prev.tapsCount + 1,
      coins: prev.coins + miningPower,
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
    
    if (user) {
      // Update Supabase with reset data
      try {
        supabase.from('user_stats').upsert({
          user_id: user.id,
          coins: 0,
          taps_count: 0,
          referrals: 0,
          last_daily_reward: null
        });
      } catch (error) {
        console.error('Error resetting user stats:', error);
      }
    }
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
