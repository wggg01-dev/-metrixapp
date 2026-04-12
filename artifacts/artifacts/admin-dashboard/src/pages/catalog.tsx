import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Upload, Download, Tag, Lightbulb, Save,
  PackageSearch, TrendingUp, FileText, RefreshCw, ToggleLeft,
} from "lucide-react";

type Category = "Tuition" | "Supplies" | "Transport" | "Uniform" | "Levy" | "Other";
type Level = "All" | "JSS 1" | "JSS 2" | "JSS 3" | "SSS 1" | "SSS 2" | "SSS 3" | "JSS" | "SSS";

interface CatalogItem {
  id: string;
  name: string;
  category: Category;
  level: Level;
  quantity: string;
  price: string;
  active: boolean;
}

const CATEGORIES: Category[] = ["Tuition", "Supplies", "Transport", "Uniform", "Levy", "Other"];
const LEVELS: Level[]        = ["All", "JSS", "SSS", "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];

const CATEGORY_STYLE: Record<Category, string> = {
  Tuition:   "bg-primary/10 text-primary border-primary/20",
  Supplies:  "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Transport: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Uniform:   "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Levy:      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  Other:     "bg-muted text-muted-foreground border-border",
};

const uid = () => Math.random().toString(36).slice(2, 9);

const INITIAL_ITEMS: CatalogItem[] = [
  { id: uid(), name: "Term 1 Tuition Fee",            category: "Tuition",   level: "JSS 1", quantity: "—",  price: "62000",  active: true  },
  { id: uid(), name: "Term 1 Tuition Fee",            category: "Tuition",   level: "JSS 2", quantity: "—",  price: "65000",  active: true  },
  { id: uid(), name: "Term 1 Tuition Fee",            category: "Tuition",   level: "JSS 3", quantity: "—",  price: "70000",  active: true  },
  { id: uid(), name: "Term 1 Tuition Fee",            category: "Tuition",   level: "SSS 1", quantity: "—",  price: "80000",  active: true  },
  { id: uid(), name: "Term 1 Tuition Fee",            category: "Tuition",   level: "SSS 2", quantity: "—",  price: "85000",  active: true  },
  { id: uid(), name: "Term 1 Tuition Fee",            category: "Tuition",   level: "SSS 3", quantity: "—",  price: "90000",  active: true  },
  { id: uid(), name: "Learn Grammar Textbook",        category: "Supplies",  level: "JSS 2", quantity: "150", price: "4500",  active: true  },
  { id: uid(), name: "Mathematics Textbook",          category: "Supplies",  level: "JSS 1", quantity: "120", price: "3800",  active: true  },
  { id: uid(), name: "Biology Practical Kit",         category: "Supplies",  level: "SSS 2", quantity: "60",  price: "12500", active: true  },
  { id: uid(), name: "Uniform Set (Boys)",            category: "Uniform",   level: "All",   quantity: "200", price: "18000", active: true  },
  { id: uid(), name: "Uniform Set (Girls)",           category: "Uniform",   level: "All",   quantity: "180", price: "18500", active: true  },
  { id: uid(), name: "Sports Kit",                    category: "Uniform",   level: "All",   quantity: "300", price: "8000",  active: true  },
  { id: uid(), name: "Bus Fee (Per Term)",            category: "Transport", level: "All",   quantity: "—",   price: "25000", active: true  },
  { id: uid(), name: "PTA Levy",                      category: "Levy",      level: "All",   quantity: "—",   price: "5000",  active: true  },
  { id: uid(), name: "Development Levy",              category: "Levy",      level: "All",   quantity: "—",   price: "10000", active: true  },
  { id: uid(), name: "Library Access Fee",            category: "Levy",      level: "All",   quantity: "—",   price: "2500",  active: false },
];

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    title: "Bulk Price Update",
    desc: "Adjust prices for an entire category or term by a fixed amount or percentage — ideal for yearly fee reviews.",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: FileText,
    title: "Apply to Invoice",
    desc: "Select one or more catalog items and add them directly to a student's or class's invoice in one click.",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: RefreshCw,
    title: "Copy from Previous Term",
    desc: "Import the full catalog from a prior term so you only update what changed instead of starting from scratch.",
    color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: ToggleLeft,
    title: "Activate / Deactivate Items",
    desc: "Toggle items off for a term without deleting them — deactivated items are excluded from all auto-billing runs.",
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: PackageSearch,
    title: "Low-Stock Alerts",
    desc: "Get notified when physical goods (uniforms, textbooks, kits) fall below a reorder threshold.",
    color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

export default function Catalog() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<CatalogItem[]>(INITIAL_ITEMS);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const filtered = categoryFilter === "all"
    ? items
    : items.filter(i => i.category === categoryFilter);

  const update = (id: string, field: keyof CatalogItem, value: string | boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    setHasUnsaved(true);
  };

  const addRow = () => {
    setItems(prev => [
      ...prev,
      { id: uid(), name: "", category: "Other", level: "All", quantity: "", price: "", active: true },
    ]);
    setHasUnsaved(true);
  };

  const deleteRow = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setHasUnsaved(true);
  };

  const handleSave = () => {
    setHasUnsaved(false);
    toast({ title: "Catalog saved", description: `${items.length} items saved successfully.` });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast({ title: "File received", description: `"${file.name}" will be imported into the catalog.` });
    e.target.value = "";
  };

  const handleExport = () => {
    toast({ title: "Export ready", description: "Catalog exported as CSV." });
  };

  const activeCount = items.filter(i => i.active).length;
  const totalValue  = items
    .filter(i => i.active && i.price && i.price !== "—")
    .reduce((s, i) => s + Number(i.price), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Manage school fees, supplies, and charges. Edit inline, then save.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV / Excel
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleUpload} />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsaved}>
            <Save className="h-4 w-4 mr-2" />
            {hasUnsaved ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <span><span className="font-semibold text-foreground">{items.length}</span> total items</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span><span className="font-semibold text-foreground">{activeCount}</span> active</span>
        </span>
        <span><span className="font-semibold text-foreground">{items.length - activeCount}</span> inactive</span>
        <span className="ml-auto font-semibold text-foreground">
          Total listed: ₦{totalValue.toLocaleString()}
        </span>
      </div>

      {/* Unsaved banner */}
      {hasUnsaved && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-600 dark:text-amber-400">
          <span>You have unsaved changes.</span>
          <Button size="sm" className="h-7 px-3 text-xs" onClick={handleSave}>Save now</Button>
        </div>
      )}

      {/* Catalog Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Catalog Items
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={addRow}>
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-border bg-muted/40">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap w-[280px]">Item Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Level</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Qty</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Price (₦)</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-2.5 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                      No items in this category.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={`group transition-colors ${item.active ? "hover:bg-muted/30" : "opacity-50 bg-muted/10"}`}
                    >
                      {/* Name */}
                      <td className="px-4 py-2">
                        <Input
                          value={item.name}
                          onChange={e => update(item.id, "name", e.target.value)}
                          placeholder="Item name…"
                          className="h-8 text-sm border-transparent bg-transparent hover:border-border focus:border-border focus:bg-background transition-colors px-2"
                        />
                      </td>

                      {/* Category */}
                      <td className="px-4 py-2">
                        <Select value={item.category} onValueChange={v => update(item.id, "category", v)}>
                          <SelectTrigger className="h-8 text-xs w-32 border-transparent bg-transparent hover:border-border focus:border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Level */}
                      <td className="px-4 py-2">
                        <Select value={item.level} onValueChange={v => update(item.id, "level", v)}>
                          <SelectTrigger className="h-8 text-xs w-28 border-transparent bg-transparent hover:border-border focus:border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-2">
                        <Input
                          value={item.quantity}
                          onChange={e => update(item.id, "quantity", e.target.value)}
                          placeholder="—"
                          className="h-8 text-sm w-20 border-transparent bg-transparent hover:border-border focus:border-border focus:bg-background transition-colors px-2 tabular-nums"
                        />
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2">
                        <div className="relative w-32">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">₦</span>
                          <Input
                            value={item.price}
                            onChange={e => update(item.id, "price", e.target.value.replace(/[^\d]/g, ""))}
                            placeholder="0"
                            className="h-8 text-sm pl-6 border-transparent bg-transparent hover:border-border focus:border-border focus:bg-background transition-colors tabular-nums"
                          />
                        </div>
                      </td>

                      {/* Status toggle */}
                      <td className="px-4 py-2">
                        <button
                          onClick={() => update(item.id, "active", !item.active)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            item.active
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground border-border hover:bg-muted/60"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.active ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                          {item.active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={() => deleteRow(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground" onClick={addRow}>
              <Plus className="h-3.5 w-3.5" />
              Add new item
            </Button>
            <span className="text-xs text-muted-foreground">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} shown
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Features */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Suggested Features</h2>
          <Badge variant="outline" className="text-xs">Coming soon</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUGGESTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
