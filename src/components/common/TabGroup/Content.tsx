import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

export interface TabContentProps {
  value: string;
  children: ReactNode;
}

const Content = ({ value, children }: TabContentProps) => {
  return <TabsContent value={value}>{children}</TabsContent>;
};

export default Content;
