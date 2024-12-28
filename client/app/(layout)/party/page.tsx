
"use client";

import Navigation from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function InviteFriendsPage() {
  return (
    <>
      <Navigation />


      <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white min-h-screen flex flex-col items-center p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <Image
              width={300}
              height={250}
              src="/_next/static/media/three-people.6a1934ec.png"
              alt="Invite friends"
              className="w-80 h-60 object-cover rounded-md mx-auto mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Invite your friends</h3>
            <p className="text-gray-400">
              Compete with your friends and family in the ultimate geography challenge.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <Image
              width={300}
              height={250}
              src="/_next/static/media/person-waving.47014116.png"
              alt="Play all modes"
              className="w-80 h-60 object-cover rounded-md mx-auto mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Play all game modes</h3>
            <p className="text-gray-400">
              Play together in your favourite game modes and experience endless hours of fun.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <Image
              width={300}
              height={250}
              src="/_next/static/media/map.5b549e44.png"
              alt="Set your rules"
              className="w-80 h-60 object-cover rounded-md mx-auto mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Set your own rules</h3>
            <p className="text-gray-400">
              Design your own game with thousands of maps and customizable settings.
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <div className="flex gap-8 justify-center mb-4">
            <Link href="/join">
              <Button variant="secondary" className="w-full sm:w-auto grad gradHover">
                Join another party
              </Button>
            </Link>
            <Link href="/pro">
              <Button className="w-full sm:w-auto grad gradHover">
                Unlock parties
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Any player can join a party as long as the host is pro. No other requirements are necessary, you do not even need an account.
          </p>
        </div>
      </main>

    </>
  );
}
