import { useState } from "react";
import { useListInvoices, getListInvoicesQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, AlertCircle, RefreshCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Revenue() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: invoices, isLoading } = useListInvoices(
    { query: { queryKey: getListInvoicesQueryKey(), refetchInterval: 30000 } }
  );

  const filteredInvoices = invoices?.filter(invoice => 
    statusFilter === "all" ? true : invoice.status === statusFilter
  ) || [];

  const totalOutstanding = invoices
    ?.filter(i => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0) || 0;

  const totalCollectedThisMonth = invoices
    ?.filter(i => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0) || 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "overdue": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "refunded": return <RefreshCcw className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue & Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage invoices, track outstanding balances, and monitor cash flow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Collected This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${totalCollectedThisMonth.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalOutstanding.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              ${(invoices?.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0) || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>A list of all recent invoices and their status.</CardDescription>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="pl-6">Invoice ID</TableHead>
                  <TableHead>Student / Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm pl-6">INV-{invoice.id.toString().padStart(4, '0')}</TableCell>
                      <TableCell className="font-medium">{invoice.customerName}</TableCell>
                      <TableCell className="font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(invoice.issuedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(invoice.dueAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <span className="capitalize text-sm font-medium">{invoice.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Download PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No invoices found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}