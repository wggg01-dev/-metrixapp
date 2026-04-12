import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, teamUsersTable } from "@workspace/db";
import {
  CreateUserBody,
  UpdateUserParams,
  UpdateUserBody,
  UpdateUserResponse,
  DeleteUserParams,
  ListUsersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/users", async (_req, res): Promise<void> => {
  const users = await db
    .select()
    .from(teamUsersTable)
    .orderBy(teamUsersTable.joinedAt);

  const mapped = users.map((u) => ({
    ...u,
    avatarUrl: u.avatarUrl ?? null,
  }));

  res.json(ListUsersResponse.parse(mapped));
});

router.post("/users", async (req, res): Promise<void> => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db
    .insert(teamUsersTable)
    .values({ ...parsed.data, status: "invited" })
    .returning();

  res.status(201).json({
    ...user,
    avatarUrl: user.avatarUrl ?? null,
  });
});

router.patch("/users/:id", async (req, res): Promise<void> => {
  const params = UpdateUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateUserBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [user] = await db
    .update(teamUsersTable)
    .set(body.data)
    .where(eq(teamUsersTable.id, params.data.id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(UpdateUserResponse.parse({ ...user, avatarUrl: user.avatarUrl ?? null }));
});

router.delete("/users/:id", async (req, res): Promise<void> => {
  const params = DeleteUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(teamUsersTable)
    .where(eq(teamUsersTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
