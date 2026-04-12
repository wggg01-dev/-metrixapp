import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, customersTable } from "@workspace/db";
import {
  ListCustomersQueryParams,
  CreateCustomerBody,
  GetCustomerParams,
  GetCustomerResponse,
  UpdateCustomerParams,
  UpdateCustomerBody,
  UpdateCustomerResponse,
  DeleteCustomerParams,
  ListCustomersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/customers", async (req, res): Promise<void> => {
  const parsed = ListCustomersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, status, plan } = parsed.data;
  const conditions: SQL[] = [];

  if (search) {
    conditions.push(ilike(customersTable.name, `%${search}%`));
  }
  if (status) {
    conditions.push(eq(customersTable.status, status as "active" | "churned" | "trial" | "suspended"));
  }
  if (plan) {
    conditions.push(eq(customersTable.plan, plan as "starter" | "pro" | "enterprise"));
  }

  const customers = await db
    .select()
    .from(customersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(customersTable.joinedAt);

  const mapped = customers.map((c) => ({
    ...c,
    mrr: parseFloat(c.mrr),
    avatarUrl: c.avatarUrl ?? null,
  }));

  res.json(ListCustomersResponse.parse(mapped));
});

router.post("/customers", async (req, res): Promise<void> => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [customer] = await db
    .insert(customersTable)
    .values({
      ...parsed.data,
      mrr: parsed.data.mrr?.toString() ?? "0",
    })
    .returning();

  res.status(201).json(
    GetCustomerResponse.parse({
      ...customer,
      mrr: parseFloat(customer.mrr),
      avatarUrl: customer.avatarUrl ?? null,
    })
  );
});

router.get("/customers/:id", async (req, res): Promise<void> => {
  const params = GetCustomerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [customer] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, params.data.id));

  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }

  res.json(
    GetCustomerResponse.parse({
      ...customer,
      mrr: parseFloat(customer.mrr),
      avatarUrl: customer.avatarUrl ?? null,
    })
  );
});

router.patch("/customers/:id", async (req, res): Promise<void> => {
  const params = UpdateCustomerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateCustomerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { ...body.data };
  if (body.data.mrr !== undefined) {
    updateData.mrr = body.data.mrr.toString();
  }

  const [customer] = await db
    .update(customersTable)
    .set(updateData)
    .where(eq(customersTable.id, params.data.id))
    .returning();

  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }

  res.json(
    UpdateCustomerResponse.parse({
      ...customer,
      mrr: parseFloat(customer.mrr),
      avatarUrl: customer.avatarUrl ?? null,
    })
  );
});

router.delete("/customers/:id", async (req, res): Promise<void> => {
  const params = DeleteCustomerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(customersTable)
    .where(eq(customersTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
