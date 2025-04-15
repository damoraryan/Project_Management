const routes=require("express").Router()
const projectController=require("../controllers/ProjectController")

routes.post("/projects",projectController.addProject)
routes.delete("/projects/:id",projectController.deleteProject)
routes.get("/projects",projectController.getAllProject)
routes.get("/projects/:id",projectController.getProjectById)
routes.put("/updateProject/:id",projectController.updateProject)
    
routes.post("/upload",projectController.addHordingWithFile)




module.exports=routes