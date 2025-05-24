import { useAuth } from "@/context/AuthProvider";
import { UserSchema } from "@/gen";

import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Profile({ user }: { user: UserSchema | null }) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-row gap-2 items-center hover:cursor-pointer relative ">
      {/* Add modal={false} here */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="w-9 h-9 rounded-lg shadow-2xl flex justify-center items-center text-lg font-medium bg-orange-700 text-white">
            {user?.username?.[0]?.toUpperCase()}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="shadow-2xl p-2 bg-card text-card-foreground  rounded-md"
          align="end"
          side="bottom"
          sideOffset={8}
        >
          <DropdownMenuItem
            className="px-4 py-2 gap-4 flex justify-between items-center "
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 gap-4 flex justify-between items-center ">
            <User size={18} />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
