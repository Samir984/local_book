import { useAuth } from "@/context/AuthProvider";
import { UserSchema } from "@/gen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LogOut, User } from "lucide-react";

export default function Profile({ user }: { user: UserSchema | null }) {
  const { logout } = useAuth();
  return (
    <div className="flex flex-row gap-2 items-center hover:cursor-pointer relative">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="w-9 h-9 rounded-lg shadow-2xl flex justify-center items-center text-lg font-medium bg-orange-700 text-white">
            {user?.username[0].toUpperCase()}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="shadow-2xl p-2  top-2 absolute -right-4 bg-card text-card-foreground border border-gray-300 rounded-md"
          rounded-md
        >
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="px-4 py-2 gap-4 hover:bg-gray-100 hover:text-orange-700 flex justify-between items-center hover:outline-none"
            onClick={logout}
          >
            <LogOut size={18} />
            <span className="font-share">Logout</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 gap-4 hover:bg-gray-100 hover:text-blue-700 flex justify-between items-center hover:outline-none">
            <User size={18} />
            <span className="font-share">Profile</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
