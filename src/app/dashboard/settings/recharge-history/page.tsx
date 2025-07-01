import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RechargeHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Recharge History
        </h1>
        <p className="text-muted-foreground">
          View recharge history.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Recharge History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A list of all recharges.</p>
        </CardContent>
      </Card>
    </div>
  );
}
