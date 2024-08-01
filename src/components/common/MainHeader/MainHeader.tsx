import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { ReactNode } from "react";
import MainNavigation, {
  type MainNavigationItemProps,
} from "@/components/app/MainNavigation";
import Icon from "@/components/common/Icon";
import Breadcrumb from "@/components/common/Breadcrumb";

interface MainHeaderProps {
  title: "Edaga";
  icon?: ReactNode;
  navigationOptions: MainNavigationItemProps[];
  breadcrumbOptions: { label: string; link: string }[];
}

const MainHeader = ({
  title,
  icon,
  navigationOptions,
  breadcrumbOptions,
}: MainHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MainNavigation title={title} icon={icon} options={navigationOptions} />
      <Breadcrumb options={breadcrumbOptions} />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Icon.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Icon.UserRound className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default MainHeader;
