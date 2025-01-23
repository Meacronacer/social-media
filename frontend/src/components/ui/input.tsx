import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";
import { InputHTMLAttributes } from "react";

const InputVariants = cva(
  `h-[21px] bg-black w-full text-[14px] font-medium focus:outline-none`,
  {
    variants: {
      variant: {
        default: "border-none",
        second: "border-b py-[20px] border-white",
        third:
          "mb-2 mr-2.5 h-full min-h-[44px] w-full rounded-lg border bg-zinc-950 px-4 py-3 text-white",
      },
      error: {
        true: "border-red-800",
        false: "border-zinc-800",
      },
    },
    defaultVariants: {
      variant: "default",
      error: false,
    },
  },
);

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof InputVariants>, "error"> {
  label?: string; // Метка над полем
  error?: string; // Сообщение об ошибке (текст)
  containerClassName?: string; // Классы для контейнера
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  containerClassName,
  variant,
  ...props
}) => {
  return (
    <div className={cn("relative", containerClassName)}>
      {label && <label className="text-white">{label}</label>}
      <input
        className={cn(InputVariants({ variant, error: !!error, className }))}
        {...props}
      />
      {error && (
        <p className="absolute -bottom-5 text-[10px] text-red-500">{error}</p>
      )}
    </div>
  );
};

export { Input, InputVariants };
