import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account profile settings.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Update your personal information here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
