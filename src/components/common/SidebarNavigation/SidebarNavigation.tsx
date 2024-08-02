import { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

type SidebarNavigationItemProps = {
  label: string;
  link: string;
  icon?: ReactNode;
  selected?: boolean;
};
interface SidebarNavigationProps {
  title: "Edaga";
  icon?: ReactNode;
  options: SidebarNavigationItemProps[];
}

const SidebarNavigation = ({
  title,
  icon,
  options,
}: SidebarNavigationProps) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <a
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            {icon}
            <span className="sr-only">{title}</span>
          </a>
          <TooltipProvider>
            {options.map((option, index) => {
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <a
                      href={option.link}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg hover:text-foreground md:h-8 md:w-8 ${
                        option.selected
                          ? `bg-accent text-accent-foreground transition-colors`
                          : `text-muted-foreground transition-colors`
                      }`}
                    >
                      {option.icon}
                      <span className="sr-only">{option.label}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right">{option.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
        {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <IconSettings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav> */}
      </aside>
    </>
  );
};

export default SidebarNavigation;
