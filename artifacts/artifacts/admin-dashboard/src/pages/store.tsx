import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus, Trash2, Upload, Download, Search, Package, AlertTriangle,
  TrendingUp, ShoppingBag, FileSpreadsheet, Filter, Edit2, Check, X, Fingerprint,
} from "lucide-react";

type Category = "Textbook" | "Uniform" | "Tuition" | "Transport" | "Stationery" | "Other";

interface StoreItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

const CATEGORIES: Category[] = ["Textbook", "Uniform", "Tuition", "Transport", "Stationery", "Other"];

const CATEGORY_COLORS: Record<Category, string> = {
  Textbook:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Uniform:    "bg-violet-500/10 text-violet-600 border-violet-500/20",
  Tuition:    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Transport:  "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Stationery: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  Other:      "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const INITIAL_ITEMS: StoreItem[] = [
  { id: "1",  name: "Learn Grammar Textbook JSS 1",   category: "Textbook",   quantity: 120, price: 2500,  lowStockThreshold: 20 },
  { id: "2",  name: "Learn Grammar Textbook JSS 2",   category: "Textbook",   quantity: 95,  price: 2500,  lowStockThreshold: 20 },
  { id: "3",  name: "Learn Grammar Textbook JSS 3",   category: "Textbook",   quantity: 80,  price: 2700,  lowStockThreshold: 20 },
  { id: "4",  name: "Mathematics Textbook SSS 1",     category: "Textbook",   quantity: 14,  price: 3200,  lowStockThreshold: 20 },
  { id: "5",  name: "Mathematics Textbook SSS 2",     category: "Textbook",   quantity: 60,  price: 3200,  lowStockThreshold: 20 },
  { id: "6",  name: "Uniform Set (JSS) — Blue",       category: "Uniform",    quantity: 200, price: 8500,  lowStockThreshold: 30 },
  { id: "7",  name: "Uniform Set (SSS) — Brown",      category: "Uniform",    quantity: 175, price: 9200,  lowStockThreshold: 30 },
  { id: "8",  name: "Sports Kit — Full Set",          category: "Uniform",    quantity: 12,  price: 6500,  lowStockThreshold: 25 },
  { id: "9",  name: "Term 1 Tuition — JSS",                  category: "Tuition",    quantity: 999, price: 62000, lowStockThreshold: 0  },
  { id: "10", name: "Term 1 Tuition — SSS (Art)",            category: "Tuition",    quantity: 999, price: 72000, lowStockThreshold: 0  },
  { id: "10b",name: "Term 1 Tuition — SSS (Science)",        category: "Tuition",    quantity: 999, price: 78000, lowStockThreshold: 0  },
  { id: "10c",name: "Term 1 Tuition — SSS (Commercial)",     category: "Tuition",    quantity: 999, price: 75000, lowStockThreshold: 0  },
  { id: "10d",name: "Term 1 Tuition — SSS (Social Science)", category: "Tuition",    quantity: 999, price: 70000, lowStockThreshold: 0  },
  { id: "11", name: "Term 2 Tuition — JSS",                  category: "Tuition",    quantity: 999, price: 62000, lowStockThreshold: 0  },
  { id: "12", name: "Term 2 Tuition — SSS (Art)",            category: "Tuition",    quantity: 999, price: 72000, lowStockThreshold: 0  },
  { id: "12b",name: "Term 2 Tuition — SSS (Science)",        category: "Tuition",    quantity: 999, price: 78000, lowStockThreshold: 0  },
  { id: "12c",name: "Term 2 Tuition — SSS (Commercial)",     category: "Tuition",    quantity: 999, price: 75000, lowStockThreshold: 0  },
  { id: "12d",name: "Term 2 Tuition — SSS (Social Science)", category: "Tuition",    quantity: 999, price: 70000, lowStockThreshold: 0  },
  { id: "13", name: "School Bus Fee (Per Term)",       category: "Transport",  quantity: 999, price: 15000, lowStockThreshold: 0  },
  { id: "14", name: "School Diary / Planner",         category: "Stationery", quantity: 310, price: 1200,  lowStockThreshold: 50 },
  { id: "15", name: "Exercise Books (Pack of 10)",    category: "Stationery", quantity: 8,   price: 1800,  lowStockThreshold: 40 },
  { id: "16", name: "Art Supplies Kit",               category: "Stationery", quantity: 45,  price: 4500,  lowStockThreshold: 15 },
  { id: "17", name: "Exam Registration Fee",          category: "Other",      quantity: 999, price: 12000, lowStockThreshold: 0  },
  { id: "18", name: "Library Card Fee (Annual)",      category: "Other",      quantity: 999, price: 2000,  lowStockThreshold: 0  },
];


export default function SchoolStore() {
  const [items, setItems]       = useState<StoreItem[]>(INITIAL_ITEMS);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [newRow, setNewRow]     = useState(false);
  const [draft, setDraft]       = useState<Partial<StoreItem>>({ category: "Other", quantity: 0, price: 0, lowStockThreshold: 20 });

  const [showAll, setShowAll]       = useState(false);

  const [editOpen, setEditOpen]     = useState(false);
  const [editTarget, setEditTarget] = useState<StoreItem | null>(null);
  const [editBuf, setEditBuf]       = useState<Partial<StoreItem>>({});

  const [biometricOpen, setBiometricOpen]       = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricDone, setBiometricDone]         = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast }    = useToast();

  const filtered = items.filter(it => {
    const matchCat    = catFilter === "all" || it.category === catFilter;
    const matchSearch = it.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const visibleItems = showAll ? filtered : filtered.slice(0, 6);

  const totalValue = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const lowStock   = items.filter(i => i.lowStockThreshold > 0 && i.quantity <= i.lowStockThreshold);
  const totalItems = items.length;

  const openEditModal = (item: StoreItem) => {
    setEditTarget(item);
    setEditBuf({ name: item.name, category: item.category, quantity: item.quantity, price: item.price, lowStockThreshold: item.lowStockThreshold });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editTarget) return;
    if (!editBuf.name?.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setItems(prev =>
      prev.map(it => it.id === editTarget.id ? { ...it, ...editBuf } as StoreItem : it)
    );
    setEditOpen(false);
    setEditTarget(null);
    toast({ title: "Record updated", description: `"${editBuf.name}" saved successfully.` });
  };

  const handleCancelEdit = () => {
    setEditOpen(false);
    setEditTarget(null);
    setEditBuf({});
  };

  const deleteItem = (id: string, name: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
    toast({ title: "Item removed", description: `"${name}" was removed from the store.` });
  };

  const openBiometricForAdd = () => {
    if (!draft.name?.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    setBiometricDone(false);
    setBiometricScanning(false);
    setBiometricOpen(true);
  };

  const confirmBiometricAdd = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricDone(true);
      setTimeout(() => {
        const newItem: StoreItem = {
          id: Date.now().toString(),
          name: draft.name!.trim(),
          category: (draft.category as Category) || "Other",
          quantity: Number(draft.quantity) || 0,
          price: Number(draft.price) || 0,
          lowStockThreshold: Number(draft.lowStockThreshold) || 0,
        };
        setItems(prev => [...prev, newItem]);
        setNewRow(false);
        setDraft({ category: "Other", quantity: 0, price: 0, lowStockThreshold: 20 });
        setBiometricOpen(false);
        setBiometricDone(false);
        toast({ title: "Item added", description: `"${newItem.name}" added to the store.` });
      }, 700);
    }, 1800);
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv") {
      toast({ title: "Only CSV files are supported", description: "Please upload a .csv file with columns: Name, Category, Quantity, Price, LowStockThreshold", variant: "destructive" });
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      const dataLines = lines[0]?.toLowerCase().startsWith("name") ? lines.slice(1) : lines;
      const parsed: StoreItem[] = dataLines.map((line, i) => {
        const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
        return {
          id: `upload-${Date.now()}-${i}`,
          name: cols[0] || `Item ${i + 1}`,
          category: (CATEGORIES.includes(cols[1] as Category) ? cols[1] : "Other") as Category,
          quantity: parseInt(cols[2] ?? "0", 10) || 0,
          price: parseFloat(cols[3] ?? "0") || 0,
          lowStockThreshold: parseInt(cols[4] ?? "20", 10) || 0,
        };
      });
      setItems(prev => [...prev, ...parsed]);
      toast({ title: `${parsed.length} items imported`, description: "Store list updated from your CSV file." });
    };
    reader.readAsText(file);
    e.target.value = "";
  }, [toast]);

  const exportCSV = () => {
    const header = "Name,Category,Quantity,Price,LowStockThreshold";
    const rows = items.map(it => `"${it.name}",${it.category},${it.quantity},${it.price},${it.lowStockThreshold}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "school-store.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "store-items.csv downloaded." });
  };

  const isLow = (item: StoreItem) => item.lowStockThreshold > 0 && item.quantity <= item.lowStockThreshold;

  return (
    <div className="space-y-8">

      {/* ── Biometric Authorization Modal ── */}
      <Dialog open={biometricOpen} onOpenChange={open => { if (!open && !biometricScanning) setBiometricOpen(false); }}>
        <DialogContent className="sm:max-w-xs bg-white dark:bg-background text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-center">Biometric Authorization</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground text-center">
              Place your finger on the reader to authorize adding this item to the store.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-5 py-4">
            <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-500 ${
              biometricDone
                ? "border-emerald-500 bg-emerald-500/10"
                : biometricScanning
                  ? "border-primary bg-primary/10 animate-pulse"
                  : "border-border bg-muted"
            }`}>
              <Fingerprint className={`h-12 w-12 transition-colors duration-300 ${
                biometricDone ? "text-emerald-500" : biometricScanning ? "text-primary" : "text-muted-foreground"
              }`} />
              {biometricScanning && (
                <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
              )}
            </div>

            <p className="text-sm font-medium">
              {biometricDone
                ? "Identity verified — adding item…"
                : biometricScanning
                  ? "Scanning… hold still"
                  : "Ready to scan"}
            </p>

            {!biometricScanning && !biometricDone && (
              <p className="text-xs text-muted-foreground -mt-2">
                Adding: <span className="font-medium text-foreground">{draft.name || "—"}</span>
              </p>
            )}
          </div>

          <DialogFooter className="flex-row justify-center gap-2 pt-0">
            {!biometricScanning && !biometricDone && (
              <>
                <Button variant="outline" onClick={() => setBiometricOpen(false)}>Cancel</Button>
                <Button onClick={confirmBiometricAdd} className="gap-2">
                  <Fingerprint className="h-4 w-4" />Authorize
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Record Modal ── */}
      <Dialog open={editOpen} onOpenChange={open => { if (!open) handleCancelEdit(); }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Edit Record</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Update the details below, then click <span className="font-medium text-foreground">Save Changes</span> to apply.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-sm font-medium">Name</Label>
              <Input
                id="edit-name"
                autoFocus
                placeholder="Item name"
                value={editBuf.name ?? ""}
                onChange={e => setEditBuf(b => ({ ...b, name: e.target.value }))}
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-price" className="text-sm font-medium">Amount (₦)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">₦</span>
                <Input
                  id="edit-price"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={editBuf.price ?? ""}
                  onChange={e => setEditBuf(b => ({ ...b, price: Number(e.target.value) }))}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-qty" className="text-sm font-medium">Quantity</Label>
              <Input
                id="edit-qty"
                type="number"
                min={0}
                placeholder="0"
                value={editBuf.quantity ?? ""}
                onChange={e => setEditBuf(b => ({ ...b, quantity: Number(e.target.value) }))}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={editBuf.category as string}
                onValueChange={v => setEditBuf(b => ({ ...b, category: v as Category }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${CATEGORY_COLORS[c]}`}>
                        {c}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Store</h1>
          <p className="text-muted-foreground mt-1">
            Manage items, fees, uniforms, and supplies available to students and parents.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setNewRow(true)} disabled={newRow} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {CATEGORIES.length} categories</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Stock Value</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₦{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Quantity × unit price</p>
          </CardContent>
        </Card>

        <Card className={lowStock.length > 0 ? "border-rose-500/30 bg-rose-500/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${lowStock.length > 0 ? "text-rose-600" : "text-muted-foreground"}`}>Low Stock</CardTitle>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${lowStock.length > 0 ? "bg-rose-500/10" : "bg-muted"}`}>
              <AlertTriangle className={`h-4 w-4 ${lowStock.length > 0 ? "text-rose-500" : "text-muted-foreground"}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStock.length > 0 ? "text-rose-600" : ""}`}>{lowStock.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStock.length > 0 ? "Items need restocking" : "All items well stocked"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <FileSpreadsheet className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CATEGORIES.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Textbooks, Uniforms, Fees…</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Low-stock alert ── */}
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-rose-500/30 bg-rose-500/5">
          <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-rose-600">
              Low stock on {lowStock.length} item{lowStock.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {lowStock.map(i => i.name).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Items Table ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                Items & Pricing
              </CardTitle>
              <CardDescription>Click the edit icon on any row to open the record editor.</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">{filtered.length} items</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty in Stock</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price / Amount (₦)</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock Value</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">

                {/* Inline new-row form */}
                {newRow && (
                  <tr className="bg-primary/5 border-b border-primary/20">
                    <td className="px-4 py-2.5">
                      <Input
                        autoFocus
                        placeholder="Item name…"
                        value={draft.name || ""}
                        onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <Select value={draft.category as string} onValueChange={v => setDraft(d => ({ ...d, category: v as Category }))}>
                        <SelectTrigger className="h-8 text-sm w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2.5">
                      <Input
                        type="number" min={0}
                        value={draft.quantity ?? ""}
                        onChange={e => setDraft(d => ({ ...d, quantity: Number(e.target.value) }))}
                        className="h-8 text-sm text-right w-24 ml-auto"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <Input
                        type="number" min={0}
                        value={draft.price ?? ""}
                        onChange={e => setDraft(d => ({ ...d, price: Number(e.target.value) }))}
                        className="h-8 text-sm text-right w-32 ml-auto"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground text-xs">—</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="sm" className="h-7 px-3 text-xs gap-1" onClick={openBiometricForAdd}>
                          <Fingerprint className="h-3.5 w-3.5" /> Authorize & Save
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setNewRow(false)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                      No items match your search.
                    </td>
                  </tr>
                )}

                {visibleItems.map(item => {
                  const low = isLow(item);
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-muted/30 ${low ? "bg-rose-500/5" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium max-w-[240px]">
                        <div className="flex items-center gap-2">
                          {low && <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" title="Low stock" />}
                          <span className="truncate">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${CATEGORY_COLORS[item.category]}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold tabular-nums ${low ? "text-rose-600" : ""}`}>
                          {item.quantity === 999 ? "∞" : item.quantity.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold tabular-nums">₦{item.price.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground text-xs tabular-nums">
                        {item.quantity === 999 ? "—" : `₦${(item.quantity * item.price).toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm" variant="ghost"
                            className="h-7 w-7 p-0 opacity-50 hover:opacity-100 transition-opacity"
                            onClick={() => openEditModal(item)}
                            title="Edit record"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm" variant="ghost"
                            className="h-7 w-7 p-0 opacity-50 hover:opacity-100 hover:text-destructive transition-all"
                            onClick={() => deleteItem(item.id, item.name)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* See More / CSV footer */}
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center gap-3">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Import a CSV with columns: <span className="font-mono text-foreground">Name, Category, Quantity, Price, LowStockThreshold</span>
            </p>
            {filtered.length > 6 && (
              <Button
                variant="outline"
                size="sm"
                className="ml-auto h-7 text-xs gap-1.5"
                onClick={() => setShowAll(prev => !prev)}
              >
                {showAll ? "Show Less" : `See More (${filtered.length - 6} more)`}
              </Button>
            )}
            {filtered.length <= 6 && (
              <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs gap-1.5" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" />
                Upload CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
