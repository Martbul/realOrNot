"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { joinGame } from "@/services/game/game.service";
import { getLeaderboard } from "@/services/stats/stats.service";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import { useGameContext } from "@/contexts/gameContext";
import Navigation from "@/components/navigation/Navigation";

const images = [
  "https://imgs.search.brave.com/uYNBdHBfyt8SLNwJ_DZrPbmZFZbjVdSYzeQuptnC9bQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/aW5lbWUtYWkuYi1j/ZG4ubmV0L3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEyL2Iz/NDMxYTg3MzY0YzQy/YjNiLmpwZw",
  "https://imgs.search.brave.com/r8ryDuO4qZFvNYn13pWdcHwazEbSkv5dZXPYxrKQXx8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cGljbHVtZW4uY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzEwL3BpY2x1bWVu/LW1hcnF1ZWUtMDMu/d2VicA",
  "https://news.ubc.ca/wp-content/uploads/2023/08/AdobeStock_559145847.jpeg"
];


export default function Home() {
  const { user } = useAuthContext();
  const { game, setGame } = useGameContext();
  const router = useRouter();
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  console.log("User from context in Home:", user); // Debugging line
  useEffect(() => {
    console.log("User in Home after context update:", user);
  }, [user]);


  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
    error: leaderboardError,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });


  const {
    mutate: joinGameMutation,
    isLoading: isJoinGameLoading,
    isError: isJoinGameError,
    error: joinGameError,
  } = useMutation({
    mutationFn: async () => {
      console.log(user)
      if (!user) {
        //TODO: Push route to login
        throw new Error("User is not authenticated.");
      }
      return await joinGame(user.id, game, setGame);
    },
    onSuccess: (sessionID) => {
      setIsWaiting(false);
      router.replace(`/game/${sessionID}`);
    },
  });

  const handleJoinGame = () => {
    setIsWaiting(true);
    joinGameMutation();
  };

  useEffect(() => {
    setIsClient(true);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <section className="flex flex-col bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white ">
      <Navigation />

      <main className="flex-grow flex flex-col items-center justify-around p-4 gap-10">
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-bold">Welcome to the REALorNOT Game!</h1>
            <p className="text-lg text-gray-400">
              Explore the world, test your knowledge, and compete with friends!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
            <Card className="w-80 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Play Duel</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button
                  className="w-full grad gradHover"
                  onClick={handleJoinGame}
                  disabled={isJoinGameLoading}
                >
                  {isJoinGameLoading ? "Joining..." : "Join Now"}
                </Button>
                {isJoinGameError && (
                  <p className="text-red-500 text-center">
                    Error: {joinGameError.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="w-80 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Learn How to Play</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <p className="text-center text-gray-400">
                  New to the game? Learn how to play and become a pro!
                </p>
                <Link href="/howToPlay">
                  <Button className="w-full grad gradHover">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg mt-10">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((src, index) => (
                <div key={index} className="min-w-full flex-shrink-0">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-full h-96 object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-4 h-4 rounded-full border-2 ${index === currentIndex
                    ? "bg-white border-white"
                    : "bg-gray-400 border-transparent hover:bg-white hover:border-gray-300"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>



        </div>

        <section className="w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Duels Leaderboard</h1>
            <p className="text-lg text-gray-400 mt-2">
              Who is the best dueler!
            </p>
          </div>

          {isLeaderboardLoading ? (
            <p className="text-center text-gray-400">Loading leaderboard...</p>
          ) : isLeaderboardError ? (
            <p className="text-center text-red-500">
              Error loading leaderboard: {leaderboardError.message}
            </p>
          ) : (
            <>
              {leaderboardData && leaderboardData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {leaderboardData && leaderboardData.slice(0, 3).map((player: any, index: number) => (
                    <div
                      key={player.id}
                      className="bg-gradient-to-b from-yellow-500 to-yellow-300 p-6 rounded-lg shadow-md text-center text-black"
                    >
                      <h2 className="text-3xl font-bold">
                        #{index + 1} {player.username}
                      </h2>
                      <p className="text-xl font-medium mt-2">{player.duelwins} Wins</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No leaderboard data available.</p>
              )}
              <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="text-2xl font-bold mb-4">Other Players</h3>
                <ul className="divide-y divide-gray-700">
                  {leaderboardData && leaderboardData.slice(3).map((player: any) => (
                    <li
                      key={player.id}
                      className="py-2 flex justify-between items-center"
                    >
                      <span className="text-lg">{player.username}</span>
                      <span className="text-sm text-gray-400">{player.duelwins} Wins</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </section>
      </main>

      <Dialog open={isWaiting} onOpenChange={setIsWaiting}>
        <DialogContent className="text-center bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Waiting...</DialogTitle>
            <DialogDescription>
              Please wait while we find a game session for you!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
