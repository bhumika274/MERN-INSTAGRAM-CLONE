import React, {useEffect, createContext, useReducer, useContext} from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./components/Screens/Home";
import Profile from "./components/Screens/Profile"
import Signin from "./components/Screens/Signin"
import Signup from "./components/Screens/Signup"
import CreatePost from "./components/Screens/createPost"
import UserProfile from "./components/Screens/userProfile"
import SubsUserPost from "./components/Screens/SubsUserPost";
import {reducer, initialState} from "./reducers/userReducer" 
import { useNavigate } from "react-router-dom"; 
import "./App.css"

const Routing = () => {
  const {state, dispatch} = useContext(UserContext);
  const navigate = useNavigate();

  
  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        dispatch({ type: "USER", payload: user });
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error handling user data:", error);
    }
  }, []);


  return(

    <Routes>
      <Route exact path = "/" element= {<Home />} />
      <Route exact path = "/profile" element= {<Profile />} />
      <Route path = "/signin" element= {<Signin />} />
      <Route path = "/signup" element= {<Signup />} />
      <Route path = "/createpost" element= {<CreatePost />} />
      <Route path = "/profile/:userid" element= {<UserProfile />} />
      <Route path = "/myfollowerspost" element= {<SubsUserPost />} />
    </Routes>
  )
}
export const UserContext = createContext();


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
        
      </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
