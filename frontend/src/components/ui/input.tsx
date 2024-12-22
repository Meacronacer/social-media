import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";
import { InputHTMLAttributes } from "react";

const InputVariants = cva(
  `h-[21px] bg-black w-full text-[14px] font-medium focus:outline-none`,
  {
    variants: {
      variant: {
        default: "border-none",
        second: "border-b-2 py-[20px] border-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {}

const Input: React.FC<InputProps> = ({ className, variant, ...props }) => {
  return (
    <input className={cn(InputVariants({ variant, className }))} {...props} />
  );
};

export { Input, InputVariants };
