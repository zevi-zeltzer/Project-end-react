
import React, { useState, useEffect, useRef } from "react";
import Comment from "./Comment";



function Comments({ post }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddComment, setIsAddComment] = useState(false);
  const inputCommentBody = useRef();
  const inputCommentName = useRef();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId: post.id }),
          }
        );
        const data = await response.json();
        console.log(data);
        if(response.status === 200){
          setComments(data);
        setLoading(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [post.id]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const addComment = async () => {
    try {
      const response = await fetch("http://localhost:5000/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputCommentName.current.value,
          body: inputCommentBody.current.value,
          email: user.email,
          postId: post.id,
        }),
      });
      const data = await response.json();
      console.log(data);
      if(response.status === 200){
        setComments([...comments, data]);
        setIsAddComment(false);
      }
    } catch (err) {
      setError(err);
    }
  };

 

  
  return (
    <div className="comments">
      { <div className="add-post">
        <button onClick={() => setIsAddComment(!isAddComment)}>
          Add Comment
        </button>
        {isAddComment && (
          <div className="add-post-form">
            <label id="name">Name</label>
            <input id="name" name="name" ref={inputCommentName} />
            <label id="body">Body</label>
            <textarea id="body" name="body" ref={inputCommentBody} />
            <div>
              <button onClick={addComment}>Add</button>
            </div>
          </div>
        )}
      </div>}
      <ul className="comments-list">
      {comments.length > 0 && comments.map((comment) => {
        return (
          <div>
           <Comment key={comment.id} comment={comment} setComments={setComments} />
           </div>
        );
      })}
      </ul>
    </div>
  );
}

export default Comments;
