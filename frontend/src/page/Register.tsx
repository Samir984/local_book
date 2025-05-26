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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Phone, LocateFixed } from "lucide-react";

import { z } from "zod";
import { coreApiCheckUsername, useCoreApiRegisterUser } from "@/gen";
import { toast } from "sonner";
import { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { AxiosError } from "axios";

const RegisterSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  last_name: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  location: z.string(),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must at least 10 digits" }),
});
type RegisterSchemaType = z.infer<typeof RegisterSchema>;

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    getValues,
    clearErrors,
    setFocus,

    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {},
  });

  const signupMutation = useCoreApiRegisterUser({
    mutation: {
      onSuccess: (data) => {
        console.log("response:", data);
        toast.success(data.detail);
        navigate("/login");
        reset();
      },
      onError: (error) => {
        console.error(error);

        const errorMessage = String(error.response?.data.detail || "");
        toast.error(error.response?.data.detail || "Failed to register.");

        if (errorMessage.toLowerCase().includes("email")) {
          setError("email", {
            type: "emailExits",
            message: errorMessage,
          });
          setFocus("email");
        }
        // Fallback for general errors if specific conditions aren't met
      },
    },
  });
  const username = watch("username");
  const debounceUsername = useDebounce(username || "", 300);

  const onSubmit = (data: RegisterSchemaType) => {
    if (errors.username?.message) {
      setError("username", {
        type: "userNameCheck",
        message: errors.username?.message,
      });
      setFocus("username");
      return;
    }

    signupMutation.mutate({ data });
  };

  useEffect(() => {
    async function checkUsername() {
      try {
        await coreApiCheckUsername({ username: debounceUsername });

        if (errors.username?.type === "userNameCheck") {
          clearErrors("username");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.status === 500) {
          toast.error("Some things went wrong. Please try later.");
          return;
        }

        setError("username", {
          type: "userNameCheck",
          message:
            // @ts-ignore
            axiosError.response?.data?.detail || "Username already exists",
        });
      }
    }
    if (debounceUsername.length <= 3) return;
    checkUsername();
  }, [
    debounceUsername,
    getValues,
    setError,
    clearErrors,
    errors.username?.type,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md space-y-4">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 ">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 relative">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  className={`${errors.first_name ? "border-red-600" : ""}`}
                  placeholder="John"
                  {...register("first_name")}
                  required
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.first_name?.message}
                  </p>
                }
              </div>

              <div className="flex flex-col gap-1 relative  ">
                <Label htmlFor="last_name mt-2">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  className={`${errors.last_name ? "border-red-600" : ""}`}
                  {...register("last_name")}
                  required
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.last_name?.message}
                  </p>
                }
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <div className="relative ">
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className={`${errors.username?.message ? "border-red-600" : ""}`}
                  {...register("username")}
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.username?.message}
                  </p>
                }
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative ">
                <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`pl-10 ${errors.email ? "border-red-600" : ""}`}
                  {...register("email")}
                  required
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.email?.message}
                  </p>
                }
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative ">
                <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="**********"
                  className={`pl-10 ${errors.password ? "border-red-600" : ""}`}
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
            <div className="space-y-1">
              <Label htmlFor="location">Location:</Label>
              <div className="relative ">
                <LocateFixed className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="location"
                  type="text"
                  placeholder="location"
                  className={`pl-10 ${errors.location ? "border-red-600" : ""}`}
                  {...register("location")}
                  required
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.location?.message}
                  </p>
                }
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number:</Label>
              <div className="relative ">
                <Phone className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="number"
                  placeholder="mobile"
                  className={`pl-10 ${errors.phone_number ? "border-red-600" : ""}`}
                  {...register("phone_number")}
                  required
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.phone_number?.message}
                  </p>
                }
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" disabled={signupMutation.isPending}>
              Register
            </Button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-500 hover:text-blue-600/80"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Register;
