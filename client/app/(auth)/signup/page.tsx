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
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useAuthContext } from "@/contexts/authContext";
import { signup } from "@/services/auth/auth.service";
//import { AnimatedCircleIcon, ChromeIcon, GithubIcon } from "@/utils/svgIcons";

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
};
const SignUp = () => {
  const router = useRouter();
  const { setUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const { username, email, password } = data;
      const response = await signup(username, email, password, setUser);
      return response;
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    mutate(data);
  };

  return (
    <div className="grid h-screen w-full grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col items-center justify-center bg-zinc-800 p-8">
        <Card className="gradborder w-full max-w-md bg-zinc-900 shadow-lg">
          <CardHeader className="space-y-1 text-neutral-200">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Start exploring our Formula 1 world today!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-6">
                <Button variant="outline">
                  {/*                    <GithubIcon className="mr-2 h-4 w-4" /> */}
                  Github
                </Button>
                <Button variant="outline">
                  {/*           <ChromeIcon className="mr-2 h-4 w-4" /> */}
                  Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-neutral-200">
                    Or continue with email
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  className="border border-gray-950 p-2"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
                  <span className="text-red-600">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="border border-gray-950 p-2"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-600">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="mysecretpass"
                  className="border border-gray-950 p-2"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </CardContent>
            {isError && (
              <div className="mb-4 flex justify-center px-8 font-bold text-red-600">
                <p>{error.message}</p>
              </div>
            )}
            <CardFooter>
              <Button
                type="submit"
                className="w-full border border-black bg-zinc-950 text-white hover:bg-zinc-700"
                disabled={isPending}
              >
                {isPending ? (
                  <AnimatedCircleIcon className="h-9 w-9" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </CardFooter>
          </form>
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground text-neutral-200">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium underline"
                prefetch={false}
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
      <div className="flex flex-col items-center justify-center bg-zinc-950 p-8">
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-bold text-zinc-200">Formula Fan</h1>
          <p className="text-lg text-gray-300">
            Enjoy the world of Formula 1 from another angle
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => router.replace("/posts")}
              variant="outline"
              className="text-primary-foreground hover:bg-neutral-400"
            >
              Continue as Guest
            </Button>

            <Link
              className="flex items-center rounded-md bg-zinc-800 p-2 text-sm font-medium text-gray-200 hover:bg-neutral-600"
              href="/signin"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
