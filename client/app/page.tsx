"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form"; // Add import for useForm
import { useMutation } from "@tanstack/react-query"; // Add import for useMutation
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { joinGame } from "@/services/game/game.service";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
type JoinGameFormData = {
  userID: string; 
};


export default function Home() {
  const { user } = useAuthContext(); // Getting user from the context
  const router = useRouter();

  // Mutation for joining a game
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated.");
      }
      return await joinGame( user);
    },
    onSuccess: () => {
      router.replace("/game/session"); // Redirect to game session on success
    },
  });

  // Submit handler
  const handleJoinGame = () => {
    mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Game App</h1>
        <div className="flex gap-4">
          <Link href="/login">
            <Button className="grad gradHover">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="grad gradHover">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 gap-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="grad gradHover"
                onClick={handleJoinGame}
                disabled={isPending} // Disable button if the mutation is pending
              >
                {isPending ? "Joining..." : "Join a Game"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Waiting for players...</DialogTitle>
              </DialogHeader>
              {isError && (
                <p className="text-red-500 mt-2">Error: {error.message}</p>
              )}
            </DialogContent>
          </Dialog>
          <Button className="grad gradHover w-full sm:w-auto">Start a Game</Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-gray-900 text-white text-center">
        <p>
          Built with ❤️ using Next.js. Check out{" "}
          <a
            className="underline"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Docs
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
