'use client';

import { useAuthContext } from '@/contexts/authContext';
import { evaluatePinPointSPGameResults, getPinPointGameData } from '@/services/game/game.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import ReactConfetti from 'react-confetti';

import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';

const ImageClickGame = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [aiRegion, setAiRegion] = useState<any>(null);
  const [clickCoords, setClickCoords] = useState<any>(null);
  const [score, setScore] = useState<boolean[]>([]);
  const [currRound, setCurrRound] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();

  const router = useRouter();
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

  const {
    mutate: resultEvaluationMutation,
    data: resultsData,
    isLoading: areResultsEvaluatingLoading,
    isError: evaluatingResultsError,
    error: resultsError,
  } = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated.");
      }
      return await evaluatePinPointSPGameResults(user.id, score);
    },
  });

  useEffect(() => {
    if (pinPointData?.gameData?.length > currRound) {
      const { ImgURL, X, Y, Width, Height } = pinPointData.gameData[currRound];
      setImageUrl(ImgURL);
      setAiRegion({ x: X, y: Y, width: Width, height: Height });
    } else if (pinPointData?.gameData?.length === currRound) {
      resultEvaluationMutation();
    }
  }, [pinPointData, currRound, resultEvaluationMutation]);

  const checkProximity = (clickX: number, clickY: number) => {
    return (
      clickX >= aiRegion.x &&
      clickX <= aiRegion.x + aiRegion.width &&
      clickY >= aiRegion.y &&
      clickY <= aiRegion.y + aiRegion.height
    );
  };

  const handlePlayAgain = () => {
    router.replace("/gamePinPointSP")
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !aiRegion) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickCoords({ x, y });

    const isGuessedRight = checkProximity(x, y);
    setScore((prevScore) => [...prevScore, isGuessedRight]);

    setCurrRound((prevRound) => prevRound + 1);
  };

  useEffect(() => {
    if (resultsData) {
      setTimeout(() => {
        router.push("/singleplayer/pinpoint");
      }, 5000);
    }
  }, [resultsData, router]);


  if (isPinPointSPDataLoading) return <div>Loading...</div>;
  if (isPinPointSPDataError) return <div>Error: {pinPointSPDataError.message}</div>;

  return (
    <>
      <div>
        {areResultsEvaluatingLoading && <p>Loading results...</p>}
        {evaluatingResultsError && (
          <p className="text-red-500">
            Error evaluating results: {resultsError.message}
          </p>
        )}

        {resultsData && <ReactConfetti width={window.innerWidth} height={window.innerHeight} />}
        {resultsData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <h2 className="text-4xl font-bold text-white mb-4">🎉 Congratulations! You scored: {resultsData.result} 🎉</h2>
            <p className="text-lg text-gray-300 mt-2">
              Redirecting to the home page in 10 seconds
            </p>

            <Button onClick={handlePlayAgain}>Play Again</Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Click on the AI-Generated Parts!</h1>

        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xl px-4 py-2 rounded-lg shadow-lg">
          Round: {currRound + 1}
        </div>

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



          {/* 
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


        */}

          {clickCoords && (
            <div
              className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ top: clickCoords.y, left: clickCoords.x }}
            />
          )}
        </div>

      </div>
    </>
  );
};

export default ImageClickGame;
