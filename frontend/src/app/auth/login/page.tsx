"use client";
import { useLoginMutation } from "@/api/auth";
import { BtnLoader } from "@/components/shared/btnLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkTo } from "@/utils/links";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { object, string } from "yup";

const userSchema = object({
  email: string().email().required("email is required"),
  password: string().required("password is required"),
});

interface Inputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation({});
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(userSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    login({
      email: data.email,
      password: data.password,
    })
      .unwrap()
      .then(() => {
        reset();
        router.push(LinkTo.home);
      })
      .catch((error) => console.error(error));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google"; // Перенаправление на бэкенд
  };

  return (
    <section className="flex items-center justify-center">
      <div className="mt-[100px] w-full max-w-[480px]">
        <p className="mb-2 text-[32px] font-bold text-white">Sign In</p>
        <button
          onClick={handleGoogleLogin}
          className="focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-full items-center justify-center gap-x-2 whitespace-nowrap rounded-md border border-zinc-800 bg-none px-4 py-6 text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          type="submit"
        >
          <Image width={24} height={24} src="/google.svg" alt="google" />
          <span>Google</span>
        </button>
        <div className="mt-5 grow border-t border-zinc-800"></div>
        <div className="grow border-t border-zinc-800"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4">
          <div className="grid gap-2 gap-y-5">
            <Input
              variant="third"
              label="Email"
              placeholder="Enter your Email"
              error={errors.email?.message}
              {...register("email")}
              type="email"
              containerClassName="grid gap-1"
            />
            <Input
              variant="third"
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
              type="password"
              containerClassName="grid gap-1"
            />
            <Button
              className="mt-4"
              variant="secondary"
              isLoading={isLoading}
              type="submit"
              icon={<BtnLoader />}
            >
              Sign In
            </Button>
          </div>
        </form>
        <p>
          <a
            href="/dashboard/signin/forgot_password"
            className="text-sm font-medium text-white"
          >
            Forgot your password?
          </a>
        </p>
        <p>
          <Link href={LinkTo.signUp} className="text-sm font-medium text-white">
            Don't have an account? Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
