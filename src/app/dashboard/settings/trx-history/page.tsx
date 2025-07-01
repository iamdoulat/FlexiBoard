import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TrxHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          View transaction history.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A list of all transactions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
