const routes=require("express").Router()

const projectTeamController=require("../controllers/ProjectTeamController")

routes.post("/projectTeam",projectTeamController.addProjectTeam)
routes.delete("/projectTeam/:id",projectTeamController.deleteProjectTeam)
routes.get("/projectTeam",projectTeamController.getAllProjectTeam)
routes.get("/projecTeam/:id",projectTeamController.getProjectTeamById)
routes.put("projectTeam/:id",projectTeamController.updateProjectTeam)




module.exports=routes