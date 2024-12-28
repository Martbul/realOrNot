"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/authContext";
import { login } from "@/services/auth/auth.service";

type SignInFormData = {
	email: string;
	password: string;
};

const Login = () => {
	const router = useRouter();
	const { setUser } = useAuthContext();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormData>();

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: async (data: SignInFormData) => {
			const { email, password } = data;
			const response = await login(email, password, setUser);
			return response;
		},
		onSuccess: () => {
			router.replace("/");
		},
	});

	const onSubmit = (data: SignInFormData) => {
		mutate(data);
	};

	return (
		<div className="relative grid h-screen w-full grid-cols-1 md:grid-cols-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
			<div className="flex flex-col items-center justify-center p-8">
				<div className="max-w-md space-y-4 text-center">
					<h1 className="text-5xl font-extrabold text-white">Formula Fan</h1>
					<p className="text-lg text-gray-400">
						Dive deeper into the world of Formula 1 with a fresh perspective.
					</p>
					<div className="flex gap-4 mt-6">
						<Button
							onClick={() => router.replace("/posts")}
							variant="outline"
							className="text-white border-white hover:bg-gray-700"
						>
							Continue as Guest
						</Button>
						<Link
							href="/signup"
							className="flex items-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
						>
							Sign Up Now
						</Link>
					</div>
				</div>
			</div>

			<div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-600 md:block"></div>

			<div className="flex flex-col items-center justify-center p-8">
				<Card className="w-full max-w-md bg-gray-800 text-white shadow-lg shadow-black/50">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-semibold">Login</CardTitle>
						<CardDescription className="text-gray-400">
							Start exploring our Formula 1 world now!
						</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<CardContent className="grid gap-6">
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="email" className="text-lg font-medium">
										Email Address
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="example@email.com"
										className="border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-red-500"
										{...register("email", {
											required: "Email is required",
											pattern: {
												value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
												message: "Invalid email address",
											},
										})}
									/>
									{errors.email && (
										<span className="text-red-500">{errors.email.message}</span>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password" className="text-lg font-medium">
										Password
									</Label>
									<Input
										id="password"
										type="password"
										placeholder="mysecretpass"
										className="border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-red-500"
										{...register("password", {
											required: "Password is required",
											minLength: {
												value: 6,
												message: "Password must be at least 6 characters long",
											},
										})}
									/>
									{errors.password && (
										<span className="text-red-500">{errors.password.message}</span>
									)}
								</div>
							</div>
						</CardContent>
						{isError && (
							<div className="mb-4 text-center text-red-500">
								<p>{error.message}</p>
							</div>
						)}
						<CardFooter>
							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:bg-red-400"
								disabled={isPending}
							>
								{isPending ? "Logging in..." : "Login"}
							</Button>
						</CardFooter>
					</form>
					<div className="mt-4 text-center">
						<p className="text-sm text-gray-400">
							Do not have an account?{" "}
							<Link href="/signup" className="font-medium underline text-white">
								Sign up
							</Link>
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default Login;
