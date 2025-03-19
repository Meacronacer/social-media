"use client";
import { useSignUpMutation } from "@/api/auth";
import { BtnLoader } from "@/components/shared/btnLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useToastify from "@/hooks/useToastify";
import { LinkTo } from "@/utils/links";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";
import { object, string, ref } from "yup";

const schema = object({
  first_name: string()
    .required("first name is required")
    .min(2, "min 2 characters"),
  second_name: string()
    .required("second name is required")
    .min(2, "min 2 characters"),
  email: string().email().required("email is required"),
  password: string().required("password is required"),
  passwordConfirm: string()
    .oneOf([ref("password"), undefined], "Passwords must match")
    .required("password is required"),
});

interface Inputs {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUpForm = () => {
  const [signUp, { isLoading }] = useSignUpMutation({});
  const { toastInfo } = useToastify();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signUp({
      first_name: data.first_name,
      second_name: data.second_name,
      email: data.email,
      password: data.password,
    })
      .unwrap()
      .then((data: { message: string }) => {
        toastInfo(data.message);
        reset();
        router.push(LinkTo.login);
      })
      .catch((error) => console.log(error));
  };

  return (
    <section className="flex items-center justify-center">
      <div className="mt-10 w-full max-w-[480px]">
        <p className="text-[32px] font-bold text-white">Sign Up</p>
        <div className="mt-2 grow border-t border-zinc-800"></div>
        <div className="grow border-t border-zinc-800"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4">
          <div className="grid gap-2 gap-y-5">
            <div className="flex justify-between gap-x-3">
              {/* first name */}
              <Input
                variant="third"
                label="First name"
                placeholder="first name"
                error={errors.first_name}
                {...register("first_name")}
                type="text"
                containerClassName="grid gap-1"
              />

              {/* second name */}
              <Input
                variant="third"
                label="Second name"
                placeholder="second name"
                error={errors.second_name}
                {...register("second_name")}
                type="text"
                containerClassName="grid gap-1"
              />
            </div>
            {/* email */}
            <Input
              variant="third"
              label="Email"
              placeholder="Enter your Email"
              error={errors.email}
              {...register("email")}
              type="email"
              containerClassName="grid gap-1"
            />

            {/* password */}
            <Input
              variant="third"
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              {...register("password")}
              type="password"
              containerClassName="grid gap-1"
            />

            {/* password confirm */}
            <Input
              variant="third"
              label="Password Confirm"
              placeholder="Confirm your password"
              error={errors.passwordConfirm}
              {...register("passwordConfirm")}
              type="password"
              containerClassName="grid gap-1"
            />
            <Button
              variant="secondary"
              isLoading={isLoading}
              icon={<BtnLoader />}
              type="submit"
            >
              Sign Up
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
          <Link href={LinkTo.login} className="text-sm font-medium text-white">
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUpForm;
