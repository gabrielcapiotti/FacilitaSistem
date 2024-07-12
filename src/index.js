const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

let tasks = [];

app.use(cors());
app.use(express.json());

app.post("/tasks", async (req, res) => {
  const { taskName, taskDesc } = req.body;
  const newTask = await prisma.task.create({
    data: {
      taskName,
      taskDesc,
    },
  });
  console.log(`Task Added: ${newTask.taskName}`);
  res.json({ message: "Task added successfully", task: newTask });
});

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.put("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { taskName, taskDesc } = req.body;
  const updatedTask = await prisma.task.update({
    where: { taskId },
    data: { taskName, taskDesc },
  });
  console.log(`Task Updated: ${taskId}`);
  res.json({ message: "Task updated successfully", task: updatedTask });
});

app.delete("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  await prisma.task.delete({
    where: { taskId },
  });
  console.log(`Task Deleted: ${taskId}`);
  res.json({ message: "Task deleted successfully", taskId });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
