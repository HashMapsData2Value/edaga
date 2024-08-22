import { ReactNode } from "react";
import {
  Dialog as DialogContainer,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogProps {
  open?: boolean | undefined;
  onOpenChange?(open: boolean): void;
  title: string | ReactNode;
  description: string | ReactNode;
  children: ReactNode;
}

const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}: DialogProps) => {
  return (
    <DialogContainer open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-full max-w-full sm:max-w-lg sm:h-auto sm:rounded-lg overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="pb-4">{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" className="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogContainer>
  );
};

export default Dialog;