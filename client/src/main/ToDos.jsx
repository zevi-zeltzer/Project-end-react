import React, { useState, useEffect, useRef } from "react";

import ToDo from "./ToDo";


function ToDos() {
  const [toDos, setToDos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddToDos, setIsAddToDos] = useState(false);
  const inputSearch = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  const inputTitle = useRef();

  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const response = await fetch(`http://localhost:5000/toDos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await response.json();
        setToDos(data);
        setLoading(false);
        console.log(data);
      } catch (err) {
        setError(err);
      }
    };
    fetchToDos();
  }, [user.id]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }
  if (error) {
    return <p className="error">Error: {error.message}</p>;
  }

  async function execution() {
    try {
      const response = await fetch(`http://localhost:5000/toDos/execution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      setToDos(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function alphabetical() {
    try {
      const response = await fetch(`http://localhost:5000/toDos/alphabetical`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      setToDos(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSort(value) {
    switch (value) {
      case "execution":
        execution();
        break;
      case "alphabetical":
        alphabetical();
        break;
      case "random":
        setToDos([...toDos].sort(() => Math.random() - 0.5));
        break;
      case "default":
        setToDos([...toDos].sort((a, b) => a.id - b.id));
        break;
      default:
        break;
    }
  }

  async function handelSearch() {
    let searchValue = inputSearch.current.value;
    if (!isNaN(searchValue)) {
      searchValue = parseInt(searchValue);
      let foundToDo = null;
      for (let i = 0; i < toDos.length; i++) {
        if (i + 1 === searchValue) {
          console.log(toDos[i]);
          foundToDo = toDos[i];
          break;
        }
      }
      if (foundToDo) {
        searchValue = foundToDo.id;
      }
    }
    try {
      const response = await fetch(`http://localhost:5000/toDos/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          searchValue: searchValue,
        }),
      });
      const data = await response.json();
      if (response.status === 404) {
        alert("No ToDos found");
        setToDos(toDos);
      } else {
        setToDos(data);
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function addToDo() {
    if (!inputTitle.current.value) {
      return alert("Please enter a title");
    }
    try {
      const response = await fetch(`http://localhost:5000/toDos/addToDo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: inputTitle.current.value,
          completed: false,
        }),
      });
      const data = await response.json();
      setToDos([...toDos, data]);
      setIsAddToDos(false);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="toDos">
      {toDos.length > 0 && (
        <select
          className="toDos-sort"
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="default">serial</option>
          <option value="execution">execution</option>
          <option value="alphabetical">alphabetical</option>
          <option value="random">random</option>
        </select>
      )}

      {toDos.length > 0 && (
        <div className="search">
          <input type="text" ref={inputSearch} />
          <button onClick={handelSearch}>Search</button>
        </div>
      )}

      {
        <div className="add-todo">
          <button onClick={() => setIsAddToDos(!isAddToDos)}>Add ToDo</button>
          {isAddToDos && (
            <div className="add-todo-form">
              <label id="title">Title</label>
              <input type="text" id="title" name="title" ref={inputTitle} />
              <div>
                <button onClick={addToDo}>Add</button>
              </div>
            </div>
          )}
        </div>
      }

      <ul className="toDos-list">
        {toDos.length > 0 &&
          toDos.map((todo, i) => (
            <div className="toDos-item" key={i}>
              <ToDo
                key={i}
                toDo={todo}
                toDos={toDos}
                setToDos={setToDos}
                id={i + 1}
              />
            </div>
          ))}
      </ul>
    </div>
  );
}

export default ToDos;
