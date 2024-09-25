import { useState, useRef } from "react";
import Comments from "./Comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function Post({ post, id, setPosts }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [ifEdit, setIfEdit] = useState(false);
  const inputTitle = useRef();
  const inputBody = useRef();
  function handlePosts() {
    setShowPosts(!showPosts);
    if (showComments) {
      setShowComments(false);
    }
  }

  function handleComments() {
    setComments(<Comments post={post} />);
    setShowComments(!showComments);
  }

  async function delate() {
    console.log(post.id);
    const confirmation = window.confirm("Are you sure you want to delete this post?");
    if (!confirmation) {
      return;
    }
    try{
      const response = await fetch(`http://localhost:5000/post/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      }
    }catch(err){
      console.log(err);
    }
    
  }

  function editPost() {
    setIfEdit(true);
  }

 async function saveEdit() {
    const title = inputTitle.current.value;
    const body = inputBody.current.value;
    setIfEdit(false);
    try{
      const response = await fetch(`http://localhost:5000/post/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id, title: title, body: body }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setPosts((prevPosts) => {
          return prevPosts.map((p) => {
            if (p.id === post.id) {
              return { ...p, title: title, body: body };
            }
            return p;
          });
        });
      }
    }catch(err){
      console.log(err);
    }
  }
  

  return (
    <div className="post">
      {!ifEdit ? (
        <div className="title" onClick={handlePosts}>
          {id}. {post.title}
        </div>
      ) : (
        <input type="text" ref={inputTitle} defaultValue={post.title} />
      )}
      {showPosts && (
        <>
          {!ifEdit ? (
            <div className="body">{post.body}</div>
          ) : (
            <textarea type="text" ref={inputBody} defaultValue={post.body} />
          )}
        </>
      )}
      <div className="buts-edit">
        {ifEdit && (
          <button className="cancel" onClick={() => setIfEdit(false)}>
            Cancel
          </button>
        )}
        {ifEdit && (
          <button className="save" onClick={saveEdit}>
            Save
          </button>
        )}
      </div>{user.id === post.userId && <div className="but-del-edit">
        <button onClick={delate} className="delate">
        <FontAwesomeIcon icon={faTrash} />
        </button>
        {showPosts && (
          <button onClick={editPost} className="edit">
           <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
      </div>}
      {showPosts && (
        <button className="but-comments" onClick={handleComments}>
          Show comment
        </button>
      )}
      {showComments && <div>{comments}</div>}

      
    </div>
  );
}

export default Post;
