const userTaskModel = require("../models/UserTaskModel")

const addUserTask = async (req, res) => {
    try {
        // Create the user task
        const createUserTask = await userTaskModel.create(req.body);

        // Populate all referenced fields in one call
        const populatedUserTask = await userTaskModel
            .findById(createUserTask._id)
            .populate("userId taskId moduleId projectId");

        res.status(201).json({
            message: "User task added successfully",
            data: populatedUserTask
        });

    } catch (err) {
        console.error("Error adding user task:", err);
        res.status(500).json({
            message: "Failed to add user task",
            error: err.message
        });
    }
};


const deleteUserTask = async (req, res) => {
    try {
        const deletedUserTask = await userTaskModel.findByIdAndDelete(req.params.id)
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

const getAllUserTask = async (req, res) => {
    try {
        const userTask = await userTaskModel.find().populate("userId")
            .populate("taskId")
        res.status(200).json({
            message: "all user task fetched.....",
            data: userTask
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "error",
            data: err
        })
    }

}

const getUserTaskById = async (req, res) => {
    try {
        const UserTaskById = await userTaskModel.findById(req.params.id).populate("userId")
        res.status(200).json({
            message: "user task fetched by id...",
            data: UserTaskById
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "error...",
            data: err
        })
    }
}

const getProjectAndModuleByUserTaskId = async (req, res) => {
    try {
      const userTask = await userTaskModel.findById(req.params.id)
        .populate({
          path: "taskId",
          populate: {
            path: "moduleId",
            populate: {
              path: "projectId"
            }
          }
        });
  
      res.status(200).json({
        message: "Project and module fetched by user task id...",
        data: {
          project: userTask?.taskId?.moduleId?.projectId,
          module: userTask?.taskId?.moduleId
        }
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "error...",
        data: err
      });
    }
  };
  
const updateUserTask = async (req, res) => {
    try {
        const updatedUserTask = await userTaskModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json({
            message: "userTask update successfully..",
            data: updatedUserTask
        })

    } catch (err) {
        res.status(500).json({
            message: "error while update userTask..",
            error: err
        })
    }
}

const getUsersByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Validate ObjectId
        if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Task ID format" });
        }

        // Find users assigned to this task
        const userTasks = await userTaskModel.find({ taskId }).populate("userId");

        // Get users and remove duplicates
        const users = userTasks
            .map((ut) => ut.userId)  // Map to the userId
            .filter((value, index, self) => {
                // Check if the userId is unique by comparing it with all the previous userIds
                return index === self.findIndex((t) => (
                    t._id.toString() === value._id.toString()
                ));
            });

        res.json({ data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getTasksByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate ObjectId
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        // Find all tasks assigned to this user
        const userTasks = await userTaskModel
            .find({ userId }) // Filter by userId
            .populate("taskId"); // Populate task details

        if (!userTasks.length) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        // Extract tasks from userTaskModel
        const tasks = userTasks.map((ut) => ut.taskId);

        res.status(200).json({
            message: "Tasks fetched successfully",
            data: tasks
        });

    } catch (error) {
        console.error("Error fetching tasks by user ID:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


module.exports = { addUserTask, getAllUserTask, deleteUserTask, getUserTaskById, updateUserTask, getUsersByTaskId ,getTasksByUserId
    ,getProjectAndModuleByUserTaskId
}

