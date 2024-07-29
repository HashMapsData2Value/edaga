import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode } from "react";

export type MainNavigationItemProps = {
  label: string;
  link: string;
  icon?: ReactNode;
  selected?: boolean;
};
export interface MainNavigationProps {
  title: "Edaga";
  icon?: ReactNode;
  options: MainNavigationItemProps[];
}

const MainNavigation = ({ title, icon, options }: MainNavigationProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <a
            // href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            {icon}
            <span className="sr-only">{title}</span>
          </a>
          {options.map((option: MainNavigationItemProps) => {
            return (
              <a
                key={option.link}
                href={option.link}
                className={`flex items-center gap-4 px-2.5 ${
                  option.selected
                    ? `text-foreground`
                    : `text-muted-foreground hover:text-foreground`
                }`}
              >
                {option.icon}
                {option.label}
              </a>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MainNavigation;
