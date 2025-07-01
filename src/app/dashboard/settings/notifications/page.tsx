import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Manage your notification preferences.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Configure how you receive notifications.</p>
        </CardContent>
      </Card>
    </div>
  );
}
