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
          Recharge a mobile number for a specific operator.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Recharge Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="max-w-sm space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="operator">Operator</Label>
              <Select>
                <SelectTrigger id="operator">
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
    </div>
  );
}