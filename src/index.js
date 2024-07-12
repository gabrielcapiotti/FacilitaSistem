const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/tasks", async (req, res) => {
  const { taskName, taskDesc } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        taskName,
        taskDesc,
      },
    });
    console.log(`Task Added: ${newTask.taskName}`);
    res.json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.put("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { taskName, taskDesc } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { taskId },
      data: { taskName, taskDesc },
    });
    console.log(`Task Updated: ${updatedTask.taskId}`);
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(500).json({ message: "Error updating task" });
    }
  }
});

app.delete("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    await prisma.task.delete({
      where: { taskId },
    });
    console.log(`Task Deleted: ${taskId}`);
    res.json({ message: "Task deleted successfully", taskId });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(500).json({ message: "Error deleting task" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
