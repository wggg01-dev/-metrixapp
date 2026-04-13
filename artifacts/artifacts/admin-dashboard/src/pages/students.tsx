import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Search, FileText, Upload, ChevronDown, Receipt, Users, GraduationCap,
  Phone, Mail, BookOpen, X, CheckCircle2, ShieldCheck,
} from "lucide-react";

const CLASS_LEVELS = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
const SSS_LEVELS   = ["SSS 1", "SSS 2", "SSS 3"];
const DEPARTMENTS  = ["Science", "Art", "Commercial", "Social Science"] as const;

type Department = typeof DEPARTMENTS[number];
type EnrollmentStatus = "Active" | "Graduated" | "Transferred" | "Suspended";

interface Student {
  id: string;
  name: string;
  studentId: string;
  parentPhone: string;
  parentEmail: string;
  class: string;
  department?: Department;
  enrollmentStatus: EnrollmentStatus;
  termFee: number;
}

const STUDENTS: Student[] = [
  { id: "1",  name: "Amara Okonkwo",        studentId: "STU-1041", parentPhone: "08012345001", parentEmail: "parent.okonkwo@gmail.com",   class: "SSS 2", department: "Science",        enrollmentStatus: "Active",      termFee: 85000 },
  { id: "2",  name: "Emeka Chukwu",          studentId: "STU-1042", parentPhone: "08012345002", parentEmail: "emeka.dad@yahoo.com",         class: "JSS 1", department: undefined,        enrollmentStatus: "Active",      termFee: 62000 },
  { id: "3",  name: "Fatima Bello",           studentId: "STU-1043", parentPhone: "08012345003", parentEmail: "bellofamily@gmail.com",       class: "SSS 3", department: "Art",            enrollmentStatus: "Graduated",   termFee: 90000 },
  { id: "4",  name: "Tunde Adeyemi",          studentId: "STU-1044", parentPhone: "08012345004", parentEmail: "adeyemi.home@gmail.com",      class: "JSS 3", department: undefined,        enrollmentStatus: "Active",      termFee: 70000 },
  { id: "5",  name: "Chisom Eze",             studentId: "STU-1045", parentPhone: "08012345005", parentEmail: "eze.parents@outlook.com",     class: "SSS 1", department: "Commercial",     enrollmentStatus: "Active",      termFee: 80000 },
  { id: "6",  name: "Ngozi Obi",              studentId: "STU-1046", parentPhone: "08012345006", parentEmail: "ngozi.obi.home@gmail.com",    class: "JSS 2", department: undefined,        enrollmentStatus: "Suspended",   termFee: 65000 },
  { id: "7",  name: "Yusuf Ibrahim",          studentId: "STU-1047", parentPhone: "08012345007", parentEmail: "ibrahim.fam@yahoo.com",       class: "SSS 2", department: "Social Science", enrollmentStatus: "Active",      termFee: 85000 },
  { id: "8",  name: "Adesola Bakare",         studentId: "STU-1048", parentPhone: "08012345008", parentEmail: "bakare.ng@gmail.com",         class: "JSS 1", department: undefined,        enrollmentStatus: "Active",      termFee: 62000 },
  { id: "9",  name: "Obiageli Nwachukwu",    studentId: "STU-1049", parentPhone: "08012345009", parentEmail: "nwachukwu.p@gmail.com",       class: "SSS 3", department: "Science",        enrollmentStatus: "Transferred", termFee: 90000 },
  { id: "10", name: "Rotimi Fashola",         studentId: "STU-1050", parentPhone: "08012345010", parentEmail: "fashola.home@outlook.com",    class: "JSS 3", department: undefined,        enrollmentStatus: "Active",      termFee: 70000 },
  { id: "11", name: "Halima Sule",            studentId: "STU-1051", parentPhone: "08012345011", parentEmail: "sule.family@gmail.com",       class: "SSS 1", department: "Art",            enrollmentStatus: "Active",      termFee: 80000 },
  { id: "12", name: "Chukwuemeka Nwosu",     studentId: "STU-1052", parentPhone: "08012345012", parentEmail: "nwosu.c.parent@gmail.com",    class: "JSS 2", department: undefined,        enrollmentStatus: "Active",      termFee: 65000 },
  { id: "13", name: "Chiamaka Osei",          studentId: "STU-1053", parentPhone: "08012345013", parentEmail: "osei.family@yahoo.com",       class: "JSS 1", department: undefined,        enrollmentStatus: "Active",      termFee: 62000 },
  { id: "14", name: "Babajide Olamide",       studentId: "STU-1054", parentPhone: "08012345014", parentEmail: "olamide.b@gmail.com",         class: "SSS 2", department: "Commercial",     enrollmentStatus: "Active",      termFee: 85000 },
  { id: "15", name: "Kehinde Afolabi",        studentId: "STU-1055", parentPhone: "08012345015", parentEmail: "afolabi.k.home@gmail.com",    class: "SSS 3", department: "Science",        enrollmentStatus: "Active",      termFee: 90000 },
  { id: "16", name: "Adaeze Okeke",           studentId: "STU-1056", parentPhone: "08012345016", parentEmail: "okeke.parent@gmail.com",      class: "JSS 2", department: undefined,        enrollmentStatus: "Graduated",   termFee: 65000 },
  { id: "17", name: "Sodiq Adesanya",         studentId: "STU-1057", parentPhone: "08012345017", parentEmail: "adesanya.family@gmail.com",   class: "SSS 1", department: "Social Science", enrollmentStatus: "Active",      termFee: 80000 },
  { id: "18", name: "Miriam Danladi",         studentId: "STU-1058", parentPhone: "08012345018", parentEmail: "danladi.m.p@yahoo.com",       class: "JSS 3", department: undefined,        enrollmentStatus: "Active",      termFee: 70000 },
];

const STATUS_CONFIG: Record<EnrollmentStatus, { color: string; bg: string; border: string }> = {
  Active:      { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10",  border: "border-emerald-500/20" },
  Graduated:   { color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-500/10",     border: "border-blue-500/20"    },
  Transferred: { color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-500/10",    border: "border-amber-500/20"   },
  Suspended:   { color: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-500/10",     border: "border-rose-500/20"    },
};

function StatusPill({ status }: { status: EnrollmentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border} whitespace-nowrap`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

export default function Students() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch]                   = useState("");
  const [classFilter, setClassFilter]         = useState("all");
  const [statusFilter, setStatusFilter]       = useState("all");
  const [termInvoiceOpen, setTermInvoiceOpen] = useState(false);
  const [selectedClass, setSelectedClass]     = useState("");
  const [generating, setGenerating]           = useState(false);

  const filtered = STUDENTS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.parentEmail.toLowerCase().includes(q) ||
      s.parentPhone.includes(q);
    const matchClass  = classFilter  === "all" || s.class === classFilter;
    const matchStatus = statusFilter === "all" || s.enrollmentStatus === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  const activeCount     = STUDENTS.filter(s => s.enrollmentStatus === "Active").length;
  const nonActiveCount  = STUDENTS.filter(s => s.enrollmentStatus !== "Active").length;

  const billableInClass = selectedClass
    ? STUDENTS.filter(s => s.class === selectedClass && s.enrollmentStatus === "Active")
    : [];

  const handleGenerateInvoice = (student: Student) => {
    toast({
      title: "Invoice generated",
      description: `₦${student.termFee.toLocaleString()} invoice created for ${student.name} (${student.class}).`,
    });
  };

  const handleTermInvoices = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setTermInvoiceOpen(false);
      setSelectedClass("");
      toast({
        title: "Term invoices generated",
        description: `${billableInClass.length} invoice${billableInClass.length !== 1 ? "s" : ""} created for all active students in ${selectedClass}.`,
      });
    }, 1400);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast({
      title: "File uploaded",
      description: `"${file.name}" is ready for import. Student records will be processed shortly.`,
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage student records, enrolment status, and generate term invoices.
          </p>
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            Restricted — Proprietor & Admin
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV / Excel
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleUpload}
          />
          <Button onClick={() => setTermInvoiceOpen(true)}>
            <Receipt className="h-4 w-4 mr-2" />
            Generate Term Invoices
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span><span className="font-semibold text-foreground">{STUDENTS.length}</span> total students</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span><span className="font-semibold text-foreground">{activeCount}</span> active</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
          <span><span className="font-semibold text-foreground">{nonActiveCount}</span> inactive (excluded from billing)</span>
        </span>
      </div>

      {/* Search + Filters */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, student ID, phone or email…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASS_LEVELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Enrolment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Graduated">Graduated</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(classFilter !== "all" || statusFilter !== "all" || search) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
              <button
                onClick={() => { setSearch(""); setClassFilter("all"); setStatusFilter("all"); }}
                className="text-xs text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Student Records · {filtered.length} shown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <GraduationCap className="h-10 w-10 opacity-30" />
              <p className="text-sm">No students match your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((student) => {
                const isSSS = SSS_LEVELS.includes(student.class);
                const inactive = student.enrollmentStatus !== "Active";

                return (
                  <div
                    key={student.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 transition-colors ${
                      inactive ? "opacity-60 bg-muted/20" : "hover:bg-muted/30"
                    }`}
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm truncate">{student.name}</span>
                          <span className="font-mono text-xs text-muted-foreground shrink-0">{student.studentId}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />{student.parentPhone}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[200px]">
                            <Mail className="h-3 w-3" />{student.parentEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Class + Department */}
                    <div className="flex items-center gap-2 shrink-0 sm:ml-auto sm:mr-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted border border-border text-muted-foreground">
                        {student.class}
                      </span>
                      {isSSS && student.department && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                          <BookOpen className="h-3 w-3" />
                          {student.department}
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      <StatusPill status={student.enrollmentStatus} />
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-2">
                      {inactive ? (
                        <span className="text-xs text-muted-foreground italic">Billing disabled</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1.5"
                          onClick={() => handleGenerateInvoice(student)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Generate Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive notice */}
      {filtered.some(s => s.enrollmentStatus !== "Active") && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          Graduated, transferred, and suspended students are excluded from term billing. Their financial history is preserved.
        </p>
      )}

      {/* Generate Term Invoices Dialog */}
      <Dialog open={termInvoiceOpen} onOpenChange={(o) => { if (!generating) { setTermInvoiceOpen(o); if (!o) setSelectedClass(""); }}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Generate Term Invoices
            </DialogTitle>
            <DialogDescription>
              Select a class to instantly create term fee invoices for all active students enrolled in that class.
              Graduated, transferred, and suspended students are automatically excluded.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class level…" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_LEVELS.map(c => {
                    const count = STUDENTS.filter(s => s.class === c && s.enrollmentStatus === "Active").length;
                    return (
                      <SelectItem key={c} value={c}>
                        <span className="flex items-center gap-2">
                          {c}
                          <span className="text-xs text-muted-foreground">· {count} active student{count !== 1 ? "s" : ""}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedClass && (
              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
                <p className="text-sm font-medium">{selectedClass} — Invoice Summary</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active students</span>
                  <span className="font-semibold">{billableInClass.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fee per student</span>
                  <span className="font-semibold">
                    ₦{billableInClass[0] ? billableInClass[0].termFee.toLocaleString() : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground font-medium">Total invoiced</span>
                  <span className="font-bold text-primary">
                    ₦{billableInClass.reduce((s, st) => s + st.termFee, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setTermInvoiceOpen(false); setSelectedClass(""); }} disabled={generating}>
              Cancel
            </Button>
            <Button
              disabled={!selectedClass || billableInClass.length === 0 || generating}
              onClick={handleTermInvoices}
            >
              {generating ? (
                <>
                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate {billableInClass.length > 0 ? `${billableInClass.length} ` : ""}Invoice{billableInClass.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
