
'use client'; // Ensure this is a client-side component

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

const ImageClickGame = () => {
	const [imageUrl, setImageUrl] = useState('');
	const [aiRegion, setAiRegion] = useState<any>(null);
	const [clickCoords, setClickCoords] = useState<any>(null);
	const [score, setScore] = useState(0);
	const imageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchedData = {
			imageUrl: '/mustang.png', // Image in the public folder (no ../../)
			aiRegion: {
				x: 150,  // X-coordinate of the top-left corner of the AI region
				y: 215,  // Y-coordinate of the top-left corner
				width: 95,  // Width of the AI region
				height: 70,  // Height of the AI region
			}
		};

		setImageUrl(fetchedData.imageUrl);
		setAiRegion(fetchedData.aiRegion);
	}, []);

	const checkProximity = (clickX: number, clickY: number) => {
		if (
			clickX >= aiRegion.x &&
			clickX <= aiRegion.x + aiRegion.width &&
			clickY >= aiRegion.y &&
			clickY <= aiRegion.y + aiRegion.height
		) {
			return 100; // Full score for hitting AI-generated part
		}
		return 0; // No match
	};

	// Handle click on image
	const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (imageRef.current) {
			const rect = imageRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			setClickCoords({ x, y });

			const points = checkProximity(x, y);
			setScore((prevScore) => prevScore + points);
		}
	};

	return (
		<div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">Click on the AI-Generated Parts!</h1>

			<div className="relative" ref={imageRef} onClick={handleImageClick}>
				{imageUrl && (
					<Image
						src={imageUrl}
						alt="Game"
						width={500} // Specify fixed width
						height={500} // Specify fixed height
						className="rounded-lg shadow-md border-2 border-gray-300"
					/>
				)}

				{aiRegion && (
					<div
						className="absolute bg-blue-500 bg-opacity-50 pointer-events-none"
						style={{
							top: aiRegion.y,
							left: aiRegion.x,
							width: aiRegion.width,
							height: aiRegion.height,
						}}
					/>
				)}

				{clickCoords && (
					<div
						className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
						style={{ top: clickCoords.y, left: clickCoords.x }}
					/>
				)}
			</div>

			{/* Display Score */}
			<div className="mt-6 text-xl text-gray-700">
				<p>
					<span className="font-semibold">Score:</span> {score}
				</p>
			</div>
		</div>
	);
};

export default ImageClickGame;
