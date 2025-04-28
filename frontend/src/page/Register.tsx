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
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Phone } from "lucide-react";
import useGeoLocation from "@/context/useGeoLocation";
import { z } from "zod";
import { useCoreApiRegisterUser } from "@/gen";
import { toast } from "sonner";

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
  phone_number: z
    .string()
    .min(10, { message: "Phone number must at least 10 digits" }),
});
type RegisterForm = z.infer<typeof RegisterSchema>;

function Register() {
  const geoLocation = useGeoLocation();
  const mutation = useCoreApiRegisterUser({
    mutation: {
      onSuccess: (data) => {
        console.log("User registered successfully", data);
      },
      onError: (error) => {
        console.error("Error registering user", error);
        toast("Error registering user. Please try again.");
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {},
  });

  const onSubmit = (data: RegisterForm) => {
    if (!geoLocation) {
      toast.error("Please allow location access to register.");
      return;
    }
    const finalData = {
      ...data,
      ...geoLocation,
    };

    mutation.mutate({ data: finalData });
  };
  console.log("Errors:", errors);

  console.log("GeoLocation:", geoLocation);
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
                  className={`${errors.username ? "border-red-600" : ""}`}
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
                />
                {
                  <p className="text-[12px]  text-red-500 ">
                    {errors.password?.message}
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
                  className={`pl-10 ${errors.username ? "border-red-600" : ""}`}
                  {...register("phone_number")}
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
            <Button className="w-full">Register</Button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80"
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
