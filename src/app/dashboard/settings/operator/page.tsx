'use client';

import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OperatorSettingsPage() {
  const [rechargeMobileNumber, setRechargeMobileNumber] = useState("");
  const [rechargeOperator, setRechargeOperator] = useState("");
  const [balanceCheckOperator, setBalanceCheckOperator] = useState("");

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setRechargeMobileNumber(number);

    if (number.startsWith("017")) {
      setRechargeOperator("gp");
    } else if (number.startsWith("018")) {
      setRechargeOperator("robi");
    } else if (number.startsWith("016")) {
      setRechargeOperator("airtel");
    } else if (number.startsWith("019")) {
      setRechargeOperator("banglalink");
    } else if (number.startsWith("013")) {
      setRechargeOperator("skitto");
    } else {
      setRechargeOperator("");
    }
  };

  const operators = ["ROBI", "GP", "Airtel", "Banglalink", "Skitto"];

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
                <Select value={rechargeOperator} onValueChange={setRechargeOperator}>
                  <SelectTrigger id="operator-recharge">
                    <SelectValue placeholder="Select an operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robi">ROBI</SelectItem>
                    <SelectItem value="gp">GP</SelectItem>
                    <SelectItem value="airtel">Airtel</SelectItem>
                    <SelectItem value="banglalink">Banglalink</SelectItem>
                    <SelectItem value="skitto">Skitto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <Input
                  id="mobile-number"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={rechargeMobileNumber}
                  onChange={handleMobileNumberChange}
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
                <Select value={balanceCheckOperator} onValueChange={setBalanceCheckOperator}>
                  <SelectTrigger id="operator-balance">
                    <SelectValue placeholder="Select an operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robi">ROBI</SelectItem>
                    <SelectItem value="gp">GP</SelectItem>
                    <SelectItem value="airtel">Airtel</SelectItem>
                    <SelectItem value="banglalink">Banglalink</SelectItem>
                    <SelectItem value="skitto">Skitto</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle>Recharge Operator Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Operator</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Pin Code</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Sim Slot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator}>
                  <TableCell className="font-medium">{operator}</TableCell>
                  <TableCell>
                    <Input placeholder="Code" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Mobile" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Value" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Pin Code" />
                  </TableCell>
                  <TableCell>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="device1">Device 1</SelectItem>
                        <SelectItem value="device2">Device 2</SelectItem>
                        <SelectItem value="device3">Device 3</SelectItem>
                        <SelectItem value="device4">Device 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Sim Slot" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4 w-full">Save Settings</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Balance Check Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Operator</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Sim Slot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator}>
                  <TableCell className="font-medium">{operator}</TableCell>
                  <TableCell>
                    <Input placeholder="Mobile Number" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Code" />
                  </TableCell>
                  <TableCell>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="device1">Device 1</SelectItem>
                        <SelectItem value="device2">Device 2</SelectItem>
                        <SelectItem value="device3">Device 3</SelectItem>
                        <SelectItem value="device4">Device 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Sim Slot" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4 w-full">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
