import React from "react";
import { useNavigate } from "react-router";
import { LogIn, Lock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface PerformLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  featureName?: string;
  redirectTo?: string;
}

export const PerformLoginDialog: React.FC<PerformLoginDialogProps> = ({
  open,
  onOpenChange,
  title = "Authentication Required",
  description,
  featureName,
  redirectTo = "/login",
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onOpenChange(false);
    navigate(redirectTo);
  };

  const computedDescription =
    description ||
    (featureName
      ? `Please sign in to your account to access ${featureName} and sync your progress across devices.`
      : "Please sign in to your account to access this feature and keep your study progress synchronized.");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="flex flex-col items-center text-center gap-3 p-6">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Lock className="h-6 w-6 stroke-[2.2]" />
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <DialogTitle className="text-xl font-bold tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {computedDescription}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleLogin}
            className="w-full sm:w-auto gap-2 cursor-pointer font-medium shadow-xs"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Continue</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PerformLoginDialog;
