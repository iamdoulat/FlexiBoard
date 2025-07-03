'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from '@/components/ui/skeleton';
import { onTransactionsUpdate } from '@/services/transaction';
import type { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';

export default function TrxHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onTransactionsUpdate(
      (data) => {
        setTransactions(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError("Failed to load transaction history. Check permissions.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const paginatedData = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getTypeBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'credit':
        return <Badge variant="default">Credit</Badge>;
      case 'debit':
        return <Badge variant="destructive">Debit</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-destructive text-center py-8">{error}</div>;
    }

    if (paginatedData.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No transaction history found.
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Old Balance</TableHead>
              <TableHead>New Balance</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((trx) => (
              <TableRow key={trx.id}>
                <TableCell className="font-medium">
                  <div>{trx.userName}</div>
                  <div className="text-xs text-muted-foreground">{trx.userEmail}</div>
                </TableCell>
                <TableCell>{getTypeBadge(trx.type)}</TableCell>
                <TableCell>${trx.amount.toFixed(2)}</TableCell>
                <TableCell>${trx.oldBalance.toFixed(2)}</TableCell>
                <TableCell>${trx.newBalance.toFixed(2)}</TableCell>
                <TableCell>{new Date(trx.createdAt as Date).toLocaleString()}</TableCell>
                <TableCell>{trx.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 pt-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
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
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          View all wallet balance transactions.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}