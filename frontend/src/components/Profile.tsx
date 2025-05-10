import { UserSchema } from "@/gen";
import React from "react";

export default function Profile({ user }: { user: UserSchema }) {
  console.log(user);
  return (
    <div className="flex  flex-row gap-2 items-center hover:cursor-pointer">
      <div className="w-9 h-9 rounded-lg flex justify-center items-center text-lg font-medium bg-orange-700 text-white ">
        {user.username[0].toUpperCase()}
      </div>
    </div>
  );
}
