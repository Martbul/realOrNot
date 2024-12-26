"use client"

import { FC, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import { useMutation } from "@tanstack/react-query";
import { getProfileStats } from "@/services/stats/stats.service";
import { useAuthContext } from "@/contexts/authContext";

const Profile: FC = () => {
  const { user } = useAuthContext();

  const {
    mutate: profileStatsMutation,
    data: profileStats,
    isLoading: isProfileStateLoading,
    isError: isProfileStatsError,
    error: profileStatsError,
  } = useMutation({
    mutationFn: async () => {
      console.log(user)
      if (!user) {
        throw new Error("User is not authenticated.");
      }
      return await getProfileStats(user.id);
    },
  });



  useEffect(() => {
    profileStatsMutation()
  }, [user])
  return (

    <>
      <Navigation />

      <section className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-10">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <Image
                src="/profile-avatar.png" // Replace with your avatar image path
                alt="Avatar"
                width={120}
                height={120}
                className="rounded-full border-4 border-yellow-500 shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h1 className="text-3xl font-extrabold tracking-wider">{user?.username}</h1>
            <p className="text-yellow-400 text-lg">Level 4</p>
            <div className="mt-2 w-full max-w-md">
              <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                <div
                  className="bg-yellow-500 h-4 rounded-full shadow-md animate-pulse"
                  style={{ width: "38%" }}
                ></div>
                <span className="absolute right-2 top-0 text-xs text-white">38%</span>
              </div>
            </div>
            <p className="text-sm mt-2 text-gray-300">57 / 150 XP</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:bg-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold uppercase">Completed Games</h3>
              <p className="text-4xl font-extrabold text-yellow-500">{profileStats?.AllGamesPlayed}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:bg-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold uppercase">Win Ratio - Duels</h3>
              <p className="text-4xl font-extrabold text-yellow-500">{(profileStats?.DuelWins / profileStats?.DuelGamesPlayed) * 100}%</p>
              <p className="text-gray-400">Played: {profileStats?.DuelGamesPlayed}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:bg-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold uppercase">Best Streak</h3>
              <p className="text-4xl font-extrabold text-yellow-500">{profileStats?.StreakGameHighestScore}</p>
              <p className="text-gray-400">Games Played: {profileStats?.StreakGamesPlayed}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:bg-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold uppercase">Win Ratio - Pin Point Singleplayer</h3>
              <p className="text-4xl font-extrabold text-yellow-500">{(profileStats?.PinPointSPWins / profileStats?.PinPointSPGamesPlayed) * 100}%</p>
              <p className="text-gray-400">Played: {profileStats?.PinPointSPGamesPlayed}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:bg-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold uppercase">Battle Royale Avg. Position</h3>
              <p className="text-4xl font-extrabold text-yellow-500">0</p>
              <p className="text-gray-400">Games Played: 0</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:bg-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold uppercase">All-Time High Rating</h3>
              <p className="text-4xl font-extrabold text-yellow-500">-</p>
              <p className="text-gray-400">Moving / No Move</p>
            </div>
          </div>

          {/* Trophy Case Section */}
          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold mb-4 uppercase">Trophy Case</h3>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-400 border-2 border-yellow-500 animate-pulse">
              <p className="text-gray-300 italic">No trophies selected for display</p>
            </div>
          </div>
        </div>
      </section>



    </>



  );
};

export default Profile;
