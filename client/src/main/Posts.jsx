import React from "react";
import { useState, useEffect, useRef } from "react";
import Post from "./Post";
function Posts() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddPost, setIsAddPost] = useState(false);
  const inputSearch = useRef();
  const inputTitle = useRef();
  const inputBody = useRef();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        console.log(data);
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user.id]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }


  async function allPosts() {
    try {
      const response = await fetch("http://localhost:5000/allPosts", {
        method: "get"
      });
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function myPosts() {
    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handelSearch() {
    let searchValue = inputSearch.current.value;
    if (!isNaN(searchValue)) {
      searchValue = parseInt(searchValue);
      let foundPost = null;
      for (let i = 0; i < posts.length; i++) {
        if (i + 1 === searchValue) {
          console.log(posts[i]);
          foundPost = posts[i];
          break;
        }
      }
      if (foundPost) {
        searchValue = foundPost.id;
      }
    }
    try {
      const response = await fetch("http://localhost:5000/posts/search", {
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
      console.log(data);
      if (response.status === 404) {
        alert("No ToDos found");
        setPosts(posts);
      } else {
        setPosts(data);
      }

    } catch (err) {
      console.log(err);
    }
    
  }

  async function addPost() {
    if (inputTitle.current.value === "" || inputBody.current.value === "") {
      alert("Please fill all fields");
      return;
    }
    setIsAddPost(!isAddPost);
    try {
      const response = await fetch("http://localhost:5000/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: inputTitle.current.value,
          body: inputBody.current.value,
        }),
      });
      const data = await response.json();
      console.log(data);
      setPosts([ ...posts, data ]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="posts">
      {posts.length !== 0 && <div><button onClick={allPosts}>All Posts</button> <button onClick={myPosts}>My Posts</button></div>}
      {posts.length > 0 && (
        <div className="search">
          <input type="text" ref={inputSearch} />
          {<button onClick={handelSearch}>Search</button>}
        </div>
      )}
      {
        <div className="add-post">
          <button onClick={() => setIsAddPost(!isAddPost)}>Add Post</button>
          {isAddPost && (
            <div className="add-post-form">
              <label id="title">Title</label>
              <input type="text" id="title" name="title" ref={inputTitle} />
              <label id="body">Body</label>
              <textarea type="textarea" id="body" name="body" ref={inputBody} />
              <div>
                <button onClick={addPost}>Add</button>
              </div>
            </div>
          )}
        </div>
      }

      <ul className="ul-posts">
        {posts.length > 0 &&
          posts.map((post, i) => {
            return <Post key={i} post={post} id={i+1} setPosts={setPosts} />;
          })}
      </ul>
    </div>
  );
}

export default Posts;
