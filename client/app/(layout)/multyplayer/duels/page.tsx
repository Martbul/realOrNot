
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Navigation from "@/components/navigation/Navigation";

export default function Duels() {
	const [progress, setProgress] = useState(0);

	return (
		<div>

			<Navigation />


			<div className="flex flex-col items-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white min-h-screen p-6">
				<div className="flex-grow flex flex-col items-center justify-center gap-10">
					<div className="text-center space-y-6">
						<h1 className="text-3xl font-bold italic uppercase">
							Welcome to Duels, <span className="text-blue-400">martBul</span>!
						</h1>
						<h2 className="text-5xl font-bold uppercase text-blue-400">
							Play <span className="text-yellow-400">{3 - progress}</span> games to unlock
						</h2>
						<h2 className="text-5xl font-bold italic uppercase text-yellow-400">
							Your Division!
						</h2>
					</div>

					<div className="relative">
						<div className="w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center shadow-md">
							<Image
								src="/avatar-placeholder.png"
								alt="Avatar"
								width={128}
								height={128}
								className="rounded-full"
							/>
						</div>
					</div>

					<div className="w-full max-w-md">
						<div className="relative w-full bg-gray-700 h-12 rounded-full overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
								style={{ width: `${(progress / 3) * 100}%` }}
							></div>
							<span className="absolute inset-0 flex items-center justify-center text-sm">
								{progress}/3
							</span>
						</div>
						<p className="text-center text-sm mt-2">
							Play your {progress === 0 ? "1st" : progress === 1 ? "2nd" : "3rd"} game!
						</p>
					</div>

					<div className="text-center space-y-4">
						<Button
							variant="primary"
							className="w-full max-w-xs grad gradHover"
							onClick={() => setProgress((prev) => Math.min(prev + 1, 3))}
						>
							Play Now
						</Button>
						{progress === 3 && (
							<div className="bg-gradient-to-b from-teal-500 to-teal-700 text-black p-4 rounded-md shadow-md">
								<p className="font-bold text-lg">
									Congratulations! Division unlocked.
								</p>
							</div>
						)}
					</div>
				</div>

				<footer className="mt-auto py-4 text-center text-sm text-gray-500">
					Powered by REALorNOT. All rights reserved.
				</footer>
			</div>
		</div>

	);
}
