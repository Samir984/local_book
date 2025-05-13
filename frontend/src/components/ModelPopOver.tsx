import React, { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ModalPopoverProps {
  isOpen: boolean;
  closePopOver: () => void;
  children: ReactNode;
}

const ModalPopover: React.FC<ModalPopoverProps> = ({
  isOpen,
  closePopOver,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 opacity-15"
        onClick={closePopOver}
      />
      <div className="bg-white w-96 rounded-lg shadow-xl relative z-50">
        <Button
          variant={"ghost"}
          onClick={closePopOver}
          className="absolute top-2 right-2"
        >
          <X size={20} className="h-5 w-5" />
        </Button>
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
};

export default ModalPopover;
