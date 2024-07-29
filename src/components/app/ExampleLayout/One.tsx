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

const One = () => {
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

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <SampleBlocks.YourOrders />
              <SampleBlocks.ThisWeek />
              <SampleBlocks.ThisMonth />
            </div>
            <Tabs defaultValue="week">
              <div className="flex items-center">
                <TabGroup.Triggers
                  tabs={[
                    { name: "week", title: "Week" },
                    { name: "month", title: "Month" },
                    { name: "year", title: "Year" },
                  ]}
                />
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu
                    label="Filter"
                    icon={<Icon.ListFilter className="h-3.5 w-3.5" />}
                    options={[
                      { title: "Fulfilled", checked: true },
                      { separator: true },
                      { title: "Declined" },
                      { title: "Refunded" },
                    ]}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <Icon.File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabGroup.Content value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SampleBlocks.TableContent />
                  </CardContent>
                </Card>
              </TabGroup.Content>
              <TabGroup.Content value="month">Month</TabGroup.Content>
              <TabGroup.Content value="year">Year</TabGroup.Content>
            </Tabs>
          </div>
          <div>
            <ExampleBlock.OrderInformation />
          </div>
        </main>
      </div>
    </div>
  );
};

export default One;
