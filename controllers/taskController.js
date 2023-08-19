const taskModel = require("../models/taskModel")
const writerModel =require("../models/writerModel")
const nodemailer=require("nodemailer")
const {sendEmail}=require("../middleware/sendingMail")
const editorModel = require("../models/editorModel")
const jwt = require("jsonwebtoken")
const { acceptMail } = require("../utils/acceptMail")





//  create a task and assign it to a writer
 const createTask =  async (req, res) => {
    try {
        // get the editor id from the params
        const { id } = req.params
        
        // get the writer id from the params
        const writerId = req.params.writerId

        // find the editor by the id
        const editor = await editorModel.findById(id)

        // find the writer by the id
        const writer = await writerModel.findById(writerId)

        if(!editor){
            return res.status(404).json({
                message: `Editor with this ${id} is not in the database`
            })
        }
        if(!writer){
            return res.status(404).json({
                message: `The Writer with this ${writerId} is not in the database`
            })
        };

        const { Title, Description, taskTimeout } = req.body;

        const taskTimeoutInMilliseconds = taskTimeout * 60 * 60 * 1000;

        // create a new task
        const newTask = new taskModel({
            Title: Title,
            Description: Description,
            editor: editor._id, 
            writer: writer._id,
            taskTimeout: taskTimeoutInMilliseconds

            
        });

        // create a token
        const token = jwt.sign({
            taskId: newTask._id

        },
        process.env.secretKey, { expiresIn: "1 day" },
        );
        newTask.token = token

        // send verification mail
        const subject = "You've got a New Task";
        const protocol = req.protocol;
        const host = req.get("host");
        const link = `${protocol}://${host}/accepttask/${token}`;
        const html = await acceptMail(link, writer.UserName)
        const mail = {
            email: writer.Email,
            subject,
            html
        };
        sendEmail(mail)

        // push into the array
        editor.task.push(newTask._id)
        writer.task.push(newTask._id)

        // save 
        await editor.save();
        await writer.save();

        await newTask.save();

        res.status(201).json({
            message: "Task created and assigned successfully",
            data: newTask
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



//  writer  accept the task
const AcceptTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Assume writer ID is available in req.user
        if (task.writer.toString() !== req.params.writerId) {
            return res.status(403).json({
                message: "You are not authorized to accept this task"
            });
        }

        // Set isActive to true
        task.isActive = true;
        await task.save();

        setTimeout(() => {
            if (task.isActive) {
                task.isActive = false;
                task.isPending = true;
                task.save();
            };
            if(task.isComplete){
                task.isActive = false;
                task.isPending = false;
                task.taskTimeout = 0
                task.save()
            };

        }, task.taskTimeout); 

        res.status(200).json({
            message: "Task accepted successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getOneTask = async (req, res) => {
    try{
      const { id } = req.params;
      const oneTask= await taskModel.findById(id)
      if (!oneTask){
        return res.status(404).json({
          message: `The task with ths ${id} doesn't exist`
        })
      }else{
        res.status(200).json({
          message: `This is the task you are looking for`,
          data: oneTask
        })
      }
    }catch(error){
      res.status(500).json({
        message: error.message
      })
    }
  };

//   get all tasks
const getAllTasks = async (req, res) => {
    try{
         const writerId = req.params.writerId
         const allTasks = await taskModel.find({writer: writerId})
         if(!allTasks){
            return res.status(404).json({
                message: `Tasks not found`
            })
         }else{
            res.status(200).json({
                message: ` These are all the tasks assigned to this writer`,
                data: allTasks
            })
         }
    }catch(error){
        res.status(500).json({
          message: error.message
        })
      }
};

// update a task
const updateTask = async (req, res) => {
    try{
        const writerId = req.params.writerId;
        const writer = await writerModel.findById(writerId)
        if(!writer) {
            return res.status(404).json({
                message: `Writer with this ${writerId} is not in the database`
            })
        }
        const taskId = req.params.taskId
        const task = await taskModel.findById(taskId)
        if(!task) {
            return res.status(404).json({
                message: `The Task with this ${taskId} is not in the database`
            })
        }
        // const completedTask = await taskModel.findByIdAndUpdate(taskId, task.isComplete = true, {new: true})
        task.isComplete = true;
        await task.save()

        res.status(200).json({
            message: `Task has been updated successfully`,
            data: task
        })


    }catch(error){
        res.status(500).json({
          message: error.message
        })
      }
}

// delete a task
const deleteTask = async (req, res) => {
    try{
        const taskId = req.params.taskId

        const task = await taskModel.findById(taskId)

        if (!task) {
            return res.status(404).json({
              message: `The task  with id ${taskId} not found`
            });
          }
          const deletedTask = await taskModel.findByIdAndDelete(taskId);

          res.status(200).json({
            message: `Task deleted successfully`,
            deletedTask
          })
    }catch(error){
        res.status(500).json({
            message: error.message
          })
    }
}
    

module.exports = {
    createTask,
    AcceptTask,
    getOneTask,
    updateTask,
    deleteTask
}