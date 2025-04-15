const routes = require('express').Router();
const statusController = require("../controllers/StatusController");

// Status CRUD
routes.post("/status", statusController.addStatus);
routes.delete("/status/:id", statusController.deleteStatus);
routes.get("/status", statusController.getStatus);
routes.get("/status/:id", statusController.getStatusById);
routes.put("/updateStatus/:id", statusController.updateStatus);

// Get status by project/module/task ID
routes.get("/status/entity/:entityId", statusController.getStatusByEntity);

module.exports = routes;
