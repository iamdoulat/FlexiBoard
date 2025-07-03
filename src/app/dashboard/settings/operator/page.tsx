import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function OperatorSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Operators
        </h1>
        <p className="text-muted-foreground">
          Manage operator actions like recharge and balance checks.
        </p>
      </div>
      <Separator />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recharge Operator</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="operator-recharge">Operator</Label>
                <Select>
                  <SelectTrigger id="operator-recharge">
                    <SelectValue placeholder="Select an operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robi">ROBI</SelectItem>
                    <SelectItem value="gp">GP</SelectItem>
                    <SelectItem value="airtel">Airtel</SelectItem>
                    <SelectItem value="banglalink">Banglalink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <Input
                  id="mobile-number"
                  type="tel"
                  placeholder="Enter mobile number"
                />
              </div>
              <Button type="submit" className="w-full">
                Recharge
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Balance Check</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="operator-balance">Operator</Label>
                <Select>
                  <SelectTrigger id="operator-balance">
                    <SelectValue placeholder="Select an operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robi">ROBI</SelectItem>
                    <SelectItem value="gp">GP</SelectItem>
                    <SelectItem value="airtel">Airtel</SelectItem>
                    <SelectItem value="banglalink">Banglalink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Balance Check
              </Button>
            </form>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Result</h3>
              <div className="rounded-md border bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Balance will be shown here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
