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
import { onUsersUpdate } from '@/services/user';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/types/user';

export default function ManageUserPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onUsersUpdate(
      (data) => {
        setUsers(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError("Failed to load users. Please check permissions.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'user':
        return <Badge variant="secondary">User</Badge>;
      case 'reseller':
        return <Badge variant="default">Reseller</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-destructive text-center py-8">{error}</div>;
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No users found.
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined On</TableHead>
            <TableHead>UID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{new Date(user.createdAt as Date).toLocaleString()}</TableCell>
              <TableCell className="text-muted-foreground">{user.uid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Manage Users
        </h1>
        <p className="text-muted-foreground">
          View and manage user accounts.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
