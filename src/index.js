const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

let tasks = [];

app.use(cors());
app.use(express.json());

app.post("/tasks", (req, res) => {
  const { taskName, taskDesc } = req.body;
  const newTask = {
    taskId: Date.now().toString(),
    taskName,
    taskDesc,
  };
  tasks.push(newTask);
  console.log(`Task Added: ${taskName}`);
  res.json({ message: "Task added successfully", task: newTask });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.put("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { taskName, taskDesc } = req.body;

  let found = false;
  const updatedTasks = tasks.map((task) => {
    if (task.taskId === taskId) {
      found = true;
      return { ...task, taskName, taskDesc };
    }
    return task;
  });

  if (!found) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks = updatedTasks;
  console.log(`Task Updated: ${taskId}`);
  const updatedTask = tasks.find((task) => task.taskId === taskId);
  res.json({ message: "Task updated successfully", task: updatedTask });
});

app.delete("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const originalLength = tasks.length;
  tasks = tasks.filter((task) => task.taskId !== taskId);
  const newLength = tasks.length;

  if (originalLength === newLength) {
    return res.status(404).json({ message: "Task not found" });
  }

  console.log(`Task Deleted: ${taskId}`);
  res.json({ message: "Task deleted successfully", taskId });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
