import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Download, Bus, Users, CheckCircle2, Printer, CalendarDays, ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";

interface BusPassEntry {
  studentName: string;
  studentId: string;
  classArm: string;
  busRoute: string;
  paymentDate: string;
  passId: string;
  parentPhone: string;
  validUntil: string;
}

const BUS_PASS_DATA: BusPassEntry[] = [
  { studentName: "Tunde Adeyemi",      studentId: "STU-1044", classArm: "JSS 3",            busRoute: "Route A — Ikeja / Ogba",            paymentDate: "2026-04-01", passId: "BP-2026-0044", parentPhone: "+2348045678901", validUntil: "2026-07-31" },
  { studentName: "Rotimi Fashola",     studentId: "STU-1050", classArm: "JSS 3",            busRoute: "Route B — Surulere / Yaba",         paymentDate: "2026-04-01", passId: "BP-2026-0050", parentPhone: "+2348001234567", validUntil: "2026-07-31" },
  { studentName: "Blessing Adeleke",   studentId: "STU-1057", classArm: "JSS 3",            busRoute: "Route C — Lekki / VI",             paymentDate: "2026-04-02", passId: "BP-2026-0057", parentPhone: "+2348078901235", validUntil: "2026-07-31" },
  { studentName: "Kelechi Onyekwere",  studentId: "STU-1056", classArm: "SSS 2 Commercial", busRoute: "Route A — Ikeja / Ogba",            paymentDate: "2026-04-04", passId: "BP-2026-0056", parentPhone: "+2348067890124", validUntil: "2026-07-31" },
  { studentName: "Amara Okonkwo",      studentId: "STU-1041", classArm: "SSS 2 Science",    busRoute: "Route D — Ajah / Sangotedo",       paymentDate: "2026-04-05", passId: "BP-2026-0041", parentPhone: "+2348012345678", validUntil: "2026-07-31" },
  { studentName: "Ngozi Obi",          studentId: "STU-1046", classArm: "JSS 2",            busRoute: "Route B — Surulere / Yaba",         paymentDate: "2026-04-06", passId: "BP-2026-0046", parentPhone: "+2348067890123", validUntil: "2026-07-31" },
  { studentName: "Adesola Bakare",     studentId: "STU-1048", classArm: "JSS 1",            busRoute: "Route C — Lekki / VI",             paymentDate: "2026-04-07", passId: "BP-2026-0048", parentPhone: "+2348089012345", validUntil: "2026-07-31" },
  { studentName: "Chukwuemeka Nwosu",  studentId: "STU-1052", classArm: "JSS 2",            busRoute: "Route A — Ikeja / Ogba",            paymentDate: "2026-04-08", passId: "BP-2026-0052", parentPhone: "+2348023456780", validUntil: "2026-07-31" },
  { studentName: "Babajide Okafor",    studentId: "STU-1054", classArm: "SSS 1 Science",    busRoute: "Route D — Ajah / Sangotedo",       paymentDate: "2026-04-09", passId: "BP-2026-0054", parentPhone: "+2348045678902", validUntil: "2026-07-31" },
  { studentName: "Fatima Bello",       studentId: "STU-1043", classArm: "SSS 3 Art",        busRoute: "Route B — Surulere / Yaba",         paymentDate: "2026-04-10", passId: "BP-2026-0043", parentPhone: "+2348034567890", validUntil: "2026-07-31" },
];

function printBusPass(entry: BusPassEntry) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bus Pass — ${entry.passId}</title>
<style>
  @page { size: 85mm 54mm; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; background: #fff; width: 85mm; height: 54mm; overflow: hidden; }
  .pass { width: 85mm; height: 54mm; border: 2px solid #1a3a6b; border-radius: 6px; display: flex; flex-direction: column; overflow: hidden; }
  .top { background: #1a3a6b; color: #fff; padding: 4px 8px; display: flex; justify-content: space-between; align-items: center; }
  .school-name { font-size: 8pt; font-weight: bold; letter-spacing: 0.5px; }
  .pass-label { font-size: 7pt; background: #fff; color: #1a3a6b; padding: 1px 6px; border-radius: 3px; font-weight: bold; }
  .body { display: flex; flex: 1; padding: 5px 8px; gap: 8px; }
  .photo { width: 32px; height: 40px; border: 1.5px solid #ccc; border-radius: 3px; background: #f0f4ff; display: flex; align-items: center; justify-content: center; font-size: 18pt; color: #1a3a6b; flex-shrink: 0; }
  .info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .name { font-size: 9pt; font-weight: bold; color: #1a3a6b; line-height: 1.2; }
  .id-class { font-size: 7pt; color: #555; margin-top: 1px; }
  .route { font-size: 7pt; color: #222; margin-top: 3px; }
  .route strong { color: #1a3a6b; }
  .validity { font-size: 6.5pt; color: #888; margin-top: 2px; }
  .bottom { background: #f0f4ff; border-top: 1px dashed #1a3a6b; padding: 3px 8px; display: flex; justify-content: space-between; align-items: center; }
  .pass-id { font-size: 7pt; font-family: monospace; font-weight: bold; color: #1a3a6b; letter-spacing: 1px; }
  .stamp { font-size: 6pt; color: #999; font-style: italic; }
  .anti-tamper { font-size: 5pt; color: #ccc; word-break: break-all; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<div class="pass">
  <div class="top">
    <span class="school-name">🏫 Metrix School System</span>
    <span class="pass-label">SCHOOL BUS PASS</span>
  </div>
  <div class="body">
    <div class="photo">👤</div>
    <div class="info">
      <div>
        <div class="name">${entry.studentName}</div>
        <div class="id-class">${entry.studentId} &nbsp;|&nbsp; ${entry.classArm}</div>
        <div class="route" style="margin-top:4px"><strong>Route:</strong> ${entry.busRoute}</div>
        <div class="validity">Valid: Apr – Jul 2026 &nbsp;|&nbsp; Expires: ${format(new Date(entry.validUntil), "MMM d, yyyy")}</div>
      </div>
      <div class="anti-tamper">${entry.passId}-METRIX2026-${entry.studentId}</div>
    </div>
  </div>
  <div class="bottom">
    <span class="pass-id">${entry.passId}</span>
    <span class="stamp">Official — Do Not Alter</span>
  </div>
</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`;

  const w = window.open("", "_blank", "width=400,height=350");
  if (w) { w.document.write(html); w.document.close(); }
}

export default function BusPassDashboard() {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => BUS_PASS_DATA.filter(e =>
    e.studentName.toLowerCase().includes(search.toLowerCase()) ||
    e.studentId.toLowerCase().includes(search.toLowerCase()) ||
    e.busRoute.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  const visible = showAll ? filtered : filtered.slice(0, 8);

  const exportCSV = () => {
    const header = "Pass ID,Student Name,Student ID,Class,Bus Route,Payment Date,Valid Until,Parent Phone";
    const rows = BUS_PASS_DATA.map(e =>
      `"${e.passId}","${e.studentName}","${e.studentId}","${e.classArm}","${e.busRoute}","${e.paymentDate}","${e.validUntil}","${e.parentPhone}"`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bus-pass-register.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const routeCounts = BUS_PASS_DATA.reduce<Record<string, number>>((acc, e) => {
    const r = e.busRoute.split("—")[0].trim();
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bus className="h-7 w-7 text-primary" />
            Bus Pass Register
          </h1>
          <p className="text-muted-foreground mt-1">
            Anti-theft verification dashboard. Shows only students with a confirmed, paid school bus fee for this term.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <ShieldCheck className="h-4 w-4" />
            Restricted — Proprietor & Admin Only
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Pass Holders</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{BUS_PASS_DATA.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed paid this term</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Active Passes</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{BUS_PASS_DATA.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Valid until Jul 31, 2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bus Fee Collected</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Bus className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(BUS_PASS_DATA.length * 15000).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">₦15,000 × {BUS_PASS_DATA.length} students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Routes</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(routeCounts).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Routes A, B, C & D</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Search + Export ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, ID, or bus route…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2 shrink-0" onClick={exportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* ── Bus Pass Table ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bus className="h-4 w-4 text-muted-foreground" />
                Verified Bus Pass Holders
              </CardTitle>
              <CardDescription>
                Only students listed here are entitled to board the school bus. Print a pass for physical verification.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
              {filtered.length} verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "820px" }}>
              <thead>
                <tr className="border-t border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Student Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Student ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Class / Arm</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Bus Route</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Payment Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Valid Until</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} className="h-24 text-center text-muted-foreground text-sm">
                      No records match your search.
                    </td>
                  </tr>
                )}
                {visible.map((entry) => (
                  <tr key={entry.passId} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{entry.studentName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{entry.studentId}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                        {entry.classArm}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{entry.busRoute}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {format(new Date(entry.paymentDate), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {format(new Date(entry.validUntil), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs gap-1.5"
                        onClick={() => printBusPass(entry)}
                      >
                        <Printer className="h-3 w-3" />
                        Print Bus Pass
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {visible.length} of {filtered.length} verified students
            </p>
            {filtered.length > 8 && (
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setShowAll(prev => !prev)}>
                {showAll ? "Show Less" : `See All (${filtered.length - 8} more)`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
