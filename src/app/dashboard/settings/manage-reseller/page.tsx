import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ManageResellerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Manage Reseller
        </h1>
        <p className="text-muted-foreground">
          Manage reseller settings.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Resellers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage reseller permissions and access.</p>
        </CardContent>
      </Card>
    </div>
  );
}
