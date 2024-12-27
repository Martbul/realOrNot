"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { playStreakGame } from "@/services/game/game.service";
import { useStreakGameContext } from "@/contexts/streakGameContext";
import { getStreakTopPlayers } from "@/services/stats/stats.service";

export default function Streak() {

	const { user } = useAuthContext();
	const { streakGame, setStreakGame } = useStreakGameContext();
	const router = useRouter();


	const {
		data: streakTopPlayersData = [], // Default to an empty array
		isLoading: isStreakTopPlayersLoading,
		isError: isStreakTopPlayersError,
		error: streakTopPlayersError,
	} = useQuery({
		queryKey: ["streakTopPlayers"],
		queryFn: getStreakTopPlayers,
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
			if (!user) {
				throw new Error("User is not authenticated.");
			}
			return await playStreakGame(user.id, streakGame, setStreakGame);
		},
		onSuccess: (sessionID) => {
			router.replace(`/streakGame/${sessionID}`);
		},
	});

	const handleJoinGame = () => {
		joinGameMutation();
	};


	return (
		<div id="animatedBackground">
			<Navigation />

			<div className="flex flex-col items-center text-white min-h-screen p-6">
				<div className="flex flex-col items-center text-center gap-6 pt-10">
					<h1 className="text-5xl font-extrabold text-yellow-400 uppercase tracking-widest">
						Streak
					</h1>
					<p className="text-lg max-w-xl text-gray-300 leading-relaxed">
						Welcome to <span className="text-violet-900 font-bold">Streak</span>, the ultimate skill-based challenge!
						Outsmart opponents, climb the leaderboard, and prove you're the best.
						Will you claim the top spot?
					</p>
				</div>

				<div className="flex flex-col items-center gap-8 mt-10">
					<div className="bg-gradient-to-br from-purple-700 to-blue-700 p-6 rounded-2xl shadow-lg">
						<Image
							src="/game-preview.png"
							alt="Game Preview"
							width={300}
							height={200}
							className="rounded-lg"
						/>
					</div>
					<Button
						variant="primary"
						className="px-10 py-4 text-xl font-bold bg-gradient-to-r from-purple-900 to-violet-950 text-black rounded-lg hover:scale-105 transform transition-all shadow-lg"
						onClick={() => handleJoinGame()}
					>
						Play Now
					</Button>
				</div>





				<div className="w-full max-w-5xl mt-16">
					<h2 className="text-4xl font-extrabold text-center text-yellow-400 uppercase mb-6">
						Leaderboard
					</h2>
					<div className="bg-gray-800 rounded-2xl shadow-lg p-6">
						<table className="w-full text-center text-gray-300">
							<thead>
								<tr className="text-gray-400 text-lg border-b border-gray-700">
									<th className="py-4">Rank</th>
									<th>Player</th>
									<th>Highest Score</th>
								</tr>
							</thead>
							<tbody>
								{isStreakTopPlayersLoading ? (
									<tr>
										<td colSpan="3" className="py-4 text-center">Loading...</td>
									</tr>
								) : isStreakTopPlayersError ? (
									<tr>
										<td colSpan="3" className="py-4 text-center text-red-500">
											Error: {streakTopPlayersError?.message}
										</td>
									</tr>
								) : (
									streakTopPlayersData.map((player, index) => (
										<tr key={player.id} className="border-b border-gray-700 text-lg">
											<td className="py-4 text-yellow-500 font-bold">{index + 1}</td>
											<td className="py-4">{player.username}</td>
											<td className="py-4">{player.streakhighestscore}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>


				<footer className="mt-auto py-6 text-center text-sm text-gray-500">
					<p>
						Powered by <span className="text-violet-900">REALorNOT</span>. All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}


