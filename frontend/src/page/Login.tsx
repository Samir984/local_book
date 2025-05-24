import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useCoreApiLoginUser } from "@/gen";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const LoginMutation = useCoreApiLoginUser({
    mutation: {
      onSuccess: (data) => {
        console.log("response:", data);
        login(data);
        toast.success("Logged in successfully.");
        navigate("/");
      },
      onError: (error) => {
        console.error("Error registering user", error);
        toast.error(
          `Error: ${error.response?.data.detail || "Fail to login."}`
        );
      },
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    console.log(data);
    await LoginMutation.mutateAsync({ data });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-md space-y-4 mx-auto ">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  className="pl-10"
                  required
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.email?.message}
                  </p>
                }
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  placeholder="**********"
                  {...register("password")}
                  required
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.password?.message}
                  </p>
                }
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {LoginMutation.isError && (
              <div className="flex items-center justify-center gap-2 text-red-400 font-semibold text-lg text-center p-2 rounded-md bg-red-50 border border-red-200 w-full">
                <AlertCircle className="w-5 h-5" />
                <span>Invalid Credentials</span>
              </div>
            )}
            <Button className="w-full" disabled={LoginMutation.isPending}>
              Login
            </Button>
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-500 hover:text-blue-600/80"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Login;
