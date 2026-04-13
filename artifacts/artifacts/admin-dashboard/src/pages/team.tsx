import { useState } from "react";
import { useListUsers, useCreateUser, useUpdateUser, useDeleteUser, getListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Edit2, Trash, Loader2, Users2, CreditCard, BookOpen,
  Headphones, Shield, Mail, Fingerprint, ShieldCheck,
} from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; team: string; teamId: string }> = {
  admin:   { label: "Proprietor", team: "Team Management",   teamId: "management" },
  manager: { label: "Admin",      team: "Student Directory",  teamId: "directory"  },
  member:  { label: "Accounts",   team: "Bursary Accounts",  teamId: "accounts"   },
  viewer:  { label: "Support",    team: "Support Desk",       teamId: "support"    },
};

const TEAMS = [
  {
    id: "management",
    name: "Team Management",
    icon: Users2,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    borderColor: "border-primary/20",
    description: "Proprietors with full system access",
    roles: ["admin"],
    accessNote: "Full dashboard access",
  },
  {
    id: "directory",
    name: "Student Directory",
    icon: CreditCard,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "Manages student records and invoicing",
    roles: ["manager"],
    accessNote: "Student Directory dashboard",
  },
  {
    id: "accounts",
    name: "Bursary Accounts",
    icon: BookOpen,
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    description: "Financial accounts and reporting",
    roles: ["member"],
    accessNote: "Bursary Accounts dashboard",
  },
  {
    id: "support",
    name: "Support Desk",
    icon: Headphones,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "Handles student and parent inquiries",
    roles: ["viewer"],
    accessNote: "Support dashboard",
  },
];

const inviteSchema = z.object({
  name:  z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  role:  z.enum(["admin", "manager", "member", "viewer"]),
});

type InviteValues = z.infer<typeof inviteSchema>;

function StatusDot({ status }: { status: string }) {
  if (status === "active")
    return <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500" title="Active" />;
  if (status === "suspended")
    return <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500" title="Inactive" />;
  return <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-400" title="Pending" />;
}

function statusLabel(status: string) {
  if (status === "active") return "Active";
  if (status === "suspended") return "Inactive";
  return "Pending";
}

function statusColor(status: string) {
  if (status === "active") return "text-emerald-600 dark:text-emerald-400";
  if (status === "suspended") return "text-rose-600 dark:text-rose-400";
  return "text-amber-600 dark:text-amber-400";
}

export default function TeamManagement() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [editBuf, setEditBuf] = useState({ name: "", email: "", role: "manager", status: "active" });
  const [editBioState, setEditBioState] = useState<"idle" | "scanning" | "done">("idle");

  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<any | null>(null);
  const [removeBioState, setRemoveBioState] = useState<"idle" | "scanning" | "done">("idle");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useListUsers({ query: { queryKey: getListUsersQueryKey(), refetchInterval: 30000 } });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "", role: "manager" },
  });

  const onSubmit = (values: InviteValues) => {
    createUser.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          const team = ROLE_CONFIG[values.role]?.team ?? "";
          toast({ title: "Invite sent", description: `${values.name} has been invited to the ${team} team.` });
          setIsInviteOpen(false);
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send invite.", variant: "destructive" });
        },
      }
    );
  };

  const openEdit = (user: any) => {
    setEditBuf({ name: user.name, email: user.email, role: user.role, status: user.status });
    setEditTarget(user);
    setEditBioState("idle");
    setEditOpen(true);
  };

  const confirmEdit = () => {
    setEditBioState("scanning");
    setTimeout(() => {
      setEditBioState("done");
      setTimeout(() => {
        updateUser.mutate(
          { id: editTarget.id, data: editBuf },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
              toast({ title: "Member updated", description: `${editBuf.name}'s details have been saved.` });
              setEditOpen(false);
              setEditBioState("idle");
            },
            onError: () => {
              toast({ title: "Error", description: "Failed to update member.", variant: "destructive" });
              setEditBioState("idle");
            },
          }
        );
      }, 600);
    }, 1800);
  };

  const openRemove = (user: any) => {
    setRemoveTarget(user);
    setRemoveBioState("idle");
    setRemoveOpen(true);
  };

  const confirmRemove = () => {
    setRemoveBioState("scanning");
    setTimeout(() => {
      setRemoveBioState("done");
      setTimeout(() => {
        deleteUser.mutate(
          { id: removeTarget.id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
              toast({ title: "Member removed", description: `${removeTarget.name} has been removed from the team.` });
              setRemoveOpen(false);
              setRemoveBioState("idle");
            },
          }
        );
      }, 600);
    }, 1800);
  };

  const activeCount   = users?.filter(u => u.status === "active").length ?? 0;
  const pendingCount  = users?.filter(u => u.status === "invited").length ?? 0;
  const inactiveCount = users?.filter(u => u.status === "suspended").length ?? 0;
  const totalCount    = users?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage departments, roles, and staff access across the school.
          </p>
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            Restricted — Proprietor Only
          </div>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Assign a role to invite a staff member. They will be added to their respective team.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="jane@school.edu" type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role & Team Assignment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex flex-col">
                              <span className="font-medium">Proprietor</span>
                              <span className="text-xs text-muted-foreground">→ Team Management · Full access</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="manager">
                            <div className="flex flex-col">
                              <span className="font-medium">Admin</span>
                              <span className="text-xs text-muted-foreground">→ Student Directory dashboard</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="member">
                            <div className="flex flex-col">
                              <span className="font-medium">Accounts</span>
                              <span className="text-xs text-muted-foreground">→ Bursary Accounts dashboard</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <div className="flex flex-col">
                              <span className="font-medium">Support</span>
                              <span className="text-xs text-muted-foreground">→ Support Desk dashboard</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createUser.isPending}>
                    {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invite
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span><span className="font-semibold text-foreground">{totalCount}</span> total members</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span><span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeCount}</span> active</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span><span className="font-semibold text-amber-600 dark:text-amber-400">{pendingCount}</span> pending</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span><span className="font-semibold text-rose-600 dark:text-rose-400">{inactiveCount}</span> inactive</span>
        </span>
      </div>

      {/* Team Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {TEAMS.map((team) => {
          const teamMembers = users?.filter(u => team.roles.includes(u.role)) ?? [];
          const activeMembers = teamMembers.filter(u => u.status === "active");
          const Icon = team.icon;

          return (
            <Card key={team.id} className={`border ${team.borderColor} transition-shadow hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${team.iconBg} border ${team.borderColor}`}>
                      <Icon className={`h-5 w-5 ${team.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">{team.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{team.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-2xl font-bold leading-none">
                      {isLoading ? <Skeleton className="h-7 w-6" /> : teamMembers.length}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">members</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Access badge */}
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${team.iconBg} ${team.iconColor} border ${team.borderColor}`}>
                  <Shield className="h-3 w-3" />
                  {team.accessNote}
                </div>

                {/* Member list */}
                <div className="space-y-0 divide-y divide-border/50">
                  {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-3.5 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))
                  ) : teamMembers.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-3 text-center">No members assigned yet.</p>
                  ) : (
                    teamMembers.map((user) => (
                      <div key={user.id} className="flex items-center gap-3 py-2.5 group">
                        <div className="relative">
                          <Avatar className="h-7 w-7 border border-border">
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback className="text-[10px] font-semibold bg-muted">
                              {user.name.charAt(0)}{user.name.split(" ")[1]?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <StatusDot status={user.status} />
                            <span className="text-xs font-medium truncate">{user.name}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="h-2.5 w-2.5" />
                            <span className="truncate">{user.email}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`text-[10px] font-medium ${statusColor(user.status)}`}>
                            {statusLabel(user.status)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit member"
                            onClick={() => openEdit(user)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Remove member"
                            onClick={() => openRemove(user)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Active count footer */}
                {!isLoading && teamMembers.length > 0 && (
                  <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{activeMembers.length} of {teamMembers.length} active</span>
                    <span>Joined {teamMembers[0] ? format(new Date(teamMembers[0].joinedAt), "MMM yyyy") : "—"}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Edit Member Modal ── */}
      <Dialog open={editOpen} onOpenChange={(o) => { if (!o) { setEditOpen(false); setEditBioState("idle"); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update details for {editTarget?.name}. Biometric authentication is required to save changes.</DialogDescription>
          </DialogHeader>

          {editBioState === "idle" && (
            <div className="space-y-4 py-1">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={editBuf.name}
                  onChange={(e) => setEditBuf(b => ({ ...b, name: e.target.value }))}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  value={editBuf.email}
                  onChange={(e) => setEditBuf(b => ({ ...b, email: e.target.value }))}
                  placeholder="jane@school.edu"
                  type="email"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Role</label>
                <Select value={editBuf.role} onValueChange={(v) => setEditBuf(b => ({ ...b, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Proprietor</SelectItem>
                    <SelectItem value="manager">Admin</SelectItem>
                    <SelectItem value="member">Accounts</SelectItem>
                    <SelectItem value="viewer">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select value={editBuf.status} onValueChange={(v) => setEditBuf(b => ({ ...b, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Pending</SelectItem>
                    <SelectItem value="suspended">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {(editBioState === "scanning" || editBioState === "done") && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className={`relative flex items-center justify-center h-20 w-20 rounded-full ${editBioState === "done" ? "bg-emerald-500/10" : "bg-primary/10"}`}>
                {editBioState === "scanning" && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                )}
                <Fingerprint className={`h-10 w-10 transition-colors ${editBioState === "done" ? "text-emerald-500" : "text-primary animate-pulse"}`} />
              </div>
              <p className="text-sm font-medium text-center">
                {editBioState === "scanning" ? "Verifying identity… place your finger on the sensor" : "Identity confirmed — saving changes"}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); setEditBioState("idle"); }} disabled={editBioState !== "idle"}>Cancel</Button>
            <Button onClick={confirmEdit} disabled={editBioState !== "idle" || !editBuf.name || !editBuf.email}>
              <Fingerprint className="h-4 w-4 mr-2" />
              Authenticate & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Remove Member Modal ── */}
      <Dialog open={removeOpen} onOpenChange={(o) => { if (!o) { setRemoveOpen(false); setRemoveBioState("idle"); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              You are about to remove <span className="font-semibold text-foreground">{removeTarget?.name}</span> from the team. This action requires biometric confirmation.
            </DialogDescription>
          </DialogHeader>

          {removeBioState !== "idle" && (
            <div className="flex flex-col items-center justify-center py-6 gap-4">
              <div className={`relative flex items-center justify-center h-20 w-20 rounded-full ${removeBioState === "done" ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                {removeBioState === "scanning" && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-destructive/20" />
                )}
                <Fingerprint className={`h-10 w-10 transition-colors ${removeBioState === "done" ? "text-emerald-500" : "text-destructive animate-pulse"}`} />
              </div>
              <p className="text-sm font-medium text-center">
                {removeBioState === "scanning" ? "Verifying identity… place your finger on the sensor" : "Identity confirmed — removing member"}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setRemoveOpen(false); setRemoveBioState("idle"); }} disabled={removeBioState !== "idle"}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRemove} disabled={removeBioState !== "idle"}>
              <Fingerprint className="h-4 w-4 mr-2" />
              Authenticate & Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
