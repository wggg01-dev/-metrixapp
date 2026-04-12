import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customersRouter from "./customers";
import usersRouter from "./users";
import analyticsRouter from "./analytics";
import invoicesRouter from "./invoices";
import activityRouter from "./activity";

const router: IRouter = Router();

router.use(healthRouter);
router.use(customersRouter);
router.use(usersRouter);
router.use(analyticsRouter);
router.use(invoicesRouter);
router.use(activityRouter);

export default router;
