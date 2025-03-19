import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";

const ButtonsVariants = cva(
  `flex items-center justify-center gap-x-2 h-[44px] px-5 py-[10px] text-base font-medium rounded-lg transition-colors duration-300
   focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none
   disabled:opacity-50 disabled:pointer-events-none`,
  {
    variants: {
      variant: {
        default: `bg-primary text-black border border-black hover:bg-active hover:text-white hover:border-white`,
        secondary: `bg-active text-white border`,
        outline: `bg-transparent text-white border border-white hover:bg-black hover:bg-gray-600`,
        ghost: `bg-transparent text-black hover:bg-gray-100`,
        danger: "bg-red-500 text-white hover:opacity-75",
      },
      loading: {
        true: "opacity-75 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
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
  loading,
  isLoading = false,
  icon,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        ButtonsVariants({ variant, loading: isLoading }),
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
