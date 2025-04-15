const routes=require("express").Router()

const userTaskController=require("../controllers/UserTaskController")

routes.post("/userTask",userTaskController.addUserTask)
routes.delete("/userTask/:id",userTaskController.deleteUserTask)
routes.get("/userTask",userTaskController.getAllUserTask)
routes.get("/userTask/:id",userTaskController.getUserTaskById)
routes.put("/userTask/:id",userTaskController.updateUserTask)

routes.get("/users/task/:taskId",userTaskController.getUsersByTaskId);
routes.get("/user/task/:userId",userTaskController.getTasksByUserId)
routes.get("/users/task/:userId",userTaskController.getProjectAndModuleByUserTaskId)
module.exports=routes