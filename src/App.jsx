import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { toast } from "react-toastify";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const apiURL = "http://localhost:3004";
  const apiURL = import.meta.env.VITE_API_URL;

  const fetchAPI = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiURL}/todos`);
      console.log("API Response:", response.data);

      // Make sure we're setting the tasks correctly from the response
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
        toast.success("Tasks fetched successfully!");
      } else {
        throw new Error("Invalid response format");
      }

      setError(null);
    } catch (error) {
      console.error("Fetch error:", error.message);
      if (error.code === "ERR_NETWORK") {
        setError("Server is not responding. Please check if it's running.");
      } else {
        setError(error.response?.data?.message || "Failed to fetch tasks");
      }
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    if (!newTaskText.trim()) {
      setError("Task text cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${apiURL}/todos`, {
        // text: newTaskText,
        todo: newTaskText,
        completed: false,
      });
      toast.info("Task created successfully!");
      await fetchAPI();
      setNewTaskText("");
      setError(null);
    } catch (error) {
      console.error("Submit error:", error.message);
      setError("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (_id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${apiURL}/todos/${_id}`);
      // await axios.delete(`${apiURL}/todos/todo/${id}`);
      toast.error("Task deleted successfully!");
      await fetchAPI();
      setError(null);
    } catch (error) {
      console.error("Delete error:", error.message);
      setError("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async (index, task) => {
    setIsLoading(true);
    try {
      // await axios.patch(`${apiURL}/todos/todo/${task.id}`, {
      await axios.patch(`${apiURL}/todos/${task._id}`, {
        completed: !task.completed,
        // checked: !task.checked,
      });
      toast.warning("Task updated successfully!");
      await fetchAPI();
      setError(null);
    } catch (error) {
      console.error("Update error:", error.message);
      setError(error.response?.data?.message || "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h1>Todo List</h1>
      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading">Loading...</div>}
      <form id="todo-form" onSubmit={createTask}>
        <div className="input-container">
          <input
            id="input"
            placeholder="Add Item"
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button id="add" type="submit" disabled={isLoading}>
          Add
        </button>
      </form>
      <ul id="todo-list">
        {tasks.map((task, index) => (
          <li key={task._id || index}>
            <span
              className="todo-line"
              style={{
                // textDecoration: task.checked ? "line-through" : "none",
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              <span
                className="todo-text"
                style={{
                  // color: task.checked ? "grey" : "rgb(241, 241, 241)",
                  color: task.completed ? "grey" : "rgb(241, 241, 241)",
                }}
              >
                {/* {task.text} */}
                {task.todo}
              </span>
            </span>
            <label className="check-container">
              <input
                type="checkbox"
                checked={task.completed}
                // checked={task.checked}
                onChange={() => handleCheck(index, task)}
              />
              <div className="checkmark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ionicon"
                  viewBox="0 0 512 512"
                >
                  <title>Checkmark</title>
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="32"
                    d="M416 128L192 384l-96-96"
                  />
                </svg>
              </div>
            </label>
            <button className="button" onClick={() => handleDelete(task._id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 69 14"
                className="svgIcon bin-top"
              >
                <g clipPath="url(#clip0_35_24)">
                  <path
                    fill="black"
                    d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_35_24">
                    <rect fill="white" height="14" width="69" />
                  </clipPath>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 69 57"
                className="svgIcon bin-bottom"
              >
                <g clipPath="url(#clip0_35_22)">
                  <path
                    fill="black"
                    d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_35_22">
                    <rect fill="white" height="57" width="69" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
