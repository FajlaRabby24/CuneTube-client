"use client";

import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnyFieldApi } from "@tanstack/react-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return String(error);
};

type InputFieldProps = {
  from?: string;
  field: AnyFieldApi;
  label: string;
  id: string;
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
};

export default function PasswordField({
  from,
  field,
  label,
  id,
  placeholder,
  append,
  prepend,
  className,
  labelClassName,
  disabled = false,
}: InputFieldProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;

  const hasError = firstError !== null;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className={cn("flex items-center")}>
        <FieldLabel
          htmlFor={field.name}
          className={cn(hasError && "text-destructive", labelClassName)}
        >
          {label}
        </FieldLabel>
        <Link
          href={`/forgot-password`}
          className={cn(
            "ml-auto inline-block text-sm underline-offset-4 hover:underline",
            from === "login" ? "block" : "hidden",
          )}
        >
          Forgot your password?
        </Link>
      </div>

      <div className="relative">
        <Input
          required
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          id={id}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            prepend && "pl-10",
            append && "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive/20",
          )}
        />
        <button
          aria-controls="password"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          onClick={toggleVisibility}
          type="button"
        >
          {isVisible ? (
            <EyeOffIcon aria-hidden="true" size={16} />
          ) : (
            <EyeIcon aria-hidden="true" size={16} />
          )}
        </button>

        {append && (
          <div className="absolute inset-y-0 right-0 items-center pr-3 pointer-events-none z-10">
            {append}
          </div>
        )}

        {hasError && (
          <p
            id={`${field.name}-error`}
            role="alert"
            className="text-sm text-destructive"
          >
            {firstError}
          </p>
        )}
      </div>
    </div>
  );
}
