import { cn } from "cn";
import type { FieldError } from "react-hook-form";

interface FormErrorProps {
  error?: FieldError | string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, className }) => {
  if (!error) return null;

  const message = typeof error === "string" ? error : error.message;
  if (!message) return null;

  return (
    <p
      role="alert"
      className={cn("text-xs font-medium text-destructive transition-all", className)}
    >
      {message}
    </p>
  );
};
