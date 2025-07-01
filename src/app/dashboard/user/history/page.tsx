import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          History
        </h1>
        <p className="text-muted-foreground">
          View your account history.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here is a list of your past transactions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
