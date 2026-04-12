import { useParams, Link } from "wouter";
import { 
  useGetCustomer, 
  getGetCustomerQueryKey,
  useListInvoices,
  getListInvoicesQueryKey
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { 
  ArrowLeft, Building2, Mail, CreditCard, Activity, Calendar, 
  Download, MoreHorizontal, CheckCircle2, Clock, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";

export default function CustomerDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: customer, isLoading } = useGetCustomer(id, { 
    query: { enabled: !!id, queryKey: getGetCustomerQueryKey(id) } 
  });

  const { data: invoices, isLoading: invoicesLoading } = useListInvoices({
    query: { queryKey: getListInvoicesQueryKey() }
  });

  // In a real app we'd filter via API parameter, but filtering client side here since endpoint doesn't support customerId
  const customerInvoices = invoices?.filter(inv => inv.customerId === id) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-10 w-[250px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[300px] md:col-span-1" />
          <Skeleton className="h-[300px] md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-2xl font-bold">Customer Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-4">The customer you are looking for does not exist or has been deleted.</p>
        <Link href="/customers">
          <Button>Back to Customers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Edit Customer</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Profile</CardTitle>
              <Badge 
                variant={customer.status === "active" ? "default" : customer.status === "churned" ? "destructive" : "secondary"}
                className="capitalize"
              >
                {customer.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarImage src={customer.avatarUrl || undefined} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {customer.name.charAt(0)}{customer.name.split(' ')[1]?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Building2 className="h-3.5 w-3.5" /> {customer.company}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs font-medium">Email</span>
                  <span>{customer.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs font-medium">Plan</span>
                  <span className="capitalize font-medium">{customer.plan}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-primary/80 text-xs font-medium">MRR</span>
                  <span className="font-bold">${customer.mrr.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs font-medium">Customer Since</span>
                  <span>{format(new Date(customer.joinedAt), "MMMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Billing history for this customer.</CardDescription>
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : customerInvoices.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-xs">INV-{invoice.id.toString().padStart(4, '0')}</TableCell>
                        <TableCell className="text-sm">{format(new Date(invoice.issuedAt), "MMM d, yyyy")}</TableCell>
                        <TableCell className="font-medium">${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {invoice.status === "paid" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                            {invoice.status === "pending" && <Clock className="h-3.5 w-3.5 text-amber-500" />}
                            {invoice.status === "overdue" && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                            <span className="capitalize text-sm font-medium">{invoice.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">
                            <Download className="mr-2 h-3 w-3" /> PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/20">
                <CreditCard className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium">No invoices found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  This customer doesn't have any billing history yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}