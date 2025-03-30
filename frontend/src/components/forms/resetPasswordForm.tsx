"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useCheckTokenValidityQuery,
  useResetPasswordMutation,
} from "@/api/authApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, ref } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BtnLoader } from "@/components/shared/btnLoader";
import useToastify from "@/hooks/useToastify";
import { LinkTo } from "@/utils/links";

const schema = object({
  newPassword: string().required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm your password"),
});

interface Inputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { toastInfo, toastError } = useToastify();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { isLoading: tokenValidityLoading, isError } =
    useCheckTokenValidityQuery(token, { skip: !token });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  //  Обработка ошибки валидности токена через useEffect
  useEffect(() => {
    if (!token) {
      toastError("Token is missing.");
      router.push(LinkTo.login);
    }

    if (isError) {
      toastError("Your reset token is invalid or has expired.");
      router.push(LinkTo.login);
    }
  }, [isError, router, toastError, token]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    resetPassword({ token, newPassword: data.newPassword })
      .unwrap()
      .then(() => {
        toastInfo("Password reset successfully!");
        router.push(LinkTo.login);
      })
      .catch((err) => {
        toastError("Failed to reset password. Please try again.");
        console.error(err);
      });
  };

  if (tokenValidityLoading) {
    return <p>Checking token...</p>;
  }

  // Если произошла ошибка, компонент уже перенаправит пользователя (через useEffect), можно вернуть null
  if (isError) {
    return null;
  }

  return (
    <section className="flex h-dvh items-center justify-center">
      <div className="mt-10 w-full max-w-[480px]">
        <h1 className="text-[32px] font-bold text-white">Reset Password</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-4 flex flex-col gap-y-6"
        >
          <Input
            variant="third"
            label="New Password"
            placeholder="Enter your new password"
            type="password"
            error={errors.newPassword}
            {...register("newPassword")}
            containerClassName="grid gap-1"
          />
          <Input
            variant="third"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            type="password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
            containerClassName="grid gap-1"
          />
          <Button
            type="submit"
            variant="default"
            isLoading={isLoading}
            disabled={isLoading}
            icon={<BtnLoader />}
            className="mt-4"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
