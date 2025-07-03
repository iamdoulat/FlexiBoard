'use client';

import { useState, useEffect, FormEvent } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { 
  onRechargeSettingsUpdate, 
  onBalanceCheckSettingsUpdate,
  saveRechargeSetting,
  saveBalanceCheckSetting
} from "@/services/operator-settings";
import { checkBalance, getUssdHistory } from "@/actions/bipsms";
import type { RechargeSetting, BalanceCheckSetting } from "@/types/operator-settings";

type UssdHistoryItem = {
  id: number;
  device: string;
  sim: number;
  code: string;
  response: string;
  status: string;
  created: number;
};


export default function OperatorSettingsPage() {
  const { toast } = useToast();
  const [rechargeMobileNumber, setRechargeMobileNumber] = useState("");
  const [rechargeOperator, setRechargeOperator] = useState("");
  const [balanceCheckOperator, setBalanceCheckOperator] = useState("");

  const [rechargeSettings, setRechargeSettings] = useState<Record<string, Partial<RechargeSetting>>>({});
  const [balanceCheckSettings, setBalanceCheckSettings] = useState<Record<string, Partial<BalanceCheckSetting>>>({});
  const [isRechargeSaving, setIsRechargeSaving] = useState(false);
  const [isBalanceCheckSaving, setIsBalanceCheckSaving] = useState(false);
  const [isBalanceChecking, setIsBalanceChecking] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>("USSD results will be shown here.");

  const fetchHistory = async () => {
    try {
      const historyData = await getUssdHistory({ limit: 10 });
      if (historyData && Array.isArray(historyData.data)) {
        const completedItems = historyData.data
          .filter((item: UssdHistoryItem) => item.status === 'completed')
          .slice(0, 2);
        
        if (completedItems.length > 0) {
            const formattedResult = completedItems.map(item => {
              const cleanResponse = item.response.replace(/\r|\n/g, ' ').trim();
              return `ID: ${item.id}, Code: ${item.code}, Response: ${cleanResponse}, Status: ${item.status}`;
            }).join('\n\n');
            setResultMessage(formattedResult);
        } else {
            setResultMessage("No recent completed requests found.");
        }
      } else {
        setResultMessage("No history data received.");
      }
    } catch (error) {
      console.error("Failed to fetch USSD history", error);
      const errorMessage = error instanceof Error ? error.message : "Could not fetch history.";
      setResultMessage(`Error fetching history: ${errorMessage}`);
      toast({ variant: "destructive", title: "History Error", description: errorMessage });
    }
  };

  useEffect(() => {
    const unsubscribeRecharge = onRechargeSettingsUpdate(setRechargeSettings);
    const unsubscribeBalanceCheck = onBalanceCheckSettingsUpdate(setBalanceCheckSettings);

    fetchHistory();

    return () => {
      unsubscribeRecharge();
      unsubscribeBalanceCheck();
    };
  }, []);

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

  const handleRechargeSettingChange = (operator: string, field: keyof RechargeSetting, value: string) => {
    setRechargeSettings(prev => ({
      ...prev,
      [operator.toUpperCase()]: {
        ...prev[operator.toUpperCase()],
        [field]: value
      }
    }));
  };

  const handleBalanceCheckSettingChange = (operator: string, field: keyof BalanceCheckSetting, value: string) => {
    setBalanceCheckSettings(prev => ({
      ...prev,
      [operator.toUpperCase()]: {
        ...prev[operator.toUpperCase()],
        [field]: value
      }
    }));
  };

  const handleSaveRechargeSettings = async () => {
    setIsRechargeSaving(true);
    try {
      const savePromises = Object.entries(rechargeSettings).map(([operatorId, settings]) => 
        saveRechargeSetting(operatorId, settings)
      );
      await Promise.all(savePromises);
      toast({ title: "Success", description: "Recharge settings saved successfully." });
    } catch (error) {
      console.error("Error saving recharge settings:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save recharge settings." });
    } finally {
      setIsRechargeSaving(false);
    }
  };

  const handleSaveBalanceCheckSettings = async () => {
    setIsBalanceCheckSaving(true);
    try {
      const savePromises = Object.entries(balanceCheckSettings).map(([operatorId, settings]) => 
        saveBalanceCheckSetting(operatorId, settings)
      );
      await Promise.all(savePromises);
      toast({ title: "Success", description: "Balance check settings saved successfully." });
    } catch (error) {
      console.error("Error saving balance check settings:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save balance check settings." });
    } finally {
      setIsBalanceCheckSaving(false);
    }
  };
  
  const handleBalanceCheckSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!balanceCheckOperator) {
      toast({ variant: "destructive", title: "Error", description: "Please select an operator." });
      return;
    }

    setIsBalanceChecking(true);
    setResultMessage("Sending request...");

    try {
      const operatorId = balanceCheckOperator.toUpperCase();
      const settings = balanceCheckSettings[operatorId];
      
      if (!settings) {
        throw new Error(`Settings for ${balanceCheckOperator} not found.`);
      }

      const result = await checkBalance(settings);
      
      toast({ title: "Success", description: result.message || "Balance check request sent." });
      setResultMessage("Request sent. Waiting for response...");

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResultMessage("Fetching latest results...");
      await fetchHistory();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error checking balance:", error);
      setResultMessage(`Error: ${errorMessage}`);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsBalanceChecking(false);
    }
  };


  const operators = ["ROBI", "GP", "Airtel", "Banglalink", "Skitto"];

  const devices = [
    { label: "Device 1", value: process.env.NEXT_PUBLIC_DEVICE_1_ID || "" },
    { label: "Device 2", value: process.env.NEXT_PUBLIC_DEVICE_2_ID || "" },
    { label: "Device 3", value: process.env.NEXT_PUBLIC_DEVICE_3_ID || "" },
    { label: "Device 4", value: process.env.NEXT_PUBLIC_DEVICE_4_ID || "" },
  ].filter(d => d.value);

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
            <form className="space-y-4" onSubmit={handleBalanceCheckSubmit}>
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
              <Button type="submit" className="w-full" disabled={isBalanceChecking}>
                {isBalanceChecking ? 'Checking...' : 'Balance Check'}
              </Button>
            </form>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Result</h3>
              <div className="rounded-md border bg-muted p-4 min-h-[120px]">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {resultMessage}
                </pre>
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
                    <Input placeholder="Code" value={rechargeSettings[operator.toUpperCase()]?.code || ''} onChange={(e) => handleRechargeSettingChange(operator, 'code', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Mobile" value={rechargeSettings[operator.toUpperCase()]?.mobile || ''} onChange={(e) => handleRechargeSettingChange(operator, 'mobile', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Value" value={rechargeSettings[operator.toUpperCase()]?.value || ''} onChange={(e) => handleRechargeSettingChange(operator, 'value', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Pin Code" value={rechargeSettings[operator.toUpperCase()]?.pinCode || ''} onChange={(e) => handleRechargeSettingChange(operator, 'pinCode', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Select value={rechargeSettings[operator.toUpperCase()]?.device || ''} onValueChange={(value) => handleRechargeSettingChange(operator, 'device', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map((device) => (
                          <SelectItem key={device.value} value={device.value}>
                            {device.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Sim Slot" value={rechargeSettings[operator.toUpperCase()]?.simSlot || ''} onChange={(e) => handleRechargeSettingChange(operator, 'simSlot', e.target.value)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4 w-full" onClick={handleSaveRechargeSettings} disabled={isRechargeSaving}>
            {isRechargeSaving ? 'Saving...' : 'Save Settings'}
          </Button>
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
                    <Input placeholder="Mobile Number" value={balanceCheckSettings[operator.toUpperCase()]?.mobileNumber || ''} onChange={(e) => handleBalanceCheckSettingChange(operator, 'mobileNumber', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Code" value={balanceCheckSettings[operator.toUpperCase()]?.code || ''} onChange={(e) => handleBalanceCheckSettingChange(operator, 'code', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Select value={balanceCheckSettings[operator.toUpperCase()]?.device || ''} onValueChange={(value) => handleBalanceCheckSettingChange(operator, 'device', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map((device) => (
                          <SelectItem key={device.value} value={device.value}>
                            {device.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Sim Slot" value={balanceCheckSettings[operator.toUpperCase()]?.simSlot || ''} onChange={(e) => handleBalanceCheckSettingChange(operator, 'simSlot', e.target.value)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4 w-full" onClick={handleSaveBalanceCheckSettings} disabled={isBalanceCheckSaving}>
            {isBalanceCheckSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
