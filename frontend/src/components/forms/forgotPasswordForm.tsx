"use client";
import { useForgotPasswordMutation } from "@/api/authApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BtnLoader } from "@/components/shared/btnLoader";
import Link from "next/link";
import useToastify from "@/hooks/useToastify";
import { LinkTo } from "@/utils/links";
import { useRouter } from "next/navigation";

const schema = object({
  email: string().email("Invalid email").required("Email is required"),
});

interface Inputs {
  email: string;
}

const ForgotPasswordForm = () => {
  const [requestPasswordReset, { isLoading }] = useForgotPasswordMutation();

  const router = useRouter();
  const { toastInfo, toastError } = useToastify();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    requestPasswordReset(data.email)
      .unwrap()
      .then((message) => {
        toastInfo(message);
        router.push(LinkTo.login);
      })
      .catch((err) => toastError(err?.data?.message));
  };

  return (
    <section className="flex h-dvh items-center justify-center">
      <div className="relative mt-10 w-full max-w-[480px]">
        <Link
          href={LinkTo.login}
          className="absolute -top-5 text-sm font-medium text-white hover:text-white/50"
        >
          Back
        </Link>
        <h1 className="text-center text-[32px] font-bold text-white">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4">
          <Input
            variant="third"
            label="Email"
            placeholder="Enter your email"
            type="email"
            error={errors.email}
            {...register("email")}
            containerClassName="grid gap-1"
          />
          <Button
            type="submit"
            variant="default"
            isLoading={isLoading}
            disabled={!!errors.email || isLoading}
            icon={<BtnLoader />}
            className="mx-auto mt-4"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
