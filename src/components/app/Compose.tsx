import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "../ui/textarea";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
import {
  // Paperclip as IconPaperclip,
  // Mic as IconMic,
  CornerDownLeft as IconCornerDownLeft,
} from "lucide-react";
import { useEffect } from "react";

interface ComposeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Compose = ({ open, onOpenChange }: ComposeProps) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("sheet-open");
    } else {
      document.body.classList.remove("sheet-open");
    }
    return () => document.body.classList.remove("sheet-open");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
      <SheetContent side="bottom">
        <SheetHeader className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pt-2 pb-6">
          <SheetTitle>New Conversation</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <form
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            x-chunk=""
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 text-base"
              // style={{ border: "1px solid red"}}
            />
            <div className="flex items-center p-3 pt-0">
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconPaperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconMic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              <Button type="submit" size="default" className="ml-auto gap-1.5">
                Post
                <IconCornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Compose;
