import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";
import { BtnLoader } from "../shared/btnLoader";

const ButtonsVariants = cva(
  `flex items-center justify-center gap-x-2 h-[44px] px-5 py-[10px] text-base font-medium rounded-lg transition-colors duration-300
   focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none
   disabled:opacity-50 disabled:pointer-events-none`,
  {
    variants: {
      variant: {
        default: `bg-primary text-black border border-black hover:bg-active hover:text-white hover:border-white`,
        secondary: `bg-white text-black border border-black hover:bg-black hover:text-white border-white`,
        outline: `bg-transparent text-black border border-black hover:bg-black hover:text-white`,
        ghost: `bg-transparent text-black hover:bg-gray-100`,
        danger: "bg-red-500 text-white hover:opacity-75",
      },
      size: {
        sm: "h-8 px-3 py-1 text-sm",
        md: "h-10 px-4 py-2 text-base",
        lg: "h-12 px-6 py-3 text-lg",
      },
      loading: {
        true: "opacity-75 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      loading: false,
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonsVariants> {
  isLoading?: boolean; // Состояние загрузки
  icon?: React.ReactNode; // Иконка
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  loading,
  isLoading = false,
  icon,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        ButtonsVariants({ variant, size, loading: isLoading }),
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && icon}
      {children}
    </button>
  );
};

export { Button, ButtonsVariants };
