import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./app.scss";

const notify = () => toast("New Todo!");

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingTodo, setEditingTodo] = useState({ title: "", id: "" });

  function addedNewData() {
    toast.success("New Todo Added", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
  useEffect(() => {
    getUSersData();
  }, []);
  function getUSersData() {
    fetch("https://jsonplaceholder.typicode.com/todos/?_limit=50", {
      headers: {
        usersId: "900",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }
  function handleAddItem(inputValue) {
    if (inputValue !== "") {
      const data = {
        title: inputValue,
      };
      fetch(`https://jsonplaceholder.typicode.com/todos/`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((resp) => {
        resp.json().then((todo) => {
          console.log(todo);
          setData((prev) => [...prev, todo]);
          addedNewData();
          setInputValue("");
        });
      });
    } else {
      toast.error("empty input ", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }
  function handleDeleteData(id) {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "delete",
    }).then((resp) => {
      resp.json().then((todos) => {
        const newArray = data.filter((data) => data.id !== id);
        setData(newArray);
      });
    });
  }
  function handlEditMode(todo) {
    setEditingTodo({ id: todo.id, title: todo.title });
  }
  function handleDone(title, id, index) {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "put",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    })
      .then((resp) => resp.json())
      .then((newData) => {
        const oldData = [...data];
        oldData.map((todo) => {
          if (todo.id === newData.id) {
            todo.title = newData.title;
          }
        });
        setData(oldData);
        setEditingTodo({ title: "", id: "" });
      });
  }
  function handeleCompleted(id) {
    const newArray = [...data];
    newArray.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
    });
    setData(newArray);
  }

  return (
    <>
      {/*  */}
      <div className="todos">
        <div className="todos_input">
          <h1> To-Do List</h1>
          <input
            type="text"
            value={inputValue}
            name="title"
            placeholder="enter new to-do"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button onClick={() => handleAddItem(inputValue)}>add</button>
        </div>
        {/* list side */}
        <ul style={{ listStyle: "none" }} className="list">
          {data.map((todo, index) => {
            return editingTodo.id === todo.id ? (
              <div className="todos_edit">
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditingTodo({ ...editingTodo, title: value });
                  }}
                />
                <button
                  key={todo.id}
                  onClick={() => {
                    handleDone(editingTodo.title, todo.id, index),
                      toast("saved! ", {
                        autoClose: 2000,
                        position: "top-center",
                      });
                  }}
                >
                  done
                </button>
              </div>
            ) : (
              <li>
                <span
                  onClick={() => handeleCompleted(todo.id)}
                  style={{
                    textDecoration: todo.completed && "line-through",
                    cursor: "pointer",
                  }}
                >
                  {todo.title}
                </span>
                <button onClick={() => handlEditMode(todo)}>edit</button>
                <button
                  onClick={() => {
                    handleDeleteData(todo.id),
                      toast(" DELETED!", { autoClose: 2000 });
                  }}
                >
                  X
                </button>
              </li>
            );
          })}
        </ul>{" "}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
