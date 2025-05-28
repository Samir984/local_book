import { Link } from "react-router-dom";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img src="/logo.png" alt="logo" width={32} />
      <div>
        <h1
          className={`text-xl sm:text-2xl font-noto font-medium text-bookworm-primary leading-tight ${className && className}`}
        >
          LocalBook <br />
        </h1>
      </div>
    </Link>
  );
}
