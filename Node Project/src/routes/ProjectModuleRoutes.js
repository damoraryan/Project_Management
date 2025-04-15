const routes=require("express").Router()

const projectModuleController=require("../controllers/ProjectModuleController")

routes.post("/module",projectModuleController.addProjectModule)
routes.delete("/module/:id",projectModuleController.deleteProjectModule)
routes.get("/module",projectModuleController.getAllProjectModule)
routes.get("/module/:id",projectModuleController.getProjectModuleById)
routes.put("/module/:id",projectModuleController.updateProjectModule)

routes.get("/modules/:projectId",projectModuleController.getProjectModuleByProjectId)


module.exports=routes