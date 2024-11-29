
"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuthContext } from "@/contexts/authContext";

const Navigation = () => {
	const { user } = useAuthContext();
	console.log(user.id)

	return (
		<header className="flex justify-between items-center p-4 bg-gray-800 text-white">
			<h1 className="text-xl font-bold">Game App</h1>
			<div className="flex gap-4">
				{user.id == undefined || user?.id === "-1" ? (
					<>
						<Link href="/login">
							<Button className="grad gradHover">Login</Button>
						</Link>
						<Link href="/signup">
							<Button className="grad gradHover">Sign Up</Button>
						</Link>
					</>
				) : (
					<Button className="grad gradHover" onClick={() => console.log("Logout clicked")}>
						Logout
					</Button>
				)}
			</div>
		</header>
	);
};

export default Navigation;
