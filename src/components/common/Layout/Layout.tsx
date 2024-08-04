import { ReactNode, useEffect } from "react";

import SidebarNavigation from "@/components/common/SidebarNavigation";
import {
  Home as IconHome,
  LibraryBig as IconLibraryBig,
  Info as IconInfo,
  Store as IconStore,
  ChevronLeft as IconChevronLeft,
} from "lucide-react";

import MainHeader from "@/components/common/MainHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";

export interface LayoutProps {
  children?: string | ReactNode;
  breadcrumbOptions: { label: string; link: string }[];
}

const Layout = ({ children, breadcrumbOptions }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => console.log("LOCATION", location), [location]);

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
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
        />

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {`${getLocationLabel().plural}`}
              </h1>
              <Badge
                variant="outline"
                className="ml-auto sm:ml-0 text-muted-foreground"
              >
                Alpha
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
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
      </div>
    </div>
  );
};

export default Layout;
