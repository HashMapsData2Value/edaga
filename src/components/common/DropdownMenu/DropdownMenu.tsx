import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu as DropdownMenuContainer,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownOption {
  title: string;
  checked?: boolean;
}
interface DropdownSeparator {
  separator: true;
}

type DropdownItem = DropdownOption | DropdownSeparator;

interface DropdownMenuProps {
  label: string;
  icon?: ReactNode;
  options: DropdownItem[];
}

const DropdownMenu = ({ label, icon, options }: DropdownMenuProps) => {
  return (
    <DropdownMenuContainer>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
          {icon}
          <span className="sr-only sm:not-sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option: DropdownItem, index) => {
          return "separator" in option ? (
            <DropdownMenuSeparator key={index} />
          ) : (
            <DropdownMenuCheckboxItem
              key={index}
              {...(option.checked && { checked: true })}
            >
              {option.title}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenuContainer>
  );
};

export default DropdownMenu;
