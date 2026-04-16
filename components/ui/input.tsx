import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-coffee-200 bg-white px-4 py-2 text-sm text-coffee-900 ring-offset-background",
          "placeholder:text-coffee-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-400 focus-visible:border-coffee-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
