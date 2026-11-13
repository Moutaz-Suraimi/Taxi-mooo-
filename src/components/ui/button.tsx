import { forwardRef, isValidElement, cloneElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants: Record<string, string> = {
      default:
        "bg-[#FFB800] text-[#001331] hover:bg-[#FFA500] shadow-md shadow-[#FFB800]/25 hover:shadow-lg hover:shadow-[#FFB800]/35 active:scale-[0.98] font-bold",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-slate-700 bg-transparent text-white hover:bg-white/10",
      secondary: "bg-slate-800 text-white hover:bg-slate-700",
      ghost: "hover:bg-white/10 text-white",
      link: "text-[#FFB800] underline-offset-4 hover:underline",
    };

    const sizes: Record<string, string> = {
      default: "h-11 px-5 py-2",
      sm: "h-9 rounded-lg px-3 text-xs",
      lg: "h-14 rounded-2xl px-8 text-base font-bold",
      icon: "h-10 w-10",
    };

    const combinedClassName = cn(
      baseStyles,
      variants[variant] || variants.default,
      sizes[size] || sizes.default,
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        className: cn(combinedClassName, child.props.className),
        ...props,
      });
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
