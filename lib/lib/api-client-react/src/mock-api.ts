import type {
  ActivityItem,
  AnalyticsOverview,
  Customer,
  GrowthDataPoint,
  Invoice,
  PlanDistributionItem,
  RevenueDataPoint,
  TeamUser,
} from "./generated/api.schemas";

type MockState = {
  customers: Customer[];
  users: TeamUser[];
  invoices: Invoice[];
  activity: ActivityItem[];
};

const STORAGE_KEY = "metrix_mock_api_state_v1";

const today = () => new Date().toISOString().slice(0, 10);

const seedState: MockState = {
  customers: [
    { id: 1, name: "Amara Okonkwo", email: "amara.parent@example.com", company: "Metrix School", plan: "enterprise", status: "active", mrr: 78000, joinedAt: "2026-03-28", avatarUrl: null },
    { id: 2, name: "Emeka Chukwu", email: "emeka.parent@example.com", company: "Metrix School", plan: "starter", status: "trial", mrr: 62000, joinedAt: "2026-04-01", avatarUrl: null },
    { id: 3, name: "Fatima Bello", email: "fatima.parent@example.com", company: "Metrix School", plan: "pro", status: "active", mrr: 72000, joinedAt: "2026-04-02", avatarUrl: null },
    { id: 4, name: "Tunde Adeyemi", email: "tunde.parent@example.com", company: "Metrix School", plan: "starter", status: "active", mrr: 15000, joinedAt: "2026-04-01", avatarUrl: null },
    { id: 5, name: "Chisom Eze", email: "chisom.parent@example.com", company: "Metrix School", plan: "pro", status: "trial", mrr: 75000, joinedAt: "2026-04-04", avatarUrl: null },
    { id: 6, name: "Ngozi Obi", email: "ngozi.parent@example.com", company: "Metrix School", plan: "enterprise", status: "active", mrr: 62000, joinedAt: "2026-03-30", avatarUrl: null },
  ],
  users: [
    { id: 1, name: "Adaora Nwankwo", email: "adaora@metrixschool.edu.ng", role: "admin", status: "active", avatarUrl: null, joinedAt: "2026-01-05" },
    { id: 2, name: "Samuel Okafor", email: "samuel@metrixschool.edu.ng", role: "manager", status: "active", avatarUrl: null, joinedAt: "2026-01-16" },
    { id: 3, name: "Bola Adebayo", email: "bola@metrixschool.edu.ng", role: "member", status: "active", avatarUrl: null, joinedAt: "2026-02-03" },
    { id: 4, name: "Ifeoma Eze", email: "ifeoma@metrixschool.edu.ng", role: "viewer", status: "invited", avatarUrl: null, joinedAt: "2026-04-08" },
  ],
  invoices: [
    { id: 1, customerId: 1, customerName: "Amara Okonkwo", amount: 78000, status: "paid", issuedAt: "2026-03-28", dueAt: "2026-04-15", plan: "Tuition" },
    { id: 2, customerId: 2, customerName: "Emeka Chukwu", amount: 62000, status: "pending", issuedAt: "2026-04-01", dueAt: "2026-04-30", plan: "Tuition" },
    { id: 3, customerId: 3, customerName: "Fatima Bello", amount: 36000, status: "paid", issuedAt: "2026-04-02", dueAt: "2026-04-20", plan: "Part Payment" },
    { id: 4, customerId: 4, customerName: "Tunde Adeyemi", amount: 15000, status: "paid", issuedAt: "2026-04-01", dueAt: "2026-04-15", plan: "Bus Pass" },
    { id: 5, customerId: 5, customerName: "Chisom Eze", amount: 75000, status: "overdue", issuedAt: "2026-04-04", dueAt: "2026-04-12", plan: "Tuition" },
    { id: 6, customerId: 6, customerName: "Ngozi Obi", amount: 62000, status: "paid", issuedAt: "2026-03-30", dueAt: "2026-04-15", plan: "Tuition" },
  ],
  activity: [
    { id: 1, type: "invoice_paid", description: "Receipt printed and payment confirmed", entityName: "Amara Okonkwo", occurredAt: "2026-04-16T08:10:00.000Z", metadata: { amount: 78000 } },
    { id: 2, type: "user_invited", description: "Staff invite email queued and marked delivered", entityName: "Ifeoma Eze", occurredAt: "2026-04-15T14:30:00.000Z", metadata: { channel: "email" } },
    { id: 3, type: "invoice_overdue", description: "Payment reminder ping simulated", entityName: "Chisom Eze", occurredAt: "2026-04-14T10:45:00.000Z", metadata: { channel: "sms" } },
    { id: 4, type: "customer_joined", description: "New parent record created", entityName: "Ngozi Obi", occurredAt: "2026-03-30T12:20:00.000Z", metadata: {} },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function loadState(): MockState {
  if (typeof localStorage === "undefined") return clone(seedState);

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = clone(seedState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(raw) as MockState;
  } catch {
    const seeded = clone(seedState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveState(state: MockState) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function noContent(): Response {
  return new Response(null, { status: 204 });
}

async function readBody(init: RequestInit): Promise<Record<string, unknown>> {
  if (typeof init.body !== "string") return {};
  try {
    return JSON.parse(init.body) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

function pushActivity(state: MockState, type: ActivityItem["type"], entityName: string, description: string, metadata: Record<string, unknown> = {}) {
  state.activity.unshift({
    id: nextId(state.activity),
    type,
    entityName,
    description,
    occurredAt: new Date().toISOString(),
    metadata,
  });
}

function liveBump() {
  return Math.floor(Date.now() / 30000);
}

function analyticsOverview(state: MockState): AnalyticsOverview {
  const bump = liveBump();
  const paidRevenue = state.invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const activeCustomers = state.customers.filter((customer) => customer.status === "active").length;
  const totalMrr = state.customers.reduce((sum, customer) => sum + customer.mrr, 0);

  return {
    totalRevenue: paidRevenue + bump * 250,
    revenueGrowth: 12.4 + (bump % 5) / 10,
    activeCustomers,
    customerGrowth: 8.2 + (bump % 4) / 10,
    churnRate: 2.1,
    churnDelta: -0.4,
    avgRevenuePerUser: Math.round(totalMrr / Math.max(1, state.customers.length)),
    arpuGrowth: 5.8,
    totalUsers: state.users.length,
    trialConversionRate: 64 + (bump % 8),
  };
}

function revenueChart(months: number): RevenueDataPoint[] {
  const labels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const bump = liveBump() % 10;
  return labels.slice(-months).map((month, index) => ({
    month,
    mrr: 240000 + index * 18000 + bump * 300,
    arr: (240000 + index * 18000 + bump * 300) * 12,
    newRevenue: 28000 + index * 2500 + bump * 100,
    churnedRevenue: 3500 + index * 200,
  }));
}

function customerGrowth(): GrowthDataPoint[] {
  const labels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const bump = liveBump() % 4;
  return labels.map((month, index) => ({
    month,
    total: 144 + index * 14 + bump,
    new: 11 + index + bump,
    churned: index % 3,
  }));
}

function planDistribution(state: MockState): PlanDistributionItem[] {
  const plans = ["starter", "pro", "enterprise"];
  const totalRevenue = state.customers.reduce((sum, customer) => sum + customer.mrr, 0);
  return plans.map((plan) => {
    const customers = state.customers.filter((customer) => customer.plan === plan);
    const revenue = customers.reduce((sum, customer) => sum + customer.mrr, 0);
    return {
      plan,
      count: customers.length,
      revenue,
      percentage: totalRevenue ? Math.round((revenue / totalRevenue) * 100) : 0,
    };
  });
}

export async function handleMockApiRequest(input: RequestInfo | URL, init: RequestInit): Promise<Response | null> {
  const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  const url = new URL(rawUrl, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  if (!url.pathname.startsWith("/api/")) return null;

  await new Promise((resolve) => setTimeout(resolve, 180));

  const method = (init.method || "GET").toUpperCase();
  const state = loadState();
  const path = url.pathname;

  if (path === "/api/healthz" && method === "GET") return json({ status: "ok" });

  if (path === "/api/customers" && method === "GET") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const status = url.searchParams.get("status") || "";
    const plan = url.searchParams.get("plan") || "";
    return json(state.customers.filter((customer) => {
      const matchesSearch = !search || [customer.name, customer.email, customer.company].some((value) => value.toLowerCase().includes(search));
      const matchesStatus = !status || customer.status === status;
      const matchesPlan = !plan || customer.plan === plan;
      return matchesSearch && matchesStatus && matchesPlan;
    }));
  }

  if (path === "/api/customers" && method === "POST") {
    const body = await readBody(init);
    const customer: Customer = {
      id: nextId(state.customers),
      name: String(body.name || "New Customer"),
      email: String(body.email || "customer@example.com"),
      company: String(body.company || "Metrix School"),
      plan: (body.plan as Customer["plan"]) || "starter",
      status: (body.status as Customer["status"]) || "trial",
      mrr: Number(body.mrr || 0),
      joinedAt: today(),
      avatarUrl: null,
    };
    state.customers.unshift(customer);
    pushActivity(state, "customer_joined", customer.name, "New parent/customer profile created locally", { plan: customer.plan });
    saveState(state);
    return json(customer, 201);
  }

  const customerMatch = path.match(/^\/api\/customers\/(\d+)$/);
  if (customerMatch) {
    const id = Number(customerMatch[1]);
    const index = state.customers.findIndex((customer) => customer.id === id);
    if (index === -1) return json({ message: "Not found" }, 404);
    if (method === "GET") return json(state.customers[index]);
    if (method === "PATCH") {
      const body = await readBody(init);
      state.customers[index] = { ...state.customers[index], ...body };
      pushActivity(state, "plan_upgraded", state.customers[index].name, "Customer record updated locally", body);
      saveState(state);
      return json(state.customers[index]);
    }
    if (method === "DELETE") {
      const [removed] = state.customers.splice(index, 1);
      pushActivity(state, "customer_churned", removed.name, "Customer removed from local records", {});
      saveState(state);
      return noContent();
    }
  }

  if (path === "/api/users" && method === "GET") return json(state.users);

  if (path === "/api/users" && method === "POST") {
    const body = await readBody(init);
    const user: TeamUser = {
      id: nextId(state.users),
      name: String(body.name || "Invited User"),
      email: String(body.email || "user@metrixschool.edu.ng"),
      role: (body.role as TeamUser["role"]) || "member",
      status: "invited",
      avatarUrl: null,
      joinedAt: today(),
    };
    state.users.unshift(user);
    pushActivity(state, "user_invited", user.name, "Invite email simulated and queued as delivered", { email: user.email, role: user.role });
    saveState(state);
    return json(user, 201);
  }

  const userMatch = path.match(/^\/api\/users\/(\d+)$/);
  if (userMatch) {
    const id = Number(userMatch[1]);
    const index = state.users.findIndex((user) => user.id === id);
    if (index === -1) return json({ message: "Not found" }, 404);
    if (method === "PATCH") {
      const body = await readBody(init);
      state.users[index] = { ...state.users[index], ...body };
      pushActivity(state, "user_invited", state.users[index].name, "Staff profile updated locally", body);
      saveState(state);
      return json(state.users[index]);
    }
    if (method === "DELETE") {
      state.users.splice(index, 1);
      saveState(state);
      return noContent();
    }
  }

  if (path === "/api/analytics/overview" && method === "GET") return json(analyticsOverview(state));
  if (path === "/api/analytics/revenue-chart" && method === "GET") return json(revenueChart(Number(url.searchParams.get("months") || 6)));
  if (path === "/api/analytics/customer-growth" && method === "GET") return json(customerGrowth());
  if (path === "/api/analytics/plan-distribution" && method === "GET") return json(planDistribution(state));
  if (path === "/api/revenue/invoices" && method === "GET") return json(state.invoices);

  if (path === "/api/activity" && method === "GET") {
    const limit = Number(url.searchParams.get("limit") || state.activity.length);
    return json(state.activity.slice(0, limit));
  }

  if ((path === "/api/ping" || path === "/api/support/send") && method === "POST") {
    const body = await readBody(init);
    pushActivity(state, "user_invited", String(body.audience || "Selected recipients"), "Message ping simulated successfully", body);
    saveState(state);
    return json({ status: "delivered", delivered: true, id: `MSG-${Date.now()}` });
  }

  return json({ message: `No local mock route for ${method} ${path}` }, 404);
}