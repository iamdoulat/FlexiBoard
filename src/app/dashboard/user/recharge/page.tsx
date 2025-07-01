import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RechargePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Recharge
        </h1>
        <p className="text-muted-foreground">
          Recharge your account balance.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Recharge Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Add funds to your wallet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
