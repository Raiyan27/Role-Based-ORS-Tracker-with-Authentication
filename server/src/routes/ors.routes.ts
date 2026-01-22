import { Router } from "express";
import orsController from "../controllers/ors.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// All routes are protected
router.use(protect);

// Statistics endpoint (all authenticated users)
router.get("/stats", orsController.getStats.bind(orsController));

// CRUD routes
router
  .route("/")
  .get(orsController.getAll.bind(orsController))
  .post(
    authorize("admin", "inspector"),
    orsController.create.bind(orsController),
  );

router
  .route("/:id")
  .get(orsController.getById.bind(orsController))
  .put(
    authorize("admin", "inspector"),
    orsController.update.bind(orsController),
  )
  .delete(
    authorize("admin", "inspector"),
    orsController.delete.bind(orsController),
  );

export default router;
