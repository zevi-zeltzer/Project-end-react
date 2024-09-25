import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import ToDos from "./ToDos";
import Info from "./Info";
import Posts from "./Posts";
import Albums from "./Albums";


function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleShowInfo = () => {
    navigate(`/users/${user.id}/home/info`);
    <Info />;
  };

  const handleShowToDos = () => {
    <ToDos />;
    navigate(`/users/${user.id}/home/toDos`);
  };

  const handleShowPosts = () => {
    <Posts/>;
    navigate(`/users/${user.id}/home/posts`);
  };

  const handleAlbums = () => {
    // <Albums userId={user.id} />;
    // navigate(`/users/${user.id}/home/albums`);
  };

  return (
    <div className="home">
      <h1 className="welcome">Hello {user.name}</h1>
      <div className="buttons">
        <button className="butLogout but" onClick={handleLogout}>
          Logout
        </button>
        <button className="butInfo but" onClick={handleShowInfo}>
          info
        </button>
        <button className="butToDos but" onClick={handleShowToDos}>
          ToDos
        </button>
        <button className="butPosts but" onClick={handleShowPosts}>
          Posts
        </button>
        <button className="butAlbums but" onClick={handleAlbums}>
          Albums
        </button>
      </div>
      <Outlet />
    </div>
  );
}
export default Home;
