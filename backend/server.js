const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
// let todos = [];
mongoose
  .connect("mongodb://localhost:27017/mern-todo")
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((error) => {
    console.log(error);
  });
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});
const todoModel = new mongoose.model("Todo", todoSchema);
//create a new Todo item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  //   const newTodo = {
  //     id: todos.length + 1,
  //     title,
  //     description,
  //   };
  //   todos.push(newTodo);
  //   console.log(todos);

  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Get all items
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Update Todo Item

app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Delete Item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
const port = 8000;
app.listen(port, () => {
  console.log("Server is listening to port " + port);
});
