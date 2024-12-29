
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDuelTopPlayers } from "@/services/stats/stats.service";
import { joinGame } from "@/services/game/game.service";
import { useAuthContext } from "@/contexts/authContext";
import { useGameContext } from "@/contexts/gameContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";

export default function Chat() {
	const { user } = useAuthContext();
	const { game, setGame } = useGameContext();
	const router = useRouter();
	const [isWaiting, setIsWaiting] = useState(false);

	const {
		data: duelTopPlayersData = [],
		status: duelTopPlayersStatus,
		error: duelTopPlayersError,
	} = useQuery({
		queryKey: ["duelTopPlayers"],
		queryFn: getDuelTopPlayers,
		staleTime: 1000 * 60 * 5,
		retry: 3,
	});

	const joinGameMutation = useMutation({
		mutationFn: async () => {
			if (!user) {
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
		joinGameMutation.mutate();
	};

	return (
		<div id="animatedBackground">
			<Navigation />
			<div className="flex flex-col items-center text-white min-h-screen px-6 py-16">
				<div className="flex flex-col-reverse md:flex-row justify-between items-center gap-16 w-full max-w-6xl">
					<div className="flex flex-col items-center md:items-start text-center md:text-left gap-8">
						<h1 className="text-5xl lg:text-6xl font-extrabold text-yellow-400 uppercase tracking-tighter">
							Chat Game
						</h1>
						<p className="text-lg lg:text-2xl max-w-lg text-gray-300 leading-loose">
							Engage in a fun, interactive chat game! Choose a topic, test your skills, and challenge others. Ready to play?
						</p>
						<Button
							onClick={handleJoinGame}
							disabled={joinGameMutation.status === "pending"}
							className="px-6 py-3 lg:px-8 lg:py-4 text-lg font-bold bg-gradient-to-r from-purple-900 to-violet-950  text-black rounded-md hover:scale-105 transform transition-transform shadow-md"
						>
							Play Now
						</Button>
						{joinGameMutation.status === "error" && (
							<p className="text-red-500 text-center">
								Error: {joinGameMutation.error.message}
							</p>
						)}
					</div>

					<div className="flex justify-center">
						<Image
							src="/chatgame-preview.webp"
							alt="Chat Game Preview"
							width={450}
							height={350}
							className="rounded-lg shadow-lg"
						/>
					</div>
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
				</div>

				<div className="mt-12 w-full max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-yellow-400 uppercase mb-8">
						Challenge Topics
					</h2>
					<div className="flex justify-center gap-8">
						<div className="w-1/3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white rounded-lg p-6 shadow-lg hover:scale-105 transform transition-transform">
							<h3 className="text-2xl font-semibold">Trivia</h3>
							<p className="mt-4">Test your knowledge in various categories. Answer trivia questions and compete with others!</p>
							<Button className="mt-6 text-sm bg-yellow-400 text-black px-4 py-2 rounded-md">Start Trivia</Button>
						</div>

						<div className="w-1/3 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg hover:scale-105 transform transition-transform">
							<h3 className="text-2xl font-semibold">Guess the Word</h3>
							<p className="mt-4">Can you guess the word based on the clues? Challenge yourself and others!</p>
							<Button className="mt-6 text-sm bg-yellow-400 text-black px-4 py-2 rounded-md">Start Guessing</Button>
						</div>

						<div className="w-1/3 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg hover:scale-105 transform transition-transform">
							<h3 className="text-2xl font-semibold">Riddles</h3>
							<p className="mt-4">Solve brain-teasing riddles and see how fast you can crack them!</p>
							<Button className="mt-6 text-sm bg-yellow-400 text-black px-4 py-2 rounded-md">Start Riddles</Button>
						</div>
					</div>
				</div>

				<div className="mt-12 w-full max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-yellow-400 uppercase mb-8">
						Top Players
					</h2>
					{duelTopPlayersStatus === "pending" ? (
						<p className="text-center text-gray-300">Loading podium...</p>
					) : duelTopPlayersStatus === "error" ? (
						<p className="text-center text-red-500">
							Error loading data: {duelTopPlayersError.message}
						</p>
					) : (
						<div className="flex justify-center items-end gap-12 relative">
							{duelTopPlayersData.length >= 2 && (
								<div className="flex flex-col items-center">
									<div className="bg-gray-800 text-violet-900 rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold mb-2">
										2
									</div>
									<div className="bg-gray-700 w-28 h-44 rounded-b-lg relative">
										<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
											<p className="text-gray-300 text-lg font-semibold">
												{duelTopPlayersData[1]?.username || "Player 2"}
											</p>
											<p className="text-sm text-yellow-500">
												Wins: {duelTopPlayersData[1]?.duelwins || 0}
											</p>
										</div>
									</div>
								</div>
							)}

							{duelTopPlayersData.length >= 1 && (
								<div className="flex flex-col items-center">
									<div className="bg-violet-900 text-black rounded-full w-28 h-28 flex items-center justify-center text-3xl font-bold mb-2">
										1
									</div>
									<div className="bg-gray-700 w-36 h-56 rounded-b-lg relative">
										<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
											<p className="text-gray-300 text-lg font-semibold">
												{duelTopPlayersData[0]?.username || "Player 1"}
											</p>
											<p className="text-sm text-yellow-500">
												Wins: {duelTopPlayersData[0]?.duelwins || 0}
											</p>
										</div>
									</div>
								</div>
							)}

							{duelTopPlayersData.length >= 3 && (
								<div className="flex flex-col items-center">
									<div className="bg-gray-800 text-violet-900 rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold mb-2">
										3
									</div>
									<div className="bg-gray-700 w-24 h-36 rounded-b-lg relative">
										<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
											<p className="text-gray-300 text-lg font-semibold">
												{duelTopPlayersData[2]?.username || "Player 3"}
											</p>
											<p className="text-sm text-yellow-500">
												Wins: {duelTopPlayersData[2]?.duelwins || 0}
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				<footer className="mt-16 py-4 text-center text-xs md:text-sm text-gray-500">
					<p>
						Created by <span className="text-violet-900">REALorNOT Studios</span>. Challenge your perception!
					</p>
				</footer>
			</div>
		</div>
	);
}
