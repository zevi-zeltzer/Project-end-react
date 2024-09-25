import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";

function Comment({ comment, setComments }) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(comment.email, user.email);
  const [isEditing, setIsEditing] = useState(false);
  const inputEditComment = useRef();

  const saveEditComment = async () => {
    const body = inputEditComment.current.value;
    try {
      const response = await fetch('http://localhost:5000/comments/edit', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: comment.id, body: body }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.map((c) => (c.id === comment.id ? { ...c, body } : c))
        );
        setIsEditing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmation) {
      return;
    }
    const response = await fetch(`http://localhost:5000/comments/delete`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId: comment.id }),
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== comment.id)
      );
    }
  };

  return (
    <div className="comment">
      {!isEditing && <p>{comment.body}</p>}
      {comment.email === user.email && (
        <div className="editDelate">
          {isEditing && (
            <div className="editComment">
              <input
                type="text"
                ref={inputEditComment}
                defaultValue={comment.body}
              />
              <button onClick={saveEditComment}>Save</button>
              <button onClick={() => setIsEditing(!isEditing)}>Cancel</button>
            </div>
          )}
          <button className="edit" onClick={() => setIsEditing(!isEditing)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="delate" onClick={deleteComment}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Comment;
