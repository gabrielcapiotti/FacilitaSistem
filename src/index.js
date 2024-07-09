const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Simulando um banco de dados em memória
let tasks = [];

app.use(cors());
app.use(express.json());

// Definição de uma rota POST para criar uma nova tarefa
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

// Definição de uma rota GET para listar todas as tarefas
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.put("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { taskName, taskDesc } = req.body;

  let found = false;
  const updatedTasks = tasks.map((task) => {
    if (task.taskId === taskId) {
      found = true; // Marca que a tarefa foi encontrada e será atualizada
      return { ...task, taskName, taskDesc }; // Retorna a tarefa atualizada
    }
    return task; // Retorna a tarefa não modificada
  });

  if (!found) {
    return res.status(404).json({ message: "Task not found" }); // Tarefa não encontrada
  }

  tasks = updatedTasks; // Atualiza a lista de tarefas
  console.log(`Task Updated: ${taskId}`);
  const updatedTask = tasks.find((task) => task.taskId === taskId); // Encontra a tarefa atualizada para retornar
  res.json({ message: "Task updated successfully", task: updatedTask }); // Retorna a tarefa atualizada
});

// Definição de uma rota DELETE para deletar uma tarefa específica
app.delete("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const originalLength = tasks.length;
  tasks = tasks.filter((task) => task.taskId !== taskId);
  const newLength = tasks.length;

  if (originalLength === newLength) {
    // Nenhuma tarefa foi removida, ou seja, taskId não foi encontrado
    return res.status(404).json({ message: "Task not found" });
  }

  console.log(`Task Deleted: ${taskId}`);
  res.json({ message: "Task deleted successfully", taskId });
});

// Iniciando o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
