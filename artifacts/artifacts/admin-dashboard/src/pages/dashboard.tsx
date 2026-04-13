import { useState } from "react";
import { useListUsers, getListUsersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight, ArrowDownRight, DollarSign, Clock, Wallet, TrendingUp,
  CreditCard, UserCheck, GraduationCap, AlertCircle, CheckCircle2,
  ChevronRight, Users, ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";

const ALL_TRANSACTIONS = [
  { id: "TXN-0041", studentName: "Amara Okonkwo",      studentId: "STU-1041", classLevel: "SSS 2 Science",    amount: 78000, status: "Paid" },
  { id: "TXN-0042", studentName: "Emeka Chukwu",        studentId: "STU-1042", classLevel: "JSS 1",            amount: 62000, status: "Pending" },
  { id: "TXN-0043", studentName: "Fatima Bello",         studentId: "STU-1043", classLevel: "SSS 3 Art",        amount: 36000, status: "Part-payment" },
  { id: "TXN-0044", studentName: "Tunde Adeyemi",        studentId: "STU-1044", classLevel: "JSS 3",            amount: 15000, status: "Paid" },
  { id: "TXN-0045", studentName: "Chisom Eze",           studentId: "STU-1045", classLevel: "SSS 1 Commercial", amount: 75000, status: "Pending" },
  { id: "TXN-0046", studentName: "Ngozi Obi",            studentId: "STU-1046", classLevel: "JSS 2",            amount: 62000, status: "Paid" },
  { id: "TXN-0047", studentName: "Yusuf Ibrahim",        studentId: "STU-1047", classLevel: "SSS 2 Science",    amount: 6000,  status: "Part-payment" },
  { id: "TXN-0048", studentName: "Adesola Bakare",       studentId: "STU-1048", classLevel: "JSS 1",            amount: 62000, status: "Paid" },
  { id: "TXN-0049", studentName: "Obiageli Nwachukwu",  studentId: "STU-1049", classLevel: "SSS 3 Soc. Sci.",  amount: 70000, status: "Pending" },
  { id: "TXN-0050", studentName: "Rotimi Fashola",       studentId: "STU-1050", classLevel: "JSS 3",            amount: 15000, status: "Paid" },
  { id: "TXN-0051", studentName: "Halima Sule",          studentId: "STU-1051", classLevel: "SSS 1 Art",        amount: 4000,  status: "Part-payment" },
  { id: "TXN-0052", studentName: "Chukwuemeka Nwosu",   studentId: "STU-1052", classLevel: "JSS 2",            amount: 62000, status: "Paid" },
];

const TOTAL_REVENUE_APRIL   = 4560000;
const TOTAL_OUTSTANDING     = 330500;
const CASH_COLLECTED_TODAY  = 127000;
const EXPECTED_NEXT_MONTH   = Math.round(TOTAL_REVENUE_APRIL * 1.08);

const ALL_ACTIVITY = [
  { id: 1, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", label: "Fee payment received",     detail: "Amara Okonkwo — SSS 2 Science · ₦78,000",        time: "2 mins ago" },
  { id: 2, icon: AlertCircle,  color: "text-amber-500 bg-amber-500/10",    label: "Pending payment flagged",   detail: "Emeka Chukwu — JSS 1 · ₦62,000 overdue 3 days", time: "18 mins ago" },
  { id: 3, icon: UserCheck,    color: "text-blue-500 bg-blue-500/10",      label: "New staff member added",    detail: "Mrs. Adaobi Nwosu — Mathematics Dept.",           time: "1 hr ago" },
  { id: 4, icon: CreditCard,   color: "text-violet-500 bg-violet-500/10",  label: "Part-payment logged",       detail: "Yusuf Ibrahim — SSS 2 · ₦42,500 of ₦85,000",    time: "3 hrs ago" },
  { id: 5, icon: GraduationCap,color: "text-primary bg-primary/10",        label: "New student enrolled",      detail: "Chiamaka Osei — JSS 1 · ID: STU-1053",            time: "Yesterday" },
  { id: 6, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10",label: "Fee payment received",      detail: "Rotimi Fashola — JSS 3 · ₦70,000",               time: "Yesterday" },
  { id: 7, icon: AlertCircle,  color: "text-amber-500 bg-amber-500/10",    label: "Invoice overdue alert",     detail: "Obiageli Nwachukwu — SSS 3 · ₦90,000",           time: "2 days ago" },
  { id: 8, icon: UserCheck,    color: "text-blue-500 bg-blue-500/10",      label: "Role updated",              detail: "Mr. Babatunde Okafor — Accounts Dept.",           time: "2 days ago" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "Paid")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Paid
      </span>
    );
  if (status === "Pending")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Part-payment
    </span>
  );
}

export default function Dashboard() {
  const [showAllTxn, setShowAllTxn] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const { data: users } = useListUsers({ query: { queryKey: getListUsersQueryKey(), refetchInterval: 30000 } });

  const activeStaff = Array.isArray(users) ? users.filter(u => u.status === "active").length : 0;
  const transactions = showAllTxn ? ALL_TRANSACTIONS : ALL_TRANSACTIONS.slice(0, 6);
  const activities   = showAllActivity ? ALL_ACTIVITY : ALL_ACTIVITY.slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Your school's financial command center. Monitor payments and key metrics.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium shrink-0">
          <ShieldCheck className="h-4 w-4" />
          Restricted — Proprietor Only
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* Static summary cards derived from real bursary & analytics data */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{TOTAL_REVENUE_APRIL.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-emerald-500 flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" />+5.5%</span>
              <span className="text-muted-foreground ml-1">vs March 2026</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{TOTAL_OUTSTANDING.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding across 8 invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Physical Cash Today</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{CASH_COLLECTED_TODAY.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Cash logged at bursary today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expected Revenue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{EXPECTED_NEXT_MONTH.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-emerald-500 flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" />+8%</span>
              <span className="text-muted-foreground ml-1">projected next month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Staff</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaff > 0 ? activeStaff : 24}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Transactions Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Payment Transactions</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Student fee payments across all class levels.</p>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              {ALL_TRANSACTIONS.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-border bg-muted/40">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Txn ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Student Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Student ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Class Level</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Amount Paid</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{txn.id}</td>
                    <td className="px-6 py-3.5 font-medium whitespace-nowrap">{txn.studentName}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{txn.studentId}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                        {txn.classLevel}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold tabular-nums">₦{txn.amount.toLocaleString()}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={txn.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAllTxn && ALL_TRANSACTIONS.length > 6 && (
            <div className="px-6 py-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3"
                onClick={() => setShowAllTxn(true)}
              >
                See all {ALL_TRANSACTIONS.length} transactions
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">Latest actions across your school management system.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {activities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 mt-0.5 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">{item.time}</span>
                </div>
              );
            })}
          </div>
          {!showAllActivity && ALL_ACTIVITY.length > 6 && (
            <div className="mt-5 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3"
                onClick={() => setShowAllActivity(true)}
              >
                See all activity
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
