import express, { request, response } from "express";
import cors from "cors";
import "./database.js";
import { Todo } from "./model/index.js";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json()); // to convert body into json (body = post man body jis ma sare encrypted data hota ha)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://anas-todoapp-express.surge.sh"],
  })
);

// yah api sa todo ko lena ka lia ha
app.get("/all-todos", async (request, response) => {
  try {
    const todos = await Todo.find(
      {},
      { ip: 0, __v: 0, updatedAt: 0 } // 0, 1 is liya hota ha ka 0 sa  fronted par kuch bhi show nahi karta ha. or 1 sa show jo show karwana ho
      // {todoContent : 1, _id: 0 }  sirf id ki ko hum dono ka sath likh sakta ha 0, 1 ma baki koi bhi aik chez ko mangwa sakta ha.
      // {todoContent : 1}  yah sirf todo content ko show hoga froentend par
    );
    const message = !todos.length ? "todos empty" : "todo is here";
    response.send({ data: todos, message: "yah han sab todos" });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal server error");
  }
});

// // for post on new todo on browser
app.post("/add-todo", async (request, response) => {
  try {
    const addTodoObj = {
      todoContent: request.body.todo,
      ip: request.ip,
    };

    const result = await Todo.create(addTodoObj); // yah Db sa ho kar aa rha ha TODO model sa ha.
    // console.log(result);

    // todo add hona par yah message aye ga mean post perfect kam kar rha ha.
    response.send({ message: "todo added ho gya ha", data: result });
  } catch (error) {
    response.status(500).send("Internal server error");
  }
});

// // for edit only single todo
app.patch("/edit-todo/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const result = await Todo.findByIdAndUpdate(
      id,
      { todoContent: request.body.todoContent }, // Update the todoContent field
      { new: true } // Return the updated document
    );
    if (result) {
      response.status(200).send({
        message: "Todo Updated Successfully!",
        data: result, // Send the updated todo
      });
    } else {
      response.status(404).send({ data: null, message: "Todo not found" });
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    response.status(500).send({ message: "Internal server error" });
  }
});

// //for delete only single todo
app.delete("/delete-solo-todo/:id", async (request, response) => {
  const id = request.params.id; 

  try {
    // Todo ko delete karte hain
    const result = await Todo.findByIdAndDelete(id);

    if (result) {
      response.status(200).send({
        message: "Todo deleted successfully!",
        data: result, // Deleted todo ka data send karte hain
      });
    } else {
      response.status(404).send({
        data: null,
        message: "Todo not found",
      });
    }
  } catch (error) {
    console.error("Error deleting todo:", error); // Debugging ke liye error log karein
    response.status(500).send({
      message: "Internal server error",
    });
  }
});

// route not found
app.use((request, response) => {
  response.status(404).send("No Route Found 404 sd");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
