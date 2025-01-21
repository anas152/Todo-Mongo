import express, { request, response } from "express";
import cors from "cors";
import './database.js'
import {Todo} from './model/index.js';


const app = express();
const port = process.env.PORT || 5001;


app.use(express.json()); // to convert body into json (body = post man body jis ma sare encrypted data hota ha)
app.use(
  cors({ origin: ["http://localhost:5173", "https://anas-todoapp-express.surge.sh"] }),
);

// yah api sa todo ko lena ka lia ha
app.get("/all-todos", async(request, response) => {
  try {
    

  const todos = await Todo.find({},
    {todoContent : 1, _id: 0 }
    //  {ip: 0, __v : 0,  updatedAt: 0} yah 0, 1 is liya hota ha ka 0 sa  fronted par kuch bhi show nahi karta ha. or 1 sa show jo show karwana ho
    )
  const message = !todos.length ? "todos empty" : "todo is here";
  response.send({ data: todos, message: "yah han sab todos" });
} catch (error) {
  response.status(500).send("Internal server error")

}
}); 

// // for post on new todo on browser
app.post("/add-todo", async(request, response) => {
  const addTodoObj = {
    todoContent: request.body.todo,
    ip : request.ip
  };
  // todos.push(addTodoObj);
  const res = await Todo.create(addTodoObj);
  // todo add hona par yah message aye ga mean post perfect kam kar rha ha.
  response.send({ message: "todo added ho gya ha", data: addTodoObj });
});

// // for edit only single todo
app.patch("/edit-todo/:id", (request, response) => {
  const id = parseInt(request.params.id);
  let isFound = false;
  for (let index = 0; index < todos.length; index++) {
    if (todos[index].id === id) {
      // Compare with converted number
      todos[index].todoContent = request.body.todoContent;
      isFound = true;
      break;
    }
  }
  if (isFound) {
    response.status(201).send({
      message: "Todo Updated Successfully!",
      data: { todoContent: request.body.todoContent, id: id },
    });
  } else {
    response.status(200).send({ data: null, message: "todo not found " });
  }
});
// //for delete only single todo
app.delete("/delete-solo-todo/:id", (request, response) => {
  const id = parseInt(request.params.id); // Ensure ID is parsed as an integer

  let isFound = false;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) { 
      todos.splice(i, 1); // Delete the todo
      isFound = true;
      break;
    }
  }

  if (isFound) {
    response.status(201).send({
      message: "todo deleted successfully!",
    });
  } else {
    response.status(200).send({
     data: null, message: "todo not found"
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
