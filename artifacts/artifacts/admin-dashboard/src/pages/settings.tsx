import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Save, School, ShieldCheck, Bell, CreditCard, Lock, Globe, UserCog,
  GraduationCap, BookOpen, AlertCircle, Fingerprint,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [receiptAuto, setReceiptAuto] = useState(true);
  const [notifNewEnrol, setNotifNewEnrol] = useState(true);
  const [notifFeeDefault, setNotifFeeDefault] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifPaySuccess, setNotifPaySuccess] = useState(true);
  const [notifBusExpiry, setNotifBusExpiry] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings saved", description: "Your preferences have been updated successfully." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your school profile, security, and system preferences.
        </p>
      </div>

      <Tabs defaultValue="school" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[580px]">
          <TabsTrigger value="school" className="gap-1.5">
            <School className="h-3.5 w-3.5" />School
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />Notifications
          </TabsTrigger>
          <TabsTrigger value="licence" className="gap-1.5">
            <CreditCard className="h-3.5 w-3.5" />Licence
          </TabsTrigger>
        </TabsList>

        {/* ── School Profile ── */}
        <TabsContent value="school" className="space-y-6 mt-6">
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" />
                  School Profile
                </CardTitle>
                <CardDescription>
                  Update your school's identity and operational details used across the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input id="schoolName" defaultValue="Metrix School System" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolId">School System ID</Label>
                    <Input id="schoolId" defaultValue="metrix-edu-prod-01" disabled className="bg-muted/50 font-mono text-sm" />
                    <p className="text-xs text-muted-foreground">System-assigned. Cannot be changed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rcNumber">CAC / School Reg. No.</Label>
                    <Input id="rcNumber" defaultValue="EDU-NGS-0049221" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principal">Principal / Proprietor Name</Label>
                    <Input id="principal" defaultValue="Dr. Emmanuel Okafor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bursarName">Bursary Officer</Label>
                    <Input id="bursarName" defaultValue="Mrs. Adaobi Nwosu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">School Phone</Label>
                    <Input id="phone" defaultValue="+234 801 234 5678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email</Label>
                    <Input id="email" type="email" defaultValue="bursary@metrixschool.edu.ng" />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="africa-lagos">
                      <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa-lagos">Africa/Lagos (WAT, UTC+1)</SelectItem>
                        <SelectItem value="africa-abuja">Africa/Abuja (WAT, UTC+1)</SelectItem>
                        <SelectItem value="europe-lon">Europe/London (GMT+1)</SelectItem>
                        <SelectItem value="america-et">America/New York (ET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="ngn">
                      <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngn">NGN (₦) — Nigerian Naira</SelectItem>
                        <SelectItem value="usd">USD ($) — US Dollar</SelectItem>
                        <SelectItem value="gbp">GBP (£) — British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session">Current Academic Session</Label>
                    <Select defaultValue="2025-2026">
                      <SelectTrigger id="session"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-2026">2025/2026</SelectItem>
                        <SelectItem value="2024-2025">2024/2025</SelectItem>
                        <SelectItem value="2026-2027">2026/2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="term">Current Term</Label>
                    <Select defaultValue="term1">
                      <SelectTrigger id="term"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="term1">Term 1 (Sep – Dec)</SelectItem>
                        <SelectItem value="term2">Term 2 (Jan – Apr)</SelectItem>
                        <SelectItem value="term3">Term 3 (May – Jul)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />Save School Profile
                </Button>
              </CardFooter>
            </Card>
          </form>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Receipt & Payment Defaults
              </CardTitle>
              <CardDescription>Control how payments and receipts behave across the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-print Receipt on Payment</Label>
                  <p className="text-sm text-muted-foreground">Automatically open the print dialog after every authorized payment.</p>
                </div>
                <Switch checked={receiptAuto} onCheckedChange={setReceiptAuto} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                <Input id="receiptFooter" defaultValue="This receipt is issued by Metrix School System. Any alteration renders it null and void." />
                <p className="text-xs text-muted-foreground">Appears at the bottom of every printed receipt.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsGateway">SMS Gateway (Sender ID)</Label>
                <Input id="smsGateway" defaultValue="METRIX-SCH" />
                <p className="text-xs text-muted-foreground">The name parents see on SMS alerts from the bursary.</p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Defaults saved" })}>
                <Save className="h-4 w-4" />Save Defaults
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ── Security ── */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Access & Authentication
              </CardTitle>
              <CardDescription>Control how staff members log in and authorize payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />Two-Factor Authentication (2FA)
                  </Label>
                  <p className="text-sm text-muted-foreground">Require OTP in addition to password for all staff logins.</p>
                </div>
                <Switch checked={twoFA} onCheckedChange={setTwoFA} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-1.5">
                    <Fingerprint className="h-3.5 w-3.5" />Biometric Payment Authorization
                  </Label>
                  <p className="text-sm text-muted-foreground">Require biometric scan before any payment is processed in the Bursary.</p>
                </div>
                <Switch checked={biometric} onCheckedChange={setBiometric} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="sessionTimeout"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Staff are automatically signed out after this period of inactivity.</p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2" onClick={() => toast({ title: "Security settings saved" })}>
                <ShieldCheck className="h-4 w-4" />Save Security Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                Role Access Control
              </CardTitle>
              <CardDescription>Define which roles can access restricted areas of the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { role: "Proprietor",   access: ["All Modules", "Bus Pass Register", "Team Management", "Settings"] },
                  { role: "Admin",        access: ["Dashboard", "Bursary Accounts", "Bus Pass Register", "Support Desk"] },
                  { role: "Bursary",      access: ["Bursary Accounts", "School Store", "Analytics & Revenue"] },
                  { role: "Staff",        access: ["Dashboard", "Student Directory"] },
                ].map(({ role, access }) => (
                  <div key={role} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-28 shrink-0">
                      <span className="text-sm font-semibold">{role}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {access.map(a => (
                        <Badge key={a} variant="outline" className="text-xs font-normal">{a}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                System Notifications
              </CardTitle>
              <CardDescription>Choose which events trigger alerts for staff and administrators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { label: "New Student Enrolment", desc: "Get notified when a new student is added to the system.", state: notifNewEnrol, set: setNotifNewEnrol },
                { label: "Fee Default Alert", desc: "Alert when a student's payment is overdue by 7+ days.", state: notifFeeDefault, set: setNotifFeeDefault },
                { label: "Weekly Summary Report", desc: "Receive a weekly summary of payments, enrolments, and activity.", state: notifWeekly, set: setNotifWeekly },
                { label: "Payment Received", desc: "Confirm every successful fee payment with a system notification.", state: notifPaySuccess, set: setNotifPaySuccess },
                { label: "Bus Pass Expiry Reminder", desc: "Notify parents 7 days before a student's bus pass expires.", state: notifBusExpiry, set: setNotifBusExpiry },
              ].map(({ label, desc, state, set }) => (
                <div key={label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                  <div className="space-y-0.5 pr-8">
                    <Label className="text-sm font-medium">{label}</Label>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch checked={state} onCheckedChange={set} />
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2" onClick={() => toast({ title: "Notification preferences saved" })}>
                <Save className="h-4 w-4" />Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ── Licence ── */}
        <TabsContent value="licence" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Software Licence
              </CardTitle>
              <CardDescription>You are currently on the Institution Pro plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-5 flex items-center justify-between bg-primary/5 border-primary/20">
                <div>
                  <h3 className="font-bold text-lg">Institution Pro</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">₦480,000 / year · Billed annually</p>
                  <p className="text-xs text-muted-foreground mt-1">Renews: 1 September 2027</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold">What's included</h4>
                {[
                  "Unlimited student records",
                  "Bursary & fee management",
                  "Bus Pass Register (anti-theft)",
                  "Biometric payment authorization",
                  "Support Desk (mass communications)",
                  "Analytics & Revenue dashboard",
                  "Priority support (24 h response)",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Payment Method</h4>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="h-10 w-16 rounded bg-muted flex items-center justify-center font-bold text-xs border">VISA</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/2028</p>
                  </div>
                  <Button variant="outline" size="sm">Update Card</Button>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Renewing your licence 30 days before expiry qualifies you for a 5% loyalty discount. Contact your account manager for details.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
