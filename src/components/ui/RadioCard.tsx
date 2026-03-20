import React from "react";
import { cn } from "../../utils/cn";

interface RadioCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
  ({ className, label, description, checked, onChange, value, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md",
          checked ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "",
          className
        )}
      >
        <span className="flex items-center gap-3">
          <input
            type="radio"
            ref={ref}
            checked={checked}
            onChange={onChange}
            value={value}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            {...props}
          />
          <span className="flex flex-col">
            <span className="block text-sm font-medium text-gray-900">{label}</span>
            {description && <span className="mt-1 text-xs text-gray-500">{description}</span>}
          </span>
        </span>
      </label>
    );
  }
);

RadioCard.displayName = "RadioCard";
