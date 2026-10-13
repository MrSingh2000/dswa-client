import { cn } from "cn";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number | string;
  className?: string;
  text?: string;
}

export const Loader = ({ size = 28, className, text = "Loading..." }: LoaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 h-screen w-screen bg-background",
        className,
      )}
    >
      <Loader2 size={size} className="animate-spin text-primary" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

export default Loader;
