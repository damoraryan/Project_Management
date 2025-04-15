const routes=require("express").Router()

const userController=require("../controllers/UserController")
const { route } = require("./TaskRoutes")

routes.post("/user/signup",userController.signup)
routes.post("/user/login",userController.loginUser)
routes.get("/users",userController.getAllUser)
// routes.post("/user",userController.addUser)
routes.delete("/user/:id",userController.deleteUser)
routes.get("/user/:id",userController.getUserById)
routes.put("/user/:id",userController.updateUser)
routes.post("/user/forgotpassword",userController.forgotPassword)
routes.post("/user/resetpassword",userController.resetpassword)










module.exports=routes