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
import { getUssdHistory } from '@/actions/bipsms';
import { onUssdHistoryUpdate } from '@/services/operator-settings';
import { Skeleton } from '@/components/ui/skeleton';
import type { UssdHistoryItem } from '@/types/operator-settings';
import { useToast } from "@/hooks/use-toast";

export default function RechargeHistoryPage() {
  const [history, setHistory] = useState<UssdHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onUssdHistoryUpdate((data) => {
      setHistory(data);
      if (data.length === 0 && !syncing) {
        setError("No history found in Firestore. Click 'Sync History' to fetch from the API.");
      } else {
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncing]);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setLoading(true);
    try {
      await getUssdHistory({ limit: 200, page: 1 });
      toast({ title: "Success", description: "History synced successfully." });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during sync.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Sync Error", description: errorMessage });
    } finally {
      setSyncing(false);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(history.length / rowsPerPage);

  const paginatedData = history.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge variant="default">Success</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Recharge History
        </h1>
        <p className="text-muted-foreground">
          View USSD request history from Firestore.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All USSD Requests</CardTitle>
          <Button onClick={handleSync} disabled={syncing || loading}>
            {syncing ? 'Syncing...' : 'Sync History'}
          </Button>
        </CardHeader>
        <CardContent>
          {loading && !syncing ? (
             <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-8">{error}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>SIM</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.response}</TableCell>
                      <TableCell>{item.device?.slice(-6) ?? 'N/A'}</TableCell>
                      <TableCell>{item.sim}</TableCell>
                      <TableCell>{new Date(item.created * 1000).toLocaleString()}</TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">No history to display.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {paginatedData.length > 0 && (
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
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
