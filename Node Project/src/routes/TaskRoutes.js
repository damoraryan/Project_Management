const routes=require("express").Router()

const taskController=require("../controllers/TaskController")

routes.post("/task",taskController.addTask)
routes.delete("/task/:id",taskController.deleteTask)
routes.get("/task",taskController.getAllTask)
routes.get("/task/:id",taskController.getTaskById)
routes.put("/task/:id",taskController.updateTask)

routes.get("/tasks/module/:moduleId", taskController.getTasksByModuleId);




module.exports=routes