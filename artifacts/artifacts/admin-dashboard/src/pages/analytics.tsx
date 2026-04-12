import { useState } from "react";
import { useGetAnalyticsOverview, useGetRevenueChart, useGetCustomerGrowth, useListInvoices, getListInvoicesQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircle2, Clock, RefreshCcw, Download, TrendingUp, TrendingDown,
  Wallet, AlertTriangle, ChevronRight, Bot, Zap, ShoppingCart,
  Lightbulb, SplitSquareHorizontal, CreditCard, Banknote, Landmark,
  ArrowUpRight, ArrowDownRight, Receipt, CalendarDays,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Paid
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Pending
        </span>
      );
    case "part-payment":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Part-payment
        </span>
      );
    case "refunded":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />Refunded
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />{status}
        </span>
      );
  }
};

const EXPENSE_ENTRIES = [
  { id: "EXP-001", category: "Salaries",        amount: 1850000, date: "2026-04-01", method: "Bank Transfer", note: "April staff payroll"             },
  { id: "EXP-002", category: "Utilities",        amount:   48500, date: "2026-04-02", method: "Direct Debit",  note: "Electricity & water bills"       },
  { id: "EXP-003", category: "Supplies",         amount:   72000, date: "2026-04-03", method: "Cash",         note: "Stationery & classroom materials" },
  { id: "EXP-004", category: "Maintenance",      amount:  155000, date: "2026-04-05", method: "Cheque",       note: "Roof repair — Block B"             },
  { id: "EXP-005", category: "Events",           amount:   95000, date: "2026-04-07", method: "Cash",         note: "Inter-house sports logistics"     },
  { id: "EXP-006", category: "Transport",        amount:   38000, date: "2026-04-08", method: "Cash",         note: "School bus fuel & servicing"      },
  { id: "EXP-007", category: "IT & Tech",        amount:  120000, date: "2026-04-09", method: "Bank Transfer", note: "Software licences & internet"     },
  { id: "EXP-008", category: "Admin & Office",   amount:   25000, date: "2026-04-10", method: "Direct Debit",  note: "Office consumables"              },
  { id: "EXP-009", category: "Salaries",         amount:  240000, date: "2026-03-31", method: "Bank Transfer", note: "March supplementary hours"       },
  { id: "EXP-010", category: "Utilities",        amount:   52300, date: "2026-03-05", method: "Direct Debit",  note: "March electricity overage"       },
  { id: "EXP-011", category: "Catering",         amount:   68000, date: "2026-04-10", method: "Cash",         note: "School feeding programme"         },
  { id: "EXP-012", category: "Security",         amount:   60000, date: "2026-04-01", method: "Bank Transfer", note: "Security firm monthly retainer"  },
];

const METHOD_ICON: Record<string, React.ElementType> = {
  "Bank Transfer": Landmark,
  "Direct Debit":  CreditCard,
  "Cash":          Banknote,
  "Cheque":        Receipt,
};

const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  "Salaries":       "bg-primary/10 text-primary border-primary/20",
  "Utilities":      "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Supplies":       "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Maintenance":    "bg-rose-500/10 text-rose-600 border-rose-500/20",
  "Events":         "bg-violet-500/10 text-violet-600 border-violet-500/20",
  "Transport":      "bg-sky-500/10 text-sky-600 border-sky-500/20",
  "IT & Tech":      "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "Admin & Office": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "Catering":       "bg-teal-500/10 text-teal-600 border-teal-500/20",
  "Security":       "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const AI_INSIGHTS = [
  {
    type: "anomaly",
    icon: AlertTriangle,
    color: "text-rose-500 bg-rose-500/10",
    title: "Maintenance spike detected",
    description: "Maintenance spending is 3.2× above the 6-month average this month (₦155,000 vs avg ₦48,500). Possible one-off repair cost.",
    severity: "high",
  },
  {
    type: "pattern",
    icon: TrendingUp,
    color: "text-amber-500 bg-amber-500/10",
    title: "Utility costs rising steadily",
    description: "Utility bills have increased by ~8% month-over-month for the past 4 months. Consider an energy audit before next term.",
    severity: "medium",
  },
  {
    type: "pattern",
    icon: SplitSquareHorizontal,
    color: "text-blue-500 bg-blue-500/10",
    title: "Salaries dominate spend (87%)",
    description: "Salary expenses account for 87% of total expenditure, consistent with sector norms but leaves thin margins for capital reinvestment.",
    severity: "info",
  },
  {
    type: "insight",
    icon: Lightbulb,
    color: "text-emerald-500 bg-emerald-500/10",
    title: "Cash payments above threshold",
    description: "29% of expense transactions are settled in cash this month. Switching to traceable methods could improve audit readiness.",
    severity: "info",
  },
  {
    type: "anomaly",
    icon: Zap,
    color: "text-violet-500 bg-violet-500/10",
    title: "IT spend up 40% vs last month",
    description: "₦120,000 logged for IT & Tech this month vs ₦86,000 last month (+40%). Verify whether one-off licence renewals are included.",
    severity: "medium",
  },
];

const MONTHLY_SUMMARY = [
  { month: "Nov", income: 3250000, expenses: 2100000 },
  { month: "Dec", income: 2980000, expenses: 1890000 },
  { month: "Jan", income: 4100000, expenses: 2350000 },
  { month: "Feb", income: 3870000, expenses: 2180000 },
  { month: "Mar", income: 4320000, expenses: 2415000 },
  { month: "Apr", income: 4560000, expenses: 2523500 },
];

const INITIAL_RECORDS = 5;

export default function AnalyticsRevenue() {
  const [statusFilter, setStatusFilter]       = useState("all");
  const [expFilter, setExpFilter]             = useState("all");
  const [showAllRecords, setShowAllRecords]   = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  const { data: overview, isLoading: overviewLoading } = useGetAnalyticsOverview({ query: { refetchInterval: 30000 } });
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueChart({ months: 12 }, { query: { refetchInterval: 30000 } });
  const { data: growthData, isLoading: growthLoading } = useGetCustomerGrowth({ query: { refetchInterval: 30000 } });
  const { data: invoices, isLoading: invoicesLoading } = useListInvoices(
    { query: { queryKey: getListInvoicesQueryKey(), refetchInterval: 30000 } }
  );

  const filteredInvoices = invoices?.filter(inv =>
    statusFilter === "all" ? true : inv.status === statusFilter
  ) ?? [];

  const displayedRecords = showAllRecords
    ? filteredInvoices
    : filteredInvoices.slice(0, INITIAL_RECORDS);

  const expCategories = ["all", ...Array.from(new Set(EXPENSE_ENTRIES.map(e => e.category)))];
  const filteredExpenses = expFilter === "all"
    ? EXPENSE_ENTRIES
    : EXPENSE_ENTRIES.filter(e => e.category === expFilter);
  const displayedExpenses = showAllExpenses ? filteredExpenses : filteredExpenses.slice(0, 5);

  const totalCollected   = invoices?.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0) ?? 0;
  const totalOutstanding = invoices?.filter(i => i.status === "pending" || i.status === "part-payment").reduce((s, i) => s + i.amount, 0) ?? 0;
  const totalRefunded    = invoices?.filter(i => i.status === "refunded").reduce((s, i) => s + i.amount, 0) ?? 0;

  const currentMonth  = MONTHLY_SUMMARY[MONTHLY_SUMMARY.length - 1];
  const previousMonth = MONTHLY_SUMMARY[MONTHLY_SUMMARY.length - 2];
  const incomeGrowth   = (((currentMonth.income - previousMonth.income) / previousMonth.income) * 100).toFixed(1);
  const expenseGrowth  = (((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100).toFixed(1);
  const netBalance     = currentMonth.income - currentMonth.expenses;
  const prevNetBalance = previousMonth.income - previousMonth.expenses;
  const netGrowth      = (((netBalance - prevNetBalance) / prevNetBalance) * 100).toFixed(1);

  const annualIncome   = MONTHLY_SUMMARY.reduce((s, m) => s + m.income, 0);
  const annualExpenses = MONTHLY_SUMMARY.reduce((s, m) => s + m.expenses, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Revenue</h1>
        <p className="text-muted-foreground mt-2">
          Financial performance, payment trends, and billing records in one view.
        </p>
      </div>

      {/* ─── Monthly Summary Cards ─── */}
      <div>
        <h2 className="text-base font-semibold mb-3">Monthly Summary — April 2026</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary">Income This Month</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₦{currentMonth.income.toLocaleString()}</div>
              <div className="flex items-center text-xs mt-1">
                {parseFloat(incomeGrowth) >= 0 ? (
                  <span className="text-emerald-500 flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" />+{incomeGrowth}%</span>
                ) : (
                  <span className="text-destructive flex items-center"><ArrowDownRight className="mr-1 h-3 w-3" />{incomeGrowth}%</span>
                )}
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expenses This Month</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{currentMonth.expenses.toLocaleString()}</div>
              <div className="flex items-center text-xs mt-1">
                {parseFloat(expenseGrowth) <= 0 ? (
                  <span className="text-emerald-500 flex items-center"><ArrowDownRight className="mr-1 h-3 w-3" />{expenseGrowth}%</span>
                ) : (
                  <span className="text-rose-500 flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" />+{expenseGrowth}%</span>
                )}
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₦{netBalance.toLocaleString()}</div>
              <div className="flex items-center text-xs mt-1">
                {parseFloat(netGrowth) >= 0 ? (
                  <span className="text-emerald-500 flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" />+{netGrowth}%</span>
                ) : (
                  <span className="text-destructive flex items-center"><ArrowDownRight className="mr-1 h-3 w-3" />{netGrowth}%</span>
                )}
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Fees</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? <Skeleton className="h-8 w-28" /> : (
                <div className="text-2xl font-bold">₦{totalOutstanding.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Pending + part-payments</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Annual Summary ─── */}
      <div>
        <h2 className="text-base font-semibold mb-3">Annual Summary — 2025/2026</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Annual Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₦{annualIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">6-month rolling total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annual Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₦{annualExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">6-month rolling total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Refunded Fees</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? <Skeleton className="h-9 w-32" /> : (
                <div className="text-3xl font-bold text-muted-foreground">₦{totalRefunded.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Total refunds processed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Key Metrics ─── */}
      {overviewLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-28" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-24 mb-1" /><Skeleton className="h-3 w-32" /></CardContent>
            </Card>
          ))}
        </div>
      ) : overview ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annual Revenue (ARR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{((overview.totalRevenue ?? 0) * 12).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on current subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalUsers ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Across {overview.activeCustomers ?? 0} active accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Revenue / User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(overview.avgRevenuePerUser ?? 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Target: ₦{Math.round((overview.avgRevenuePerUser ?? 0) * 1.15).toLocaleString()} by Q4</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Trial Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.trialConversionRate ?? 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">30-day trailing average</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* ─── Charts ─── */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>6-month income and spending comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_SUMMARY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v / 1000000}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: 8 }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [`₦${v.toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="income"   name="Income"   fill="hsl(var(--primary))"    radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} opacity={0.75} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>12-month MRR trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-[260px] flex items-center justify-center">
                <Skeleton className="h-[220px] w-full" />
              </div>
            ) : revenueData ? (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short" })}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₦${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: 8 }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(v: number) => [`₦${v.toLocaleString()}`, "MRR"]}
                    />
                    <Area type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#mrrGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Enrolment Dynamics</CardTitle>
            <CardDescription>New enrolments vs departures over time</CardDescription>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <div className="h-[260px] flex items-center justify-center">
                <Skeleton className="h-[220px] w-full" />
              </div>
            ) : growthData ? (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short" })}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: 8 }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    />
                    <Legend />
                    <Bar dataKey="new"     name="New Enrolments" fill="hsl(var(--chart-3))"    radius={[4, 4, 0, 0]} />
                    <Bar dataKey="churned" name="Departures"      fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* ─── AI Spending Insights ─── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">AI Spending Insights</CardTitle>
              <CardDescription>Patterns and anomalies detected from your financial data</CardDescription>
            </div>
            <Badge variant="outline" className="ml-auto text-xs font-medium text-primary border-primary/30 bg-primary/5">
              {AI_INSIGHTS.filter(i => i.type === "anomaly").length} anomalies
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {AI_INSIGHTS.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${insight.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold leading-tight">{insight.title}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 font-medium ${
                        insight.severity === "high"
                          ? "text-rose-600 border-rose-500/30 bg-rose-500/5"
                          : insight.severity === "medium"
                          ? "text-amber-600 border-amber-500/30 bg-amber-500/5"
                          : "text-muted-foreground"
                      }`}
                    >
                      {insight.severity === "high" ? "High" : insight.severity === "medium" ? "Medium" : "Info"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ─── Expense Entries ─── */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              Expense Entries
            </CardTitle>
            <CardDescription>All logged school expenditures with category and payment method.</CardDescription>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={expFilter} onValueChange={(v) => { setExpFilter(v); setShowAllExpenses(false); }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {expCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-border bg-muted/40">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Ref</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Payment Method</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedExpenses.map((exp) => {
                  const MethodIcon = METHOD_ICON[exp.method] ?? CreditCard;
                  const catColor = EXPENSE_CATEGORY_COLORS[exp.category] ?? "bg-muted text-muted-foreground border-border";
                  return (
                    <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{exp.id}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${catColor}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold tabular-nums">₦{exp.amount.toLocaleString()}</td>
                      <td className="px-6 py-3.5 text-muted-foreground text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {format(new Date(exp.date), "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <MethodIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {exp.method}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-muted-foreground text-xs max-w-[200px] truncate">{exp.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!showAllExpenses && filteredExpenses.length > 5 && (
            <div className="px-6 py-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3"
                onClick={() => setShowAllExpenses(true)}
              >
                See all {filteredExpenses.length} expenses
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Payment Records ─── */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>All invoices and their current settlement status.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:w-[200px]">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setShowAllRecords(false); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="part-payment">Part-payment</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => {
                if (!invoices || invoices.length === 0) return;
                const header = "Invoice ID,Student / Account,Amount,Issued,Due,Status";
                const rows = filteredInvoices.map(inv =>
                  `"INV-${inv.id.toString().padStart(4, "0")}","${inv.customerName}",${inv.amount},"${format(new Date(inv.issuedAt), "MMM d yyyy")}","${format(new Date(inv.dueAt), "MMM d yyyy")}","${inv.status}"`
                );
                const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "payment-records.csv"; a.click(); URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
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
                {invoicesLoading ? (
                  Array.from({ length: INITIAL_RECORDS }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : displayedRecords.length > 0 ? (
                  displayedRecords.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground pl-6">
                        INV-{invoice.id.toString().padStart(4, "0")}
                      </TableCell>
                      <TableCell className="font-medium">{invoice.customerName}</TableCell>
                      <TableCell className="font-semibold tabular-nums">₦{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(invoice.issuedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(invoice.dueAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
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
                      No records match the selected filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {!showAllRecords && filteredInvoices.length > INITIAL_RECORDS && (
            <div className="px-6 py-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3"
                onClick={() => setShowAllRecords(true)}
              >
                See all {filteredInvoices.length} records
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
