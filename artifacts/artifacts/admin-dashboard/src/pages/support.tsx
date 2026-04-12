import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Send, Mail, MessageSquare, Users, Clock, CheckCircle2,
  Megaphone, CalendarDays, ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

type MessageType = "Email" | "SMS" | "";

interface BroadcastLog {
  id: string;
  type: "Email" | "SMS";
  audience: string;
  subject?: string;
  preview: string;
  sentAt: string;
  recipients: number;
  status: "Delivered" | "Partial" | "Pending";
}

const BROADCAST_HISTORY: BroadcastLog[] = [
  {
    id: "MSG-001", type: "SMS",   audience: "All Parents",
    preview: "Dear Parent, kindly note that second-term school fees are due by 30 April 2026. Payments can be made at the bursary or via transfer. Thank you.",
    sentAt: "2026-04-10T09:15:00", recipients: 218, status: "Delivered",
  },
  {
    id: "MSG-002", type: "Email", audience: "Pending Payments",
    subject: "Fee Payment Reminder — Term 1 2026",
    preview: "This is a reminder that your ward's school fees for Term 1 are still outstanding. Please settle promptly to avoid disruption of services.",
    sentAt: "2026-04-07T14:30:00", recipients: 47, status: "Delivered",
  },
  {
    id: "MSG-003", type: "SMS",   audience: "Part Payments",
    preview: "A balance remains on your ward's school fee account. Please complete payment at the bursary at your earliest convenience. — Metrix School.",
    sentAt: "2026-04-05T11:00:00", recipients: 18, status: "Delivered",
  },
  {
    id: "MSG-004", type: "Email", audience: "All Parents",
    subject: "Inter-House Sports Day — Friday 18 April 2026",
    preview: "We are pleased to invite you to our Inter-House Sports Day celebration. Students are expected to arrive by 8:00 AM in their house colours.",
    sentAt: "2026-04-03T08:00:00", recipients: 218, status: "Partial",
  },
  {
    id: "MSG-005", type: "SMS",   audience: "All Parents",
    preview: "School will be closed Monday 14 April 2026 for a public holiday. Normal resumption is Tuesday 15 April. Thank you. — Metrix School.",
    sentAt: "2026-04-01T16:45:00", recipients: 218, status: "Delivered",
  },
];

const AUDIENCE_LABELS: Record<string, { label: string; count: number; color: string }> = {
  "All Parents":      { label: "All Parents",      count: 218, color: "text-primary bg-primary/10 border-primary/20" },
  "Pending Payments": { label: "Pending Payments", count: 47,  color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  "Part Payments":    { label: "Part Payments",     count: 18,  color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
  "Bus Pass Holders": { label: "Bus Pass Holders",  count: 10,  color: "text-violet-600 bg-violet-500/10 border-violet-500/20" },
  "SSS Students":     { label: "SSS Students",      count: 94,  color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  "JSS Students":     { label: "JSS Students",      count: 124, color: "text-rose-600 bg-rose-500/10 border-rose-500/20" },
};

export default function SupportDesk() {
  const [messageType, setMessageType] = useState<MessageType>("");
  const [audience, setAudience] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  const audienceInfo = AUDIENCE_LABELS[audience];
  const charCount = body.length;
  const smsPages = messageType === "SMS" ? Math.ceil(charCount / 160) || 0 : 0;
  const canSend = !!audience && !!messageType && body.trim().length > 0 &&
    (messageType === "SMS" || !!subject.trim());

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({
        title: `${messageType} broadcast sent ✓`,
        description: `Message delivered to ${audienceInfo?.count ?? 0} recipient${(audienceInfo?.count ?? 0) === 1 ? "" : "s"} (${audience}).`,
      });
      setAudience(""); setMessageType(""); setSubject(""); setBody("");
    }, 2000);
  };

  const visibleHistory = showAll ? BROADCAST_HISTORY : BROADCAST_HISTORY.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Megaphone className="h-7 w-7 text-primary" />
            Support Desk
          </h1>
          <p className="text-muted-foreground mt-1">
            Send mass email and SMS communications directly to parents, students, and stakeholders.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-medium">
            <Users className="h-3.5 w-3.5" />
            218 registered contacts
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Sent</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{BROADCAST_HISTORY.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total broadcasts this term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recipients Reached</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {BROADCAST_HISTORY.reduce((s, m) => s + m.recipients, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all broadcasts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivery Rate</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">96.3%</div>
            <p className="text-xs text-muted-foreground mt-1">Average delivery success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Compose Message Card ── */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Compose Message</CardTitle>
              <CardDescription>Broadcast a message to a targeted group of parents or students.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">

          {/* Row 1: Audience + Message Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-sm font-medium">
                Target Audience <span className="text-destructive">*</span>
              </Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience">
                  <SelectValue placeholder="Select who will receive this message…" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AUDIENCE_LABELS).map(([key, { label, count }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center justify-between gap-6 w-full">
                        <span>{label}</span>
                        <span className="text-xs text-muted-foreground">{count} contacts</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {audience && audienceInfo && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  This will reach <strong className="text-foreground mx-0.5">{audienceInfo.count}</strong> contact{audienceInfo.count !== 1 ? "s" : ""}.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="msgType" className="text-sm font-medium">
                Message Type <span className="text-destructive">*</span>
              </Label>
              <Select value={messageType} onValueChange={(v) => { setMessageType(v as MessageType); if (v === "SMS") setSubject(""); }}>
                <SelectTrigger id="msgType">
                  <SelectValue placeholder="Choose delivery channel…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SMS">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                      <span>SMS</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {messageType === "SMS" && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  SMS is limited to 160 characters per page. {smsPages > 0 && <span className="font-medium text-amber-600 ml-0.5">{smsPages} page{smsPages !== 1 ? "s" : ""}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Email Subject — only visible when type = Email */}
          {messageType === "Email" && (
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Email Subject <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="subject"
                  placeholder="e.g. Term 1 Fee Payment Reminder"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {/* Message Body */}
          <div className="space-y-2">
            <Label htmlFor="body" className="text-sm font-medium flex items-center justify-between">
              <span>Message Body <span className="text-destructive">*</span></span>
              {messageType === "SMS" && (
                <span className={`text-xs font-normal ${charCount > 160 ? "text-amber-600" : "text-muted-foreground"}`}>
                  {charCount} / 160 chars {smsPages > 1 && `(${smsPages} SMS pages)`}
                </span>
              )}
              {messageType === "Email" && (
                <span className="text-xs font-normal text-muted-foreground">{charCount} characters</span>
              )}
            </Label>
            <Textarea
              id="body"
              placeholder={
                messageType === "SMS"
                  ? "Type your SMS message here (max 160 chars for single page)…"
                  : messageType === "Email"
                  ? "Type the full email body here. You may include paragraphs, instructions, and contact details…"
                  : "Select a message type above, then type your message here…"
              }
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={7}
              className="resize-none text-sm leading-relaxed"
              disabled={!messageType}
            />
          </div>

          {/* Preview block */}
          {audience && messageType && body.trim() && (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview</p>
              <div className="flex items-center gap-2 flex-wrap">
                {messageType === "Email" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    <Mail className="h-3 w-3" />Email
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <MessageSquare className="h-3 w-3" />SMS
                  </span>
                )}
                <span className="text-xs text-muted-foreground">→</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${audienceInfo?.color}`}>
                  {audience} ({audienceInfo?.count})
                </span>
              </div>
              {messageType === "Email" && subject && (
                <p className="text-xs"><span className="font-semibold">Subject:</span> {subject}</p>
              )}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 italic">"{body}"</p>
            </div>
          )}

          {/* Send Button */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              className="gap-2 px-8 h-11"
              disabled={!canSend || sending}
              onClick={handleSend}
            >
              {sending ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send {messageType || "Message"}
                  {audience && audienceInfo && ` to ${audienceInfo.count} Recipients`}
                </>
              )}
            </Button>
            {(!canSend && (audience || messageType || body)) && (
              <p className="text-xs text-muted-foreground">
                {!audience ? "Select a target audience." :
                  !messageType ? "Choose a message type." :
                  messageType === "Email" && !subject.trim() ? "Add an email subject." :
                  !body.trim() ? "Write your message." : ""}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Broadcast History ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Broadcasts
              </CardTitle>
              <CardDescription>A history of all mass messages sent this term.</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">{BROADCAST_HISTORY.length} total</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {visibleHistory.map(msg => (
              <div key={msg.id} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      msg.type === "Email"
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                    }`}>
                      {msg.type === "Email" ? <Mail className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold">
                          {msg.subject ?? (msg.type === "SMS" ? "SMS Broadcast" : "Email Broadcast")}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          AUDIENCE_LABELS[msg.audience]?.color ?? "bg-muted text-muted-foreground border-border"
                        }`}>
                          {msg.audience}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          msg.status === "Delivered"
                            ? "text-emerald-600 bg-emerald-500/10"
                            : msg.status === "Partial"
                            ? "text-amber-600 bg-amber-500/10"
                            : "text-muted-foreground bg-muted"
                        }`}>
                          {msg.status === "Delivered" && <CheckCircle2 className="h-2.5 w-2.5" />}
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{msg.preview}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium tabular-nums">{msg.recipients} recipients</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 justify-end">
                      <CalendarDays className="h-3 w-3" />
                      {format(new Date(msg.sentAt), "MMM d, HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {BROADCAST_HISTORY.length > 3 && (
            <div className="px-6 py-3 border-t border-border">
              <Button
                variant="ghost" size="sm"
                className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3"
                onClick={() => setShowAll(prev => !prev)}
              >
                {showAll ? "Show less" : `See all ${BROADCAST_HISTORY.length} broadcasts`}
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showAll ? "rotate-90" : ""}`} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
