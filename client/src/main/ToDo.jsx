import React from "react";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";


function ToDo(props) {
  
  const [isEdit, setIsEdit] = useState(false);
  const inputEditToDo = useRef();
 
  
 
  const handleCheckboxChange = async (id) => {
    //יש באג שהוא מוחק את הכותרת
    const todoToUpdate = props.toDos.find((todo) => todo.id === id);
    if (!todoToUpdate) {
      console.error(`ToDo with id ${id} not found`);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/toDos/checkbox`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          completed: todoToUpdate.completed,
          title: todoToUpdate.title,
        }),
      });
      const data = await response.json();
      console.log(data);
      props.setToDos((prevToDos) =>
        prevToDos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      console.log(err);
    }
  };


 async function deleteToDo() {
    const confirmation = window.confirm("Are you sure you want to delete this ToDo?");
    if (!confirmation) {
      return;
    }
    try{
    const response=await fetch(`http://localhost:5000/toDos/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.toDo.id,
        }),
      });
      const data = await response.json();
      props.setToDos(props.toDos.filter((todo) => todo.id !== props.toDo.id));
      console.log(data)
    }
    catch(err){
        console.log(err)
    }
  }

  async function saveEdit(id) {
    try{
    const response=await fetch(`http://localhost:5000/toDos/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          title: inputEditToDo.current.value
        }), 
      });
      const data = await response.json();
      props.setToDos(props.toDos.map((todo) => (todo.id === id ? data : todo)));
      setIsEdit(!isEdit);
      console.log(data)
    }
    catch(err){
        console.log(err)
    }
  }

  

  return (
    <div className="toDo">
      <div className="title">
        <input
          type="checkbox"
          checked={props.toDo.completed}
          className="check"
          onChange={() => handleCheckboxChange(props.toDo.id)}
        />
        {isEdit ? (
          <input type="text" ref={inputEditToDo} defaultValue={props.toDo.title} />
        ) : (
          <p>
            {<>{props.id}</>}. {props.toDo.title}
          </p>
        )}
      </div>

      { <div className="buts-edit">
                {isEdit && (
                  <button onClick={() => setIsEdit(!isEdit)}>Cancel</button>
                )}
                {isEdit&& (
                  <button onClick={() => saveEdit(props.toDo.id)}>Save</button>
                )}
              </div> 
            }

      { <button onClick={() => deleteToDo()}>
                <FontAwesomeIcon icon={faTrash} />
              </button>}

              { (
                <button onClick={() => setIsEdit(!isEdit)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )} 
            
    </div>
  );
}

export default ToDo;
