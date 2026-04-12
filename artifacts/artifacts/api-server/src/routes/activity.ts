import { Router, type IRouter } from "express";
import { db, activityTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ListActivityResponse, ListActivityQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/activity", async (req, res): Promise<void> => {
  const parsed = ListActivityQueryParams.safeParse(req.query);
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 20;

  const items = await db
    .select()
    .from(activityTable)
    .orderBy(desc(activityTable.occurredAt))
    .limit(limit);

  res.json(ListActivityResponse.parse(items));
});

export default router;
