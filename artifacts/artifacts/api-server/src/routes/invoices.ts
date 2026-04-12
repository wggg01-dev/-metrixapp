import { Router, type IRouter } from "express";
import { db, invoicesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ListInvoicesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/revenue/invoices", async (_req, res): Promise<void> => {
  const invoices = await db
    .select()
    .from(invoicesTable)
    .orderBy(desc(invoicesTable.issuedAt));

  const mapped = invoices.map((inv) => ({
    ...inv,
    amount: parseFloat(inv.amount),
  }));

  res.json(ListInvoicesResponse.parse(mapped));
});

export default router;
