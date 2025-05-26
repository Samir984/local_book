import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoading) {
    return null;
  }
  return children;
}
