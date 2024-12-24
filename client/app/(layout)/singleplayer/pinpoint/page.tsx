"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import Link from "next/link";

export default function PinPointSP() {
	return (
		<div>
			<Navigation />
			<div className="flex flex-col items-center bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white min-h-screen px-6 py-36">
				<div className="flex flex-row justify-center items-start gap-16 w-full max-w-7xl">
					<div className="flex flex-col items-center text-center gap-6">
						<h1 className="text-5xl font-extrabold text-yellow-400 uppercase tracking-widest">
							PinPoint Singleplayer
						</h1>
						<p className="text-lg max-w-md text-gray-300 leading-relaxed">
							Welcome to <span className="text-green-400 font-bold">PinPoint</span>, the ultimate skill-based challenge!
							Outsmart opponents, climb the leaderboard, and prove you're the best.
							Will you claim the top spot?
						</p>
						<div className="bg-gradient-to-br from-purple-700 to-blue-700 p-6 rounded-2xl shadow-lg">
							<Image
								src="/game-preview.png"
								alt="Game Preview"
								width={300}
								height={200}
								className="rounded-lg"
							/>
						</div>
						<Link href="/gamePinPointSP">
							<Button
								variant="primary"
								className="px-10 py-4 text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black rounded-lg hover:scale-105 transform transition-all shadow-lg"
							>
								Play Now
							</Button>
						</Link>
					</div>

					<div className="w-full max-w-3xl">
						<h2 className="text-4xl font-extrabold text-center text-yellow-400 uppercase mb-6">
							Leaderboard
						</h2>
						<div className="bg-gray-800 rounded-2xl shadow-lg p-6">
							<table className="w-full text-center text-gray-300">
								<thead>
									<tr className="text-gray-400 text-lg border-b border-gray-700">
										<th className="py-4">Rank</th>
										<th>Player</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody>
									<tr className="border-b border-gray-700 text-lg">
										<td className="py-4 text-yellow-500 font-bold">1</td>
										<td className="py-4">ProGamer</td>
										<td className="py-4">4520</td>
									</tr>
									<tr className="border-b border-gray-700 text-lg">
										<td className="py-4 text-yellow-500 font-bold">2</td>
										<td className="py-4">SwiftPlayer</td>
										<td className="py-4">4200</td>
									</tr>
									<tr className="text-lg">
										<td className="py-4 text-yellow-500 font-bold">3</td>
										<td className="py-4">Victory123</td>
										<td className="py-4">3900</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<footer className="mt-16 py-6 text-center text-sm text-gray-500">
					<p>
						Powered by <span className="text-green-400">StreakNation</span>. All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}




