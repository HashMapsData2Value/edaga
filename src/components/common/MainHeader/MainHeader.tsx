import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Search as IconSearch,
  UserRound as IconUserRound,
  Moon,
  Sun,
} from "lucide-react";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import MainNavigation, {
  type MainNavigationItemProps,
} from "@/components/app/MainNavigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTheme } from "@/ThemeProvider";

interface MainHeaderProps {
  title: "Edaga";
  icon?: ReactNode;
  navigationOptions: MainNavigationItemProps[];
  breadcrumbOptions: { label: string; link: string }[];
  setOpenBroadcastAccountAlert: Dispatch<SetStateAction<boolean>>;
}

const MainHeader = ({
  title,
  icon,
  navigationOptions,
  breadcrumbOptions,
  setOpenBroadcastAccountAlert,
}: MainHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [currentThemeIcon, setCurrentThemeIcon] = useState(
    <Sun className="transition-all" />
  );

  useEffect(() => {
    const systemDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (theme === "system" && systemDarkMode)) {
      setCurrentThemeIcon(<Moon className="transition-all" />);
    } else {
      setCurrentThemeIcon(<Sun className="transition-all" />);
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MainNavigation title={title} icon={icon} options={navigationOptions} />
      <Breadcrumb options={breadcrumbOptions} />
      <div className="relative ml-auto flex-1 md:grow-0">
        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
            <IconUserRound className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem>Connect</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            title="Set Broadcast Account"
            onClick={() => setOpenBroadcastAccountAlert(true)}
          >
            Broadcast Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Select
              onValueChange={(value) => {
                setTheme(value as "light" | "dark" | "system");
              }}
            >
              <SelectTrigger className="w-[160px] flex items-center space-x-2">
                {currentThemeIcon}
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default MainHeader;
