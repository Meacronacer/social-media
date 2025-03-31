"use client";
import { useLoginMutation } from "@/api/authApi";
import { BtnLoader } from "@/components/shared/btnLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useToastify from "@/hooks/useToastify";
import { LinkTo } from "@/utils/links";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { object, string } from "yup";

const userSchema = object({
  email: string().email().required("email is required"),
  password: string().required("password is required"),
});

interface Inputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation({});
  const router = useRouter();
  const { toastError } = useToastify();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(userSchema),
    mode: "onBlur",
  });
  //

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
      .catch((error) => {
        toastError(error.data.message);
        reset({ password: "" });
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`; // Перенаправление на бэкенд
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
              error={errors.email}
              {...register("email")}
              type="email"
              containerClassName="grid gap-1"
            />
            <Input
              variant="third"
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              {...register("password")}
              type="password"
              containerClassName="grid gap-1"
            />
            <Button
              className="mt-4"
              variant="default"
              isLoading={isLoading}
              type="submit"
              icon={<BtnLoader />}
            >
              Sign In
            </Button>
          </div>
        </form>
        <p>
          <Link
            href={LinkTo.forgotPassword}
            className="text-sm font-medium text-white hover:text-white/50"
          >
            Forgot your password?
          </Link>
        </p>
        <p className="mt-2">
          <Link
            href={LinkTo.signUp}
            className="text-sm font-medium text-white hover:text-white/50"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginForm;
