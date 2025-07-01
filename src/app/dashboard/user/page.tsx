import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Wallet } from "lucide-react";

export default function UserDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          User Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to your personal dashboard.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">John Doe</div>
            <p className="text-xs text-muted-foreground">
              user@example.com
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Wallet</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <p className="text-xs text-muted-foreground">
              Available balance
            </p>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <p>You logged in.</p>
              <p className="ml-auto text-sm text-muted-foreground">5m ago</p>
            </div>
            <div className="flex items-center">
              <p>You updated your profile.</p>
              <p className="ml-auto text-sm text-muted-foreground">1d ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
