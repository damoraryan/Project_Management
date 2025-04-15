const taskModel = require("../models/TaskModel")

const addTask = async (req, res) => {
    try {
        const createTask = await taskModel.create(req.body)

        res.status(201).json({
            message: "task added...",
            data: createTask
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "error",
            data: err
        })
    }
}

const deleteTask = async (req, res) => {
    try {
        const deletedTask = await taskModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "task deleted...."
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "error",
            data: err
        })

    }
}

const getAllTask = async (req, res) => {
    try {
        const task = await taskModel.find().populate("moduleId")
            .populate("projectId")
   
        res.status(200).json({
            message: "all task fetched.....",
            data: task
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "error",
            data: err
        })
    }

}

const getTaskById = async (req, res) => {
    try {
        const taskById = await taskModel.findById(req.params.id).populate("moduleId")
        .populate("projectId")
        res.status(200).json({
            message: "task fetched by id...",
            data: taskById
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "error...",
            data: err
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const updatedTask = await taskModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error while updating task",
            error: err.message,
        });
    }
};


const getTasksByModuleId = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;

        // 🔍 Find tasks related to the selected module
        const tasks = await taskModel.find({ moduleId });

        res.status(200).json({
            message: "Tasks fetched successfully",
            data: tasks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching tasks",
            error: err
        });
    }
};



module.exports = { addTask, deleteTask, getAllTask, getTaskById, updateTask ,getTasksByModuleId }

