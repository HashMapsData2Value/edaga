import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
import {
  // Search as IconSearch,
  RadioTower as IconRadioTower,
  Moon as IconMoon,
  Sun as IconSun,
  Cog as IconCog,
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
import { useWallet } from "@txnlab/use-wallet-react";
import { shortenedAccountBase32 } from "@/utils";

interface MainHeaderProps {
  title: "Edaga";
  icon?: ReactNode;
  navigationOptions: MainNavigationItemProps[];
  breadcrumbOptions: { label: string; link: string }[];
  setOpenBroadcastAccountAlert: Dispatch<SetStateAction<boolean>>;
  setOpenWalletModal: Dispatch<SetStateAction<boolean>>;
}

const MainHeader = ({
  title,
  icon,
  navigationOptions,
  breadcrumbOptions,
  setOpenBroadcastAccountAlert,
  setOpenWalletModal,
}: MainHeaderProps) => {
  const { activeWallet, activeAccount } = useWallet();

  useEffect(() => {
    console.log("activeWallet, activeAccount");
    console.log(activeWallet, activeAccount);
  }, [activeWallet, activeAccount]);

  const { theme, setTheme } = useTheme();
  const [currentThemeIcon, setCurrentThemeIcon] = useState(
    <IconSun className="transition-all" />
  );

  useEffect(() => {
    const systemDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (theme === "system" && systemDarkMode)) {
      setCurrentThemeIcon(<IconMoon className="transition-all h-4 w-4" />);
    } else {
      setCurrentThemeIcon(<IconSun className="transition-all h-4 w-4" />);
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MainNavigation title={title} icon={icon} options={navigationOptions} />
      <Breadcrumb options={breadcrumbOptions} />
      {/* <div
        className="relative ml-auto flex-1 flex items-center md:grow-0 gap-2"
        style={{ outline: "1px solid red" }}
      >
        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div> */}

      <div className="relative flex-1 gap-2" />

      <Button variant="outline" onClick={() => setOpenWalletModal(true)}>
        {activeWallet
          ? shortenedAccountBase32(activeAccount!.address, 6)
          : "Connect"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <IconCog className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            title="Set Broadcast Account"
            onClick={() => setOpenBroadcastAccountAlert(true)}
            className="flex justify-space items-center space-x-2"
          >
            <IconRadioTower className="w-4 h-4 mr-4" />
            Broadcast Channel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(evt) => evt.stopPropagation()}>
            <Select
              value={theme}
              onValueChange={(value) => {
                setTheme(value as "light" | "dark" | "system");
              }}
            >
              <SelectTrigger
                className="w-[160px] p-0 m-0 border-0 bg-transparent h-auto flex justify-space items-center space-x-2"
                style={{ boxShadow: "none" }}
              >
                {currentThemeIcon}
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className="p-0 m-0">
                <SelectItem value="light" className="flex flex-row">
                  <span>Light</span>
                </SelectItem>
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
