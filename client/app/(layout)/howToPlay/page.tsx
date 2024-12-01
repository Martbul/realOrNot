import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";

export default function HowToPlay() {
  return (
    <section className="flex flex-col bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
      <Navigation />

      <main className="flex-grow flex flex-col items-center justify-around p-4 gap-10">
        <div className="flex flex-col justify-center items-center min-h-screen gap-10">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl font-bold">How to Play REALorNOT</h1>
            <p className="text-lg text-gray-400 mt-4">
              Ready to dive in? Follow these steps to learn how to play the game
              and become a champion!
            </p>
          </div>

          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Step 1</h2>
              <p className="text-gray-400">
                Understand the goal: Spot the real items and avoid the fake ones
                to earn points.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Step 2</h2>
              <p className="text-gray-400">
                Compete with other players or challenge yourself in solo mode.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Step 3</h2>
              <p className="text-gray-400">
                Use your knowledge, strategy, and quick thinking to win!
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-900 rounded-lg shadow-md p-8 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="text-left text-gray-400 space-y-4">
              <div>
                <h3 className="font-semibold text-white">What is the goal?</h3>
                <p>Identify the real items from the fake ones before time runs out.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">How do I score points?</h3>
                <p>
                  Earn points by correctly identifying real items. Lose points
                  for choosing fake ones!
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">What are the game modes?</h3>
                <p>
                  You can play in multiplayer mode to compete with others or solo
                  mode to test your skills.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center gap-6">
            <Link href="/">
              <span className="text-blue-500 hover:underline text-lg">
                Return to Home
              </span>
            </Link>
            <Link href="/game">
              <button className="grad gradHover px-8 py-4 text-lg font-semibold rounded-md shadow-md">
                Start Playing
              </button>
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}

