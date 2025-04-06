import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup"
import Profile from "./Profile";
import AddVideo from "./AddVideo";


function App() {
    const [loggedInUser, setLoggedInUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (loggedInUser) {
          localStorage.setItem("user", JSON.stringify(loggedInUser));
        } else {
          localStorage.removeItem("user");
        }
      }, [loggedInUser]);


  return (
    <>
      <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Header isLoggedIn={!!loggedInUser}/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addVideo" element={<AddVideo />} />
        </Routes>
        </UserContext.Provider>
    </>
  );
}  



export default App;