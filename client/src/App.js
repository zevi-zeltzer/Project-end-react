import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./main/Login";
import Register from "./main/Register";
import Home from "./main/Home";
import ToDos from "./main/ToDos";
import Albums from "./main/Albums";
import Photos from "./main/Photos";
import Posts from "./main/Posts";
import Info from "./main/Info";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:id/home" element={<Home />}>
        <Route path="/users/:id/home/info" element={<Info />} />
        <Route path="/users/:id/home/posts" element={<Posts />} />
        <Route path="/users/:id/home/toDos" element={<ToDos />} />
        <Route path="/users/:id/home/albums" element={<Albums />} />
        <Route path="/users/:id/home/albums/:albumId/photos" element={<Photos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
