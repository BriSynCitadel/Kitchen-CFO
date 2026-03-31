import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analyzeRouter from "./analyze";
import foodLogsRouter from "./food-logs";
import profileRouter from "./profile";
import inventoryRouter from "./inventory";
import recommendationsRouter from "./recommendations";
import settingsRouter from "./settings";
import demoRouter from "./demo";
import feedbackRouter from "./feedback";
import quantitySuggestionsRouter from "./quantity-suggestions";
import quickSuggestionRouter from "./quick-suggestion";
import importLabsRouter from "./import-labs";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(analyzeRouter);
router.use(foodLogsRouter);
router.use(profileRouter);
router.use(inventoryRouter);
router.use(recommendationsRouter);
router.use(settingsRouter);
router.use(demoRouter);
router.use(feedbackRouter);
router.use(quantitySuggestionsRouter);
router.use(quickSuggestionRouter);
router.use(importLabsRouter);

export default router;
