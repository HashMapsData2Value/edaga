import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs } from "@/components/ui/tabs";

import SidebarNavigation from "@/components/common/SidebarNavigation";
import SampleBlocks from "@/components/app/ExampleBlock";
import TabGroup from "@/components/common/TabGroup";
import Icon from "@/components/common/Icon";
import DropdownMenu from "@/components/common/DropdownMenu";
import ExampleBlock from "@/components/app/ExampleBlock";
import MainHeader from "@/components/common/MainHeader";

const NAVIGATION = [
  {
    label: "Home",
    link: "#",
    icon: <Icon.Home className="h-5 w-5" />,
    selected: true,
  },
  {
    label: "Topics",
    link: "#",
    icon: <Icon.LibraryBig className="h-5 w-5" />,
  },
  {
    label: "About",
    link: "#",
    icon: <Icon.Info className="h-5 w-5" />,
  },
];

const Two = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarNavigation
        title="Edaga"
        icon={
          <Icon.Store className="h-4 w-4 transition-all group-hover:scale-110" />
        }
        options={NAVIGATION}
      />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MainHeader
          title="Edaga"
          icon={
            <Icon.Store className="h-5 w-5 transition-all group-hover:scale-110" />
          }
          navigationOptions={NAVIGATION}
        />

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ExampleBlock.ProductDetails />
        </main>
      </div>
    </div>
  );
};

export default Two;
