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

type JoinGameFormData = {
  userID: string; 
};

export default function Home() {

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormData>();


  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data: JoinGameFormData) => {
      const { email, password } = data;
      const response = await joinGame(userId);
      return response;
    },
    onSuccess: () => {
      router.replace("/game/session{...}"); // Placeholder URL corrected
    },
  });

  const onSubmit = (data: JoinGameFormData) => {
    console.log("here submiting")
    mutate(data);
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

					<form onSubmit={handleSubmit(onSubmit)}>
            <DialogTrigger >
              <Button type="submit" className="grad gradHover">Join a Game</Button>
            </DialogTrigger>
</form>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Waiting for players...</DialogTitle>
              </DialogHeader>
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
