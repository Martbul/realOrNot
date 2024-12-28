
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPinPointSPTopPlayers } from "@/services/stats/stats.service";

interface Player {
	id: string;
	username: string;
	streakwins: number;
}

export default function PinPointSP() {

	const {
		data: pinPoinSPTopPlayersData = [],
		isLoading: isPinPointSPTopPlayersLoading,
		isError: isPinPointSPTopPlayersError,
		error: pinPointSPTopPlayersError,
	} = useQuery<Player[]>({
		queryKey: ["pinPointSPTopPlayers"],
		queryFn: getPinPointSPTopPlayers,
		staleTime: 1000 * 60 * 5,
		retry: 3,
	});

	return (
		<div id="animatedBackground">
			<Navigation />
			<div className="flex flex-col items-center bg-fluid-background text-white min-h-screen px-4 md:px-8 lg:px-16 py-20">
				<div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-16 w-full max-w-7xl">
					<div className="flex flex-col items-center text-center md:items-start md:text-left gap-6">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-yellow-400 uppercase tracking-widest">
							PinPoint Singleplayer
						</h1>
						<p className="text-base md:text-lg lg:text-xl max-w-md text-gray-300 leading-relaxed">
							Welcome to <span className="text-violet-900 font-bold">PinPoint</span>, spot the secret item that has been AI-generated and hidden into the picture!
						</p>
						<div className="rounded-2xl shadow-lg">
							<Image
								src="/adobe-firefly-generative-ai-in-photoshop-example-desert.jpg"
								alt="Game Preview"
								width={500}
								height={400}
								className="rounded-lg"
							/>
						</div>
						<Link href="/gamePinPointSP">
							<Button
								className="px-8 md:px-10 py-3 md:py-4 text-lg md:text-xl font-bold bg-gradient-to-r from-purple-900 to-violet-950 text-black rounded-lg hover:scale-105 transform transition-all shadow-lg"
							>
								Play Now
							</Button>
						</Link>
					</div>

					<div className="flex flex-col items-center w-full max-w-xl md:max-w-3xl mx-auto">
						<h2 className="text-3xl md:text-4xl font-extrabold text-center md:text-left text-yellow-400 uppercase mb-4 md:mb-6">
							Leaderboard
						</h2>
						<div className="bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 w-full">
							<table className="w-full text-center text-gray-300">
								<thead>
									<tr className="text-gray-400 text-sm md:text-lg border-b border-gray-700">
										<th className="py-2 md:py-4">Rank</th>
										<th>Player</th>
										<th>Wins</th>
									</tr>
								</thead>
								<tbody>
									{isPinPointSPTopPlayersLoading ? (
										<tr>
											<td colSpan={3} className="py-4 text-center">Loading...</td>
										</tr>
									) : isPinPointSPTopPlayersError ? (
										<tr>
											<td colSpan={3} className="py-4 text-center text-red-500">
												Error: {pinPointSPTopPlayersError?.message}
											</td>
										</tr>
									) : (
										pinPoinSPTopPlayersData.map((player: Player, index: number) => (
											<tr key={player.id} className="border-b border-gray-700 text-sm md:text-lg">
												<td className="py-2 md:py-4 text-yellow-500 font-bold">{index + 1}</td>
												<td className="py-2 md:py-4">{player.username}</td>
												<td className="py-2 md:py-4">{player.streakwins}</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<footer className="mt-12 md:mt-16 py-4 text-center text-xs md:text-sm text-gray-500">
					<p>
						Powered by <span className="text-violet-900">realORnot</span>. All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}








