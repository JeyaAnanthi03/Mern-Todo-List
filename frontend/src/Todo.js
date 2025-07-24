import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitte, setEditTitle] = useState();
  const [editDescription, setEditDescription] = useState();
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };
  const handleCancel = () => {
    setEditId(-1);
  };
  const handleUpdate = () => {
    setError("");
    if (editTitte.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiURL + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitte,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodo = todos.map((item) => {
              if (item._id === editId) {
                item.title = editTitte;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodo);
            setEditTitle("");
            setEditDescription("");
            setMessage("Item Updated Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1);
          } else {
            setError("Unable to create Item");
          }
        })
        .catch(() => {
          setError("Unable to create Item");
        });
    }
  };

  const apiURL = "http://localhost:8000";
  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiURL + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            setMessage("Item Added Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to create Item");
          }
        })
        .catch(() => {
          setError("Unable to create Item");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);
  const getItems = () => {
    fetch(apiURL + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };
  const handleDelete = (id) => {
    if (window.confirm("Are You sure to Delete it?")) {
      fetch(apiURL + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodo = todos.filter((item) => item._id !== id);
        setTodos(updatedTodo);
      });
    }
  };
  return (
    <>
      <div
        className="row p-3 	
  text-dark text-center"
        style={{ backgroundColor: "#34D399", color: "#fff" }}
      >
        <h1>ToDo List</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success fw-bold">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            className="form-control"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <input
            placeholder="Description"
            className="form-control"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-xl-6">
          <ul className="list-group">
            {todos.map((item) => (
              <li className="list-group-item d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column me-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      {" "}
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <div className="form-group d-flex gap-2">
                      <input
                        placeholder="Title"
                        className="form-control"
                        value={editTitte}
                        onChange={(e) => {
                          setEditTitle(e.target.value);
                        }}
                      />
                      <input
                        placeholder="Description"
                        className="form-control"
                        value={editDescription}
                        onChange={(e) => {
                          setEditDescription(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {editId === -1 || editId !== item._id ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        handleEdit(item);
                      }}
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                  {editId === -1 ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleDelete(item._id);
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={handleCancel}>
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
