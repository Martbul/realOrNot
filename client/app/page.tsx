
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
          <Button className="grad gradHover w-full sm:w-auto">Join a Game</Button>
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

