'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { updateUserData } from '@/actions/user';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/user';

export default function ManageResellerPage() {
  const [resellers, setResellers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onUsersUpdate(
      (allUsers) => {
        const resellerUsers = allUsers.filter(user => user.role === 'reseller');
        setResellers(resellerUsers);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError("Failed to load resellers. Please check permissions.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser(user);
    setNewBalance(user.balance?.toString() ?? '0');
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      const balanceValue = parseFloat(newBalance);
      if (isNaN(balanceValue)) {
        throw new Error("Invalid balance value.");
      }
      const result = await updateUserData(selectedUser.uid, { balance: balanceValue });
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setIsEditDialogOpen(false);
        setSelectedUser(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update reseller.";
      toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

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
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-destructive text-center py-8">{error}</div>;
    }

    if (resellers.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No resellers found.
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Joined On</TableHead>
            <TableHead>UID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resellers.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>${user.balance?.toFixed(2) ?? '0.00'}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
              <TableCell className="text-muted-foreground">{user.uid}</TableCell>
              <TableCell className="text-right">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(user)}>
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
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
          Manage Resellers
        </h1>
        <p className="text-muted-foreground">
          View and manage reseller accounts.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>All Resellers</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Reseller</DialogTitle>
                <DialogDescription>
                    Update information for {selectedUser?.name}.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="balance" className="text-right">
                        Wallet Balance
                    </Label>
                    <Input
                      id="balance"
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="col-span-3"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
