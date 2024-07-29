import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const YourOrders = () => {
  return (
    <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="pb-3">
        <CardTitle>Your Orders</CardTitle>
        <CardDescription className="text-balance max-w-lg leading-relaxed">
          Introducing Our Dynamic Orders Dashboard for Seamless Management and
          Insightful Analysis.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>Create New Order</Button>
      </CardFooter>
    </Card>
  );
};

export default YourOrders;
