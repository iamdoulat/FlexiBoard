'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RechargeHistoryItem = {
  id: number;
  mobileNumber: string;
  message: string;
  time: string;
  status: "Success" | "Failed";
};

export default function RechargeHistoryPage() {
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      mobileNumber: `01${[3, 6, 7, 8, 9][Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0')}`,
      message: `Recharge of BDT ${Math.floor(Math.random() * 991) + 10} successful.`,
      time: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toLocaleString(),
      status: (Math.random() > 0.1 ? "Success" : "Failed") as "Success" | "Failed",
    }));
    setRechargeHistory(mockData);
  }, []);

  const totalPages = Math.ceil(rechargeHistory.length / rowsPerPage);

  const paginatedData = rechargeHistory.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };


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
          <CardTitle>All Recharges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.mobileNumber}</TableCell>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>
                     <Badge variant={item.status === "Success" ? "default" : "destructive"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <div className="flex items-center justify-end space-x-2 pt-4">
             <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages > 0 ? totalPages : 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
