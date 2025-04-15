const express = require("express")
const mongoose = require("mongoose")
const cors=require("cors")
const app = express()
app.use(cors())
app.use(express.json())

const roleRoutes=require("./src/routes/RoleRoutes")
app.use(roleRoutes)

const userRoutes=require("./src/routes/UserRoutes")
app.use(userRoutes)

const projectRoutes=require("./src/routes/ProjectRoutes")
app.use(projectRoutes)

const projectTeamRoutes=require("./src/routes/ProjectTeamRoutes")
app.use(projectTeamRoutes)

const statusRoutes=require("./src/routes/StatusRoutes")
app.use(statusRoutes)

const projectModuleRoutes=require("./src/routes/ProjectModuleRoutes")
app.use(projectModuleRoutes)

const taskRoutes=require("./src/routes/TaskRoutes")
app.use(taskRoutes)

const userTaskRoutes=require("./src/routes/UserTaskRoutes")
app.use(userTaskRoutes)

//const roleRoute=require("")
mongoose.connect("mongodb://127.0.0.1:27017/25_node_internship").then(()=>{
    console.log("database connected...")
})


const PORT = 3000

app.listen(PORT, () => {
    console.log("server is started...",PORT)
})