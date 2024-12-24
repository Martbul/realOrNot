
'use client';

import { getPinPointGameData } from '@/services/game/game.service';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

const ImageClickGame = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [aiRegion, setAiRegion] = useState<any>(null);
  const [clickCoords, setClickCoords] = useState<any>(null);
  const [score, setScore] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const {
    data: pinPointData,
    isLoading: isPinPointSPDataLoading,
    isError: isPinPointSPDataError,
    error: pinPointSPDataError,
  } = useQuery({
    queryKey: ['pinPointSPGameData'],
    queryFn: getPinPointGameData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  useEffect(() => {
    if (!pinPointData || pinPointData.length === 0) return;
    console.log(pinPointData)

    const image = pinPointData.gameData[0].ImgURL;
    const aiRegion = {
      x: pinPointData.gameData[0].X,
      y: pinPointData.gameData[0].Y,
      width: pinPointData.gameData[0].Width,
      height: pinPointData.gameData[0].Height, // Fixed typo
    };

    setImageUrl(image);
    setAiRegion(aiRegion);
  }, [pinPointData]);

  const checkProximity = (clickX: number, clickY: number) => {
    if (
      clickX >= aiRegion.x &&
      clickX <= aiRegion.x + aiRegion.width &&
      clickY >= aiRegion.y &&
      clickY <= aiRegion.y + aiRegion.height
    ) {
      return 100;
    }
    return 0;
  };

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

  if (isPinPointSPDataLoading) return <div>Loading...</div>;
  if (isPinPointSPDataError) return <div>Error: {pinPointSPDataError.message}</div>;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Click on the AI-Generated Parts!</h1>

      <div className="relative" ref={imageRef} onClick={handleImageClick}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Game"
            width={500}
            height={500}
            className="rounded-lg shadow-md border-2 border-gray-300"
          />
        )}


        {clickCoords && (
          <div
            className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ top: clickCoords.y, left: clickCoords.x }}
          />
        )}
      </div>

      <div className="mt-6 text-xl text-gray-700">
        <p>
          <span className="font-semibold">Score:</span> {score}
        </p>
      </div>
    </div>
  );
};

export default ImageClickGame;
