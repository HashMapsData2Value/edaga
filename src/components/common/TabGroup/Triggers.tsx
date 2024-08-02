import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabTriggerProps {
  tabs: { name: string; title: string }[];
}

const Triggers = ({ tabs }: TabTriggerProps) => {
  return (
    <TabsList>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.name} value={tab.name}>
          {tab.title}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default Triggers;
