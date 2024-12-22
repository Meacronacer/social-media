import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";

const ButtonsVariants = cva(
  `h-[44px] px-5 py-[10px] bg-primary flex items-center gap-x-3 text-black transition-colors border border-black duration-300
   hover:bg-active hover:text-white hover:border-white
   `,
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ButtonProps
  extends React.HtmlHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonsVariants> {}

const Button: React.FC<ButtonProps> = ({ className, variant, ...props }) => {
  return (
    <button
      className={cn(ButtonsVariants({ variant, className }))}
      {...props}
    />
  );
};

export { Button, ButtonsVariants };
