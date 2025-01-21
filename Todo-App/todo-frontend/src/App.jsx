import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function App() {
  const BASE_URL = "https://todo-app-ten-pi-87.vercel.app";

  const [todos, setTodos] = useState([]);

  const getTodo = async () => {
    try {
      const res = await axios(`${BASE_URL}/all-todos`);
      setTodos(res?.data?.data);
    } catch (err) {
      console.error(err?.response?.data?.message || "Error fetching todos");
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    try {
      event.preventDefault();
      const todoValue = event.target.children[0].value;
      await axios.post(`${BASE_URL}/add-todo`, { todo: todoValue });
      getTodo();
      event.target.reset();
    } catch (err) {
      console.error(err?.response?.data?.message || "Error adding todo");
    }
  };

  //yah edit todo ka lia ha
  const editTodo = async (event, todoId) => {
    console.log(editTodo);

    try {
      event.preventDefault();

      const todoValue = event.target.children[0].value;

      await axios.patch(`${BASE_URL}/edit-todo/${todoId}`, {
        todoContent: todoValue,
      });
      getTodo();

      event.target.reset();
    } catch (err) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Kuch Bhi Error ");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      // update the UI
      setTodos(todos.filter((todo) => todo.id !== todoId));
      // Call the backend to delete the todo
      await axios.delete(`${BASE_URL}/delete-solo-todo/${todoId}`);
        getTodo();
    } catch (err) {
      console.error(err?.response?.data?.message || "Deleting error");
      getTodo();
    }
  };
  
  return (
    // todo add ka lia ha
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Todo App</h1>
        <form onSubmit={addTodo} className="flex mb-4">
          <input
            type="text"
            placeholder="Add a new task"
            className="flex-grow p-2 border rounded-l-md"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md">
            Add
          </button>
        </form>
        {/* start ma add karna ka lia show ho rha h */}
        {!todos.length && <p>No todos available</p>}
        {/* yah bhi todo edit ki logic ka part ha. */}
        <ul>
          <ul className="mt-6 space-y-4">
            {todos?.map((todo, index) => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-200"
              >
                {/* yah input ka par ha jis par edit button sa alag ho rha ha edit par open ho rha ha */}
                {!todo.isEditing ? (
                  <span className="text-gray-700">{todo.todoContent}</span>
                ) : (
                  <form onSubmit={(a) => editTodo(a, todo.id)}>
                    <input
                      type="text"
                      defaultValue={todo.todoContent}
                      className="border border-gray-400"
                    />
                    {/*  yah button cancel ka  button ha */}
                    <button
                      className=" text-red-500 px-4 py-2 rounded-lg"
                      onClick={() => {
                        const newTodos = todos.map((todo, i) => {
                          todo.isEditing = false;
                          return todo;
                        });
                        setTodos([...newTodos]);
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                    {/* yah button save karna ha edit karna ka bad jis todo hum edit kar rha ha */}
                    <button
                      className="text-green-500 p-3 py-2 rounded-lg"
                      type="submit"
                    >
                      Save
                    </button>
                  </form>
                )}
                <form>
                  <div className="space-x-3">
                    {!todo.isEditing ? (
                      <button
                        onClick={() => {
                          const newTodos = todos.map((todo, i) => {
                            if (i === index) {
                              todo.isEditing = true;
                            } else {
                              todo.isEditing = false;
                            }
                            return todo;
                          });
                          setTodos([...newTodos]);
                        }}
                        className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
                      >
                        Edit
                      </button>
                    ) : null}
                    {/* yah logic deltlet karni ki ha */}
                    {!todo.isEditing ? (
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </form>
              </li>
            ))}
          </ul>
        </ul>
      </div>
    </div>
  );
}
