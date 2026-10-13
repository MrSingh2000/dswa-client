import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/query/auth/login.query";
import { queryKeys } from "@/query/query-keys";
import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { toaster } from "@/utils/toaster";
import Loader from "@/components/loader";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof LoginFormValues;
        if (fieldName) {
          setError(fieldName, { message: issue.message });
        }
      });
      return;
    }

    try {
      await login(result.data);
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.userDetails],
      });
      toaster.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Invalid email or password";
        toaster.error(message);
      } else {
        toaster.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-full max-w-sm gap-4 px-4 py-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription className="font-light">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  disabled={isPending}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  disabled={isPending}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-6">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending ? (
                <Loader size={16} text="" className="h-auto w-auto" />
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
