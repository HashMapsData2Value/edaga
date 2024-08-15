import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarNavigation from "@/components/common/SidebarNavigation";
import {
  Home as IconHome,
  LibraryBig as IconLibraryBig,
  Info as IconInfo,
  Store as IconStore,
  ChevronLeft as IconChevronLeft,
  RadioTower as IconRadioTower,
  // SlidersHorizontal,
  ListFilter as IconListFilter,
} from "lucide-react";

import MainHeader from "@/components/common/MainHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  type BroadcastChannel,
  BroadcastChannels,
} from "@/config/broadcast.config";
import { shortenedAccountBase32 } from "@/utils";
import { useApplicationState } from "@/store";
// import { Separator } from "@/components/ui/separator";

export interface LayoutProps {
  children?: string | ReactNode;
  breadcrumbOptions: { label: string; link: string }[];
}

const Layout = ({ children, breadcrumbOptions }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const NAVIGATION = [
    {
      label: "Home",
      link: `/`,
      icon: <IconHome className="h-5 w-5" />,
      selected:
        !location.pathname.includes("topics") &&
        !location.pathname.includes("about"),
    },
    {
      label: "Topics",
      link: `/topics`,
      icon: <IconLibraryBig className="h-5 w-5" />,
      selected: location.pathname.includes("topics"),
    },
    {
      label: "About",
      link: "#",
      icon: <IconInfo className="h-5 w-5" />,
      selected: location.pathname.includes("about"),
    },
  ];

  interface Label {
    singular: string;
    plural: string;
  }

  interface LocationLabel {
    [key: string]: Label;
  }

  const getLocationLabel = (): Label => {
    const pathToLabelMap: LocationLabel = {
      "/replies": { singular: "Reply", plural: "Replies" },
      "/topics": { singular: "Topic", plural: "Topics" },
    };

    const defaultLabel: Label = {
      singular: "Conversation",
      plural: "Conversations",
    };

    const currentPath = Object.keys(pathToLabelMap).find((path) =>
      location.pathname.includes(path)
    );

    return currentPath ? pathToLabelMap[currentPath] : defaultLabel;
  };

  const [openBroadcastAccountAlert, setOpenBroadcastAccountAlert] =
    useState(false);

  const { broadcastChannel, setBroadcastChannel } = useApplicationState();
  const handleChannelChange = (newValue: string) => {
    const selectedChannel = BroadcastChannels.find(
      (channel) =>
        `${channel.owner}-${channel.address}-${channel.network.environment}` ===
        newValue
    );

    if (selectedChannel) {
      setBroadcastChannel(selectedChannel);
      navigate("/");
    }

    setOpenBroadcastAccountAlert(false);
  };

  useEffect(() => {
    console.log("broadcastChannel", broadcastChannel);
  }, [broadcastChannel]);

  const { moderation, setModeration } = useApplicationState();

  const handleModerationToggle = () => setModeration(!moderation);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pb-10">
      <SidebarNavigation
        title="Edaga"
        icon={
          <IconStore className="h-4 w-4 transition-all group-hover:scale-110" />
        }
        options={NAVIGATION}
      />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MainHeader
          title="Edaga"
          icon={
            <IconStore className="h-5 w-5 transition-all group-hover:scale-110" />
          }
          navigationOptions={NAVIGATION}
          breadcrumbOptions={breadcrumbOptions}
          setOpenBroadcastAccountAlert={setOpenBroadcastAccountAlert}
        />

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    {location.pathname.startsWith("/replies") && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => navigate(-1)}
                      >
                        <IconChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                      </Button>
                    )}
                    <h1 className="text-xl font-semibold tracking-tight">
                      {`${getLocationLabel().plural}`}
                    </h1>
                    <Badge variant="outline" className="text-muted-foreground">
                      Alpha
                    </Badge>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <IconListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" side="bottom" align="end">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 justify-between">
                              <Label htmlFor="airplane-mode text-sm">
                                Content Moderation
                              </Label>
                              <Switch
                                id="airplane-mode"
                                checked={moderation}
                                onCheckedChange={handleModerationToggle}
                              />
                            </div>
                            <p
                              className="text-sm text-muted-foreground"
                              title="Only posts in English currently supported "
                            >
                              Hide potentially offensive words in posts
                            </p>
                          </div>
                        </div>
                        {/* <Separator />
                        <div className="space-y-2">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 justify-between">
                              <Label htmlFor="airplane-mode text-sm">
                                Minimum Free Threshold
                              </Label>
                              <Switch id="airplane-mode" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              TODO - Hide posts that fall below this fee threshold
                            </p>
                          </div>
                        </div> */}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex ml-auto gap-2">
                <Button size="sm" onClick={() => alert("TODO - Soon")}>
                  {`New ${getLocationLabel().singular}`}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
              {children}
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Edaga</CardTitle>
                    <CardDescription>(እዳጋ, uh-da-ga)</CardDescription>
                    <CardDescription>
                      "Market" in Tigrinya, a language spoken in Eritrea and
                      Tigray. It is a translation of the Latin "Forum", which
                      originally referred to public outdoor places primarily
                      reserved for selling goods in the Roman Empire.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <a
                      href="https://github.com/HashMapsData2Value/edaga"
                      rel="noopener"
                      target="_blank"
                    >
                      <Button size="sm" variant="secondary">
                        Learn More
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Alerts and Modals */}
        <AlertDialog
          open={openBroadcastAccountAlert}
          onOpenChange={setOpenBroadcastAccountAlert}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Select Broadcast Account</AlertDialogTitle>
              <AlertDialogDescription className="pb-4">
                A broadcast account is an account where messages are sent to on
                Edaga.
              </AlertDialogDescription>

              <RadioGroup
                defaultValue={`${broadcastChannel.owner}-${broadcastChannel.address}-${broadcastChannel.network.environment}`}
                onValueChange={handleChannelChange}
              >
                {BroadcastChannels.map((account: BroadcastChannel) => {
                  const { name, address, owner, description, network } =
                    account;
                  return (
                    <Label
                      key={address}
                      htmlFor={`${owner}-${address}-${network.environment}`}
                      className="flex items-center space-x-4 rounded-md border p-6"
                    >
                      <IconRadioTower
                        className="text-muted-foreground"
                        size={30}
                      />
                      <div className="flex-1 space-y-1 pl-2">
                        <p className="text-md font-medium leading-none">
                          {name}
                        </p>
                        <p className="text-sm font-light text-muted-foreground">
                          {description}
                        </p>
                        <p className="text-xs font-light text-muted-foreground">
                          {shortenedAccountBase32(address)}
                        </p>
                      </div>
                      <RadioGroupItem
                        className="w-[20px] h-[20px]"
                        value={`${owner}-${address}-${network.environment}`}
                        id={`${owner}-${address}-${network.environment}`}
                      />
                    </Label>
                  );
                })}
              </RadioGroup>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              {/* <AlertDialogAction
                onClick={() => setOpenBroadcastAccountAlert(false)}
              >
                Switch
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Layout;
