import { ReactNode } from "react";

import SidebarNavigation from "@/components/common/SidebarNavigation";
import MainNavigation from "@/components/app/MainNavigation";
import Icon from "@/components/common/Icon";
import MainHeader from "@/components/common/MainHeader";
import ExampleBlock from "@/components/app/ExampleBlock";

export interface LayoutProps {
  children?: string | ReactNode;
}

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

const Layout = ({ children }: LayoutProps) => {
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

        {/* <main
          className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
          style={{ border: "1px dotted magenta" }}
        > */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
          {/* <ExampleBlock.ProductDetails /> */}

          {/* <div
            className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2"
            style={{ border: "1px dotted lime" }}
          >
            <div
              className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
              style={{ border: "1px dotted orange" }}
            ></div>
          </div> */}
          {/* <div></div> */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
