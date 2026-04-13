import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Filter, CreditCard, CheckCircle2, Clock, AlertCircle,
  Fingerprint, ShoppingCart, ChevronRight, Users, Plus, Minus, Wallet,
  Download, Printer, ShieldCheck,
} from "lucide-react";

type PaymentStatus = "Paid" | "Pending" | "Part-payment";
type PaymentMethod = "Cash" | "Webhook";

interface Invoice {
  id: string;
  studentName: string;
  studentId: string;
  classArm: string;
  paymentType: string;
  totalAmount: number;
  amountPaid: number;
  remainingBalance: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  parentPhone: string;
  paymentDate?: string;
}

const STORE_ITEMS = [
  { category: "Tuition",    type: "Term 1 Tuition — JSS",                  price: 62000 },
  { category: "Tuition",    type: "Term 1 Tuition — SSS (Art)",            price: 72000 },
  { category: "Tuition",    type: "Term 1 Tuition — SSS (Science)",        price: 78000 },
  { category: "Tuition",    type: "Term 1 Tuition — SSS (Commercial)",     price: 75000 },
  { category: "Tuition",    type: "Term 1 Tuition — SSS (Social Science)", price: 70000 },
  { category: "Tuition",    type: "Term 2 Tuition — JSS",                  price: 62000 },
  { category: "Tuition",    type: "Term 2 Tuition — SSS (Art)",            price: 72000 },
  { category: "Tuition",    type: "Term 2 Tuition — SSS (Science)",        price: 78000 },
  { category: "Tuition",    type: "Term 2 Tuition — SSS (Commercial)",     price: 75000 },
  { category: "Tuition",    type: "Term 2 Tuition — SSS (Social Science)", price: 70000 },
  { category: "Textbook",   type: "Learn Grammar Textbook JSS 1",          price: 2500  },
  { category: "Textbook",   type: "Mathematics Textbook SSS 1",            price: 3200  },
  { category: "Uniform",    type: "Uniform Set (JSS) — Blue",              price: 8500  },
  { category: "Uniform",    type: "Uniform Set (SSS) — Brown",             price: 9200  },
  { category: "Uniform",    type: "Sports Kit — Full Set",                 price: 6500  },
  { category: "Transport",  type: "School Bus Fee (Per Term)",             price: 15000 },
  { category: "Stationery", type: "Exercise Books (Pack of 10)",           price: 1800  },
  { category: "Stationery", type: "School Diary / Planner",                price: 1200  },
  { category: "Other",      type: "Exam Registration Fee",                 price: 12000 },
  { category: "Other",      type: "Library Card Fee (Annual)",             price: 2000  },
];

const CATEGORIES = Array.from(new Set(STORE_ITEMS.map(i => i.category)));

export const BURSARY_INVOICES: Invoice[] = [
  { id: "INV-001", studentName: "Amara Okonkwo",      studentId: "STU-1041", classArm: "SSS 2 Science",       paymentType: "Term 1 Tuition — SSS (Science)",        totalAmount: 78000, amountPaid: 78000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Webhook", parentPhone: "+2348012345678", paymentDate: "2026-03-28" },
  { id: "INV-002", studentName: "Emeka Chukwu",        studentId: "STU-1042", classArm: "JSS 1",               paymentType: "Term 1 Tuition — JSS",                  totalAmount: 62000, amountPaid: 0,     remainingBalance: 62000, status: "Pending",      paymentMethod: "Cash",    parentPhone: "+2348023456789" },
  { id: "INV-003", studentName: "Fatima Bello",         studentId: "STU-1043", classArm: "SSS 3 Art",           paymentType: "Term 1 Tuition — SSS (Art)",            totalAmount: 72000, amountPaid: 36000, remainingBalance: 36000, status: "Part-payment", paymentMethod: "Cash",    parentPhone: "+2348034567890", paymentDate: "2026-04-02" },
  { id: "INV-004", studentName: "Tunde Adeyemi",        studentId: "STU-1044", classArm: "JSS 3",               paymentType: "School Bus Fee (Per Term)",              totalAmount: 15000, amountPaid: 15000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Cash",    parentPhone: "+2348045678901", paymentDate: "2026-04-01" },
  { id: "INV-005", studentName: "Chisom Eze",           studentId: "STU-1045", classArm: "SSS 1 Commercial",    paymentType: "Term 2 Tuition — SSS (Commercial)",     totalAmount: 75000, amountPaid: 0,     remainingBalance: 75000, status: "Pending",      paymentMethod: "Cash",    parentPhone: "+2348056789012" },
  { id: "INV-006", studentName: "Ngozi Obi",            studentId: "STU-1046", classArm: "JSS 2",               paymentType: "Term 1 Tuition — JSS",                  totalAmount: 62000, amountPaid: 62000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Cash",    parentPhone: "+2348067890123", paymentDate: "2026-03-30" },
  { id: "INV-007", studentName: "Yusuf Ibrahim",        studentId: "STU-1047", classArm: "SSS 2 Science",       paymentType: "Exam Registration Fee",                 totalAmount: 12000, amountPaid: 6000,  remainingBalance: 6000,  status: "Part-payment", paymentMethod: "Cash",    parentPhone: "+2348078901234", paymentDate: "2026-04-05" },
  { id: "INV-008", studentName: "Adesola Bakare",       studentId: "STU-1048", classArm: "JSS 1",               paymentType: "Term 1 Tuition — JSS",                  totalAmount: 62000, amountPaid: 62000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Webhook", parentPhone: "+2348089012345", paymentDate: "2026-03-29" },
  { id: "INV-009", studentName: "Obiageli Nwachukwu",  studentId: "STU-1049", classArm: "SSS 3 Social Science", paymentType: "Term 2 Tuition — SSS (Social Science)", totalAmount: 70000, amountPaid: 0,     remainingBalance: 70000, status: "Pending",      paymentMethod: "Cash",    parentPhone: "+2348090123456" },
  { id: "INV-010", studentName: "Rotimi Fashola",       studentId: "STU-1050", classArm: "JSS 3",               paymentType: "School Bus Fee (Per Term)",              totalAmount: 15000, amountPaid: 15000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Webhook", parentPhone: "+2348001234567", paymentDate: "2026-04-01" },
  { id: "INV-011", studentName: "Halima Sule",          studentId: "STU-1051", classArm: "SSS 1 Art",           paymentType: "Uniform Set (JSS) — Blue",              totalAmount: 8500,  amountPaid: 4000,  remainingBalance: 4500,  status: "Part-payment", paymentMethod: "Cash",    parentPhone: "+2348012345679", paymentDate: "2026-04-06" },
  { id: "INV-012", studentName: "Chukwuemeka Nwosu",   studentId: "STU-1052", classArm: "JSS 2",               paymentType: "Term 1 Tuition — JSS",                  totalAmount: 62000, amountPaid: 62000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Cash",    parentPhone: "+2348023456780", paymentDate: "2026-03-31" },
  { id: "INV-013", studentName: "Chiamaka Osei",        studentId: "STU-1053", classArm: "JSS 1",               paymentType: "Term 1 Tuition — JSS",                  totalAmount: 62000, amountPaid: 0,     remainingBalance: 62000, status: "Pending",      paymentMethod: "Cash",    parentPhone: "+2348034567891" },
  { id: "INV-014", studentName: "Babajide Okafor",      studentId: "STU-1054", classArm: "SSS 1 Science",       paymentType: "Mathematics Textbook SSS 1",             totalAmount: 3200,  amountPaid: 3200,  remainingBalance: 0,     status: "Paid",         paymentMethod: "Webhook", parentPhone: "+2348045678902", paymentDate: "2026-04-03" },
  { id: "INV-015", studentName: "Adunola Taiwo",        studentId: "STU-1055", classArm: "JSS 2",               paymentType: "School Bus Fee (Per Term)",              totalAmount: 15000, amountPaid: 0,     remainingBalance: 15000, status: "Pending",      paymentMethod: "Cash",    parentPhone: "+2348056789013" },
  { id: "INV-016", studentName: "Kelechi Onyekwere",   studentId: "STU-1056", classArm: "SSS 2 Commercial",    paymentType: "Term 1 Tuition — SSS (Commercial)",     totalAmount: 75000, amountPaid: 75000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Webhook", parentPhone: "+2348067890124", paymentDate: "2026-04-04" },
  { id: "INV-017", studentName: "Blessing Adeleke",     studentId: "STU-1057", classArm: "JSS 3",               paymentType: "School Bus Fee (Per Term)",              totalAmount: 15000, amountPaid: 15000, remainingBalance: 0,     status: "Paid",         paymentMethod: "Cash",    parentPhone: "+2348078901235", paymentDate: "2026-04-02" },
  { id: "INV-018", studentName: "Seun Olawale",         studentId: "STU-1058", classArm: "SSS 1 Science",       paymentType: "Term 1 Tuition — SSS (Science)",        totalAmount: 78000, amountPaid: 39000, remainingBalance: 39000, status: "Part-payment", paymentMethod: "Cash",    parentPhone: "+2348089012346", paymentDate: "2026-04-07" },
];

const STUDENTS = BURSARY_INVOICES.map(i => ({ name: i.studentName, id: i.studentId }));

function genReceiptCode(inv: Invoice, amount: number): string {
  const raw = `${inv.id}|${inv.studentId}|${amount}|${Date.now()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) { h = ((h << 5) - h + raw.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(36).toUpperCase().padStart(8, "0");
}

function printReceipt(inv: Invoice, amountTendered: number, newBal: number, receiptCode: string) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Official Receipt — ${inv.id}</title>
<style>
  @page { size: A5; margin: 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', monospace; font-size: 10pt; color: #000; background: #fff; }
  .receipt { width: 100%; max-width: 148mm; margin: auto; border: 2px solid #000; padding: 10px; }
  .header { text-align: center; border-bottom: 2px double #000; padding-bottom: 8px; margin-bottom: 8px; }
  .school-name { font-size: 15pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
  .school-sub  { font-size: 8pt; color: #333; margin-top: 2px; }
  .receipt-title { font-size: 12pt; font-weight: bold; text-align: center; background: #000; color: #fff; padding: 4px 0; margin: 8px 0; letter-spacing: 2px; }
  .meta-row { display: flex; justify-content: space-between; font-size: 8pt; margin-bottom: 4px; }
  .meta-label { font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9pt; }
  th { background: #000; color: #fff; padding: 4px 6px; text-align: left; font-size: 8pt; letter-spacing: 0.5px; }
  td { padding: 4px 6px; border-bottom: 1px dotted #999; }
  td.num { text-align: right; font-weight: bold; }
  .total-row td { border-top: 2px solid #000; border-bottom: 2px solid #000; font-weight: bold; font-size: 10pt; }
  .auth-box { border: 1px solid #000; padding: 8px; margin: 8px 0; }
  .auth-title { font-weight: bold; font-size: 8pt; text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px solid #999; padding-bottom: 3px; }
  .sig-row { display: flex; justify-content: space-between; margin-top: 20px; font-size: 8pt; }
  .sig-block { text-align: center; }
  .sig-line { border-top: 1px solid #000; width: 80px; margin-bottom: 2px; }
  .verify-box { background: #f5f5f5; border: 1px dashed #999; padding: 6px; margin: 8px 0; text-align: center; }
  .verify-code { font-size: 14pt; font-weight: bold; letter-spacing: 4px; font-family: monospace; }
  .footer { border-top: 2px double #000; margin-top: 8px; padding-top: 6px; font-size: 7pt; text-align: center; color: #555; }
  .anti-tamper { font-size: 6pt; color: #bbb; margin-top: 4px; word-break: break-all; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-45deg); font-size: 60pt; opacity: 0.04; font-weight: bold; pointer-events: none; z-index: 0; color: #000; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<div class="watermark">OFFICIAL</div>
<div class="receipt">
  <div class="header">
    <div class="school-name">🏫 Metrix School System</div>
    <div class="school-sub">Excellence in Education · Est. 2010</div>
    <div class="school-sub" style="margin-top:2px">P.O. Box 1234, Victoria Island, Lagos, Nigeria</div>
    <div class="school-sub">Tel: +234 801 234 5678 | bursary@metrixschool.edu.ng</div>
  </div>

  <div class="receipt-title">OFFICIAL PAYMENT RECEIPT</div>

  <div class="meta-row"><span class="meta-label">Receipt No:</span><span>${inv.id}-${receiptCode}</span></div>
  <div class="meta-row"><span class="meta-label">Date Issued:</span><span>${dateStr}</span></div>
  <div class="meta-row"><span class="meta-label">Time:</span><span>${timeStr}</span></div>
  <div class="meta-row"><span class="meta-label">Academic Session:</span><span>2025/2026 — Term 1</span></div>

  <table>
    <tr><th colspan="2">STUDENT INFORMATION</th></tr>
    <tr><td>Full Name</td><td>${inv.studentName}</td></tr>
    <tr><td>Student ID</td><td><strong>${inv.studentId}</strong></td></tr>
    <tr><td>Class / Arm</td><td>${inv.classArm}</td></tr>
    <tr><td>Parent Phone</td><td>${inv.parentPhone}</td></tr>
  </table>

  <table>
    <tr><th>Description</th><th style="text-align:right">Amount (₦)</th></tr>
    <tr><td>${inv.paymentType}</td><td class="num">${inv.totalAmount.toLocaleString("en-NG")}</td></tr>
    <tr><td>Previous Balance Paid</td><td class="num">${inv.amountPaid.toLocaleString("en-NG")}</td></tr>
    <tr><td><strong>Amount Tendered (This Payment)</strong></td><td class="num"><strong>${amountTendered.toLocaleString("en-NG")}</strong></td></tr>
    <tr class="total-row"><td>OUTSTANDING BALANCE</td><td class="num">₦&nbsp;${newBal.toLocaleString("en-NG")}</td></tr>
  </table>

  <div class="meta-row" style="margin-top:6px">
    <span class="meta-label">Payment Method:</span>
    <span>${inv.paymentMethod}</span>
  </div>
  <div class="meta-row">
    <span class="meta-label">Settlement Status:</span>
    <span>${newBal === 0 ? "✅ FULLY PAID" : "⚠ PART-PAYMENT"}</span>
  </div>

  <div class="verify-box">
    <div style="font-size:7pt;margin-bottom:3px;font-weight:bold;">VERIFICATION CODE — DO NOT ALTER</div>
    <div class="verify-code">${receiptCode}</div>
    <div style="font-size:6.5pt;margin-top:3px;color:#666">Scan or quote this code to verify authenticity at the Bursary Office</div>
  </div>

  <div class="auth-box">
    <div class="auth-title">Authorisation</div>
    <div class="sig-row">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div>Cashier Signature</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div>Bursary Stamp</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div>Biometric ID</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>This is an <strong>OFFICIAL RECEIPT</strong> of Metrix School System. Any alteration renders it null and void.</div>
    <div>Issued via the Metrix School Management Platform. Verify at: metrixschool.edu.ng/verify</div>
    <div class="anti-tamper">${receiptCode}-${inv.studentId}-${amountTendered}-${inv.id}-METRIX2026</div>
  </div>
</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`;

  const w = window.open("", "_blank", "width=600,height=800");
  if (w) { w.document.write(html); w.document.close(); }
}

function StatusBadge({ status }: { status: PaymentStatus }) {
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

function MethodBadge({ method }: { method: PaymentMethod }) {
  if (method === "Cash")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        💵 Cash
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
      🔗 Webhook
    </span>
  );
}

export default function BursaryAccounts() {
  const [invoices, setInvoices] = useState<Invoice[]>(BURSARY_INVOICES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

  const [payOpen, setPayOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [amountTendered, setAmountTendered] = useState<string>("");
  const [biometricScanning, setBiometricScanning] = useState(false);

  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [qsStudent, setQsStudent] = useState<string>("");
  const [qsStudentId, setQsStudentId] = useState<string>("");
  const [qsCategory, setQsCategory] = useState<string>("");
  const [qsType, setQsType] = useState<string>("");
  const [qsQty, setQsQty] = useState<number>(1);
  const [qsBiometricScanning, setQsBiometricScanning] = useState(false);

  const { toast } = useToast();

  const filtered = useMemo(() => invoices.filter(inv => {
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchSearch = inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(search.toLowerCase()) ||
      inv.paymentType.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }), [invoices, search, statusFilter]);

  const visible = showAll ? filtered : filtered.slice(0, 8);

  const allPayments  = invoices.length;
  const paidCount    = invoices.filter(i => i.status === "Paid").length;
  const pendingCount = invoices.filter(i => i.status === "Pending").length;
  const partPayCount = invoices.filter(i => i.status === "Part-payment").length;

  const parsedAmount = parseFloat(amountTendered.replace(/,/g, "")) || 0;
  const newBalance = selectedInvoice ? Math.max(0, selectedInvoice.remainingBalance - parsedAmount) : 0;

  const formatNum = (n: number) => n.toLocaleString("en-NG");

  const openPayModal = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setAmountTendered("");
    setPayOpen(true);
  };

  const handleAmountInput = (val: string) => {
    const raw = val.replace(/[^0-9.]/g, "");
    const parts = raw.split(".");
    const intPart = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? "";
    const formatted = parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
    setAmountTendered(formatted);
  };

  const handleBiometricAuthorize = () => {
    if (!selectedInvoice) return;
    if (parsedAmount <= 0) {
      toast({ title: "Amount required", description: "Please enter the amount tendered.", variant: "destructive" });
      return;
    }
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      const newAmountPaid = selectedInvoice.amountPaid + parsedAmount;
      const remaining = Math.max(0, selectedInvoice.totalAmount - newAmountPaid);
      const newStatus: PaymentStatus = remaining === 0 ? "Paid" : newAmountPaid > 0 ? "Part-payment" : "Pending";
      const receiptCode = genReceiptCode(selectedInvoice, parsedAmount);

      setInvoices(prev => prev.map(inv =>
        inv.id === selectedInvoice.id
          ? { ...inv, amountPaid: newAmountPaid, remainingBalance: remaining, status: newStatus, paymentDate: new Date().toISOString().split("T")[0] }
          : inv
      ));

      toast({
        title: "Payment Authorized ✓",
        description: `₦${formatNum(parsedAmount)} recorded for ${selectedInvoice.studentName}. SMS sent to ${selectedInvoice.parentPhone}.`,
      });

      printReceipt(selectedInvoice, parsedAmount, newBalance, receiptCode);
      setPayOpen(false);
    }, 1800);
  };

  const qsSelectedItem = STORE_ITEMS.find(i => i.type === qsType);
  const qsTotal = qsSelectedItem ? qsSelectedItem.price * qsQty : 0;
  const qsTypesForCategory = STORE_ITEMS.filter(i => i.category === qsCategory);

  const handleQsStudentChange = (name: string) => {
    setQsStudent(name);
    const found = STUDENTS.find(s => s.name === name);
    setQsStudentId(found?.id ?? "");
  };

  const handleQsCategoryChange = (cat: string) => {
    setQsCategory(cat);
    setQsType("");
  };

  const handleQuickSaleAuthorize = () => {
    if (!qsStudent || !qsType || qsQty < 1) {
      toast({ title: "Incomplete fields", description: "Please fill all fields before authorizing.", variant: "destructive" });
      return;
    }
    setQsBiometricScanning(true);
    setTimeout(() => {
      setQsBiometricScanning(false);
      toast({
        title: "Sale Authorized & Receipt Generated ✓",
        description: `₦${formatNum(qsTotal)} charged to ${qsStudent} for ${qsType} × ${qsQty}. Receipt printed.`,
      });
      setQuickSaleOpen(false);
      setQsStudent(""); setQsStudentId(""); setQsCategory(""); setQsType(""); setQsQty(1);
    }, 1800);
  };

  const exportCSV = () => {
    const header = "Invoice ID,Student Name,Student ID,Class,Payment Type,Total Amount,Amount Paid,Remaining Balance,Status,Payment Method,Parent Phone";
    const rows = invoices.map(inv =>
      `"${inv.id}","${inv.studentName}","${inv.studentId}","${inv.classArm}","${inv.paymentType}",${inv.totalAmount},${inv.amountPaid},${inv.remainingBalance},"${inv.status}","${inv.paymentMethod}","${inv.parentPhone}"`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bursary-accounts.csv"; a.click(); URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "bursary-accounts.csv downloaded." });
  };

  return (
    <div className="space-y-8">

      {/* ── Pay Invoice Modal ── */}
      <Dialog open={payOpen} onOpenChange={open => { if (!open) setPayOpen(false); }}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Pay Invoice
            </DialogTitle>
            <DialogDescription>Review the invoice details and enter the amount tendered.</DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Student Name</p>
                  <p className="text-sm font-medium mt-0.5">{selectedInvoice.studentName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Student ID</p>
                  <p className="text-sm font-medium mt-0.5 font-mono">{selectedInvoice.studentId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Class / Arm</p>
                  <p className="text-sm font-medium mt-0.5">{selectedInvoice.classArm}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Payment Type</p>
                  <p className="text-sm font-medium mt-0.5">{selectedInvoice.paymentType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                  <div className="mt-0.5"><StatusBadge status={selectedInvoice.status} /></div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</p>
                  <div className="mt-0.5"><MethodBadge method={selectedInvoice.paymentMethod} /></div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Amount</p>
                  <p className="text-sm font-semibold mt-0.5">₦{formatNum(selectedInvoice.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Amount Paid</p>
                  <p className="text-sm font-semibold mt-0.5 text-emerald-600">₦{formatNum(selectedInvoice.amountPaid)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Remaining Balance</p>
                  <p className="text-sm font-bold mt-0.5 text-rose-600">₦{formatNum(selectedInvoice.remainingBalance)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Parent Phone</p>
                  <p className="text-sm font-medium mt-0.5">{selectedInvoice.parentPhone}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount-tendered" className="text-sm font-medium">
                  Amount Tendered Today (₦)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none font-medium">₦</span>
                  <Input
                    id="amount-tendered"
                    placeholder="0"
                    value={amountTendered}
                    onChange={e => handleAmountInput(e.target.value)}
                    className="pl-8 text-base font-semibold"
                    autoComplete="off"
                  />
                </div>
                {parsedAmount > 0 && parsedAmount < selectedInvoice.remainingBalance && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠ Minimum full settlement: ₦{formatNum(selectedInvoice.remainingBalance)}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  New Balance will be:{" "}
                  <span className={`font-bold text-sm ${newBalance === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    ₦{formatNum(newBalance)}
                  </span>
                  {newBalance === 0 && parsedAmount > 0 && (
                    <span className="ml-2 text-emerald-600 text-xs">• Invoice fully cleared ✓</span>
                  )}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col gap-2 pt-2">
            <Button
              className="w-full gap-2 bg-primary text-primary-foreground h-11"
              onClick={handleBiometricAuthorize}
              disabled={biometricScanning}
            >
              <Fingerprint className={`h-5 w-5 ${biometricScanning ? "animate-pulse" : ""}`} />
              {biometricScanning ? "Scanning Biometric… Receipt Printing…" : "Authorize with Biometric & Print Receipt"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setPayOpen(false)} disabled={biometricScanning}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Quick Sale Modal ── */}
      <Dialog open={quickSaleOpen} onOpenChange={open => { if (!open) setQuickSaleOpen(false); }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Quick Sale
            </DialogTitle>
            <DialogDescription>Process an ad-hoc purchase for any student.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Student</Label>
              <Select value={qsStudent} onValueChange={handleQsStudentChange}>
                <SelectTrigger><SelectValue placeholder="Select student…" /></SelectTrigger>
                <SelectContent>
                  {STUDENTS.map(s => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Student ID</Label>
              <Input value={qsStudentId} readOnly className="bg-muted/30 cursor-not-allowed font-mono text-sm" placeholder="Auto-filled from selection" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Payment Category</Label>
                <Select value={qsCategory} onValueChange={handleQsCategoryChange}>
                  <SelectTrigger><SelectValue placeholder="Category…" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Payment Type</Label>
                <Select value={qsType} onValueChange={setQsType} disabled={!qsCategory}>
                  <SelectTrigger><SelectValue placeholder="Type…" /></SelectTrigger>
                  <SelectContent>
                    {qsTypesForCategory.map(i => (
                      <SelectItem key={i.type} value={i.type}>
                        <div className="flex flex-col">
                          <span>{i.type}</span>
                          <span className="text-xs text-muted-foreground">₦{i.price.toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setQsQty(q => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input type="number" min={1} value={qsQty} onChange={e => setQsQty(Math.max(1, parseInt(e.target.value) || 1))} className="text-center font-semibold text-base" />
                <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setQsQty(q => q + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-0.5">Total Charge</p>
              <p className="text-lg font-bold text-primary">
                ₦{qsSelectedItem ? formatNum(qsTotal) : "0"}
                {qsSelectedItem && (
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    (₦{formatNum(qsSelectedItem.price)} × {qsQty})
                  </span>
                )}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 pt-2">
            <Button className="w-full gap-2 h-11" onClick={handleQuickSaleAuthorize} disabled={qsBiometricScanning}>
              <Fingerprint className={`h-5 w-5 ${qsBiometricScanning ? "animate-pulse" : ""}`} />
              {qsBiometricScanning ? "Scanning Biometric…" : "Authorize Cash & Generate Receipt"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setQuickSaleOpen(false)} disabled={qsBiometricScanning}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bursary Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Financial tracking, invoice management, and payment processing for all students.
          </p>
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-medium w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            Restricted — Bursary Accounts Only
          </div>
        </div>
        <Button className="gap-2 self-start sm:self-auto" onClick={() => setPayOpen(true)}>
          <CreditCard className="h-4 w-4" />
          Pay Invoice
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">All Payments</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">Total invoice records</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Paid</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{paidCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Fully settled invoices</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Part-payments</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{partPayCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Partially settled</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Search / Filter / Quick Sale ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, ID, or payment type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Part-payment">Part-payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="default" className="gap-2 shrink-0" onClick={() => setQuickSaleOpen(true)}>
          <ShoppingCart className="h-4 w-4" />
          Quick Sale
        </Button>
      </div>

      {/* ── Invoices Table ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Invoice Register
              </CardTitle>
              <CardDescription>Click "Pay" on any row to process a payment. A biometric receipt is printed automatically.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{filtered.length} records</Badge>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCSV}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "980px" }}>
              <thead>
                <tr className="border-t border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Student Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Student ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Payment Type</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Total Amount</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Amount Paid</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Remaining Balance</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Payment Method</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={9} className="h-24 text-center text-muted-foreground text-sm">No invoices match your search.</td>
                  </tr>
                )}
                {visible.map(inv => (
                  <tr key={inv.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{inv.studentName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{inv.studentId}</td>
                    <td className="px-4 py-3 max-w-[200px]"><span className="truncate block">{inv.paymentType}</span></td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums whitespace-nowrap">₦{formatNum(inv.totalAmount)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold tabular-nums whitespace-nowrap">₦{formatNum(inv.amountPaid)}</td>
                    <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                      <span className={`font-bold ${inv.remainingBalance > 0 ? "text-rose-600" : "text-muted-foreground"}`}>
                        ₦{formatNum(inv.remainingBalance)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-center whitespace-nowrap"><MethodBadge method={inv.paymentMethod} /></td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {inv.status !== "Paid" ? (
                        <Button
                          size="sm" variant="outline"
                          className="h-7 px-3 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                          onClick={() => openPayModal(inv)}
                        >
                          <CreditCard className="h-3 w-3" />Pay
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />Cleared
                          </span>
                          <Button
                            size="sm" variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            title="Reprint Receipt"
                            onClick={() => {
                              const code = genReceiptCode(inv, inv.amountPaid);
                              printReceipt(inv, inv.amountPaid, 0, code);
                            }}
                          >
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {visible.length} of {filtered.length} records
            </p>
            {filtered.length > 8 && (
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setShowAll(prev => !prev)}>
                {showAll ? "Show Less" : `See All (${filtered.length - 8} more)`}
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showAll ? "rotate-90" : ""}`} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
