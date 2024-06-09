import React from "react"
import './App.css';
import MainContainer from "./components/MainContainer";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Welcom from "./components/Welcom";
import ChatArea from "./components/ChatArea";
import Users from "./components/Users";
import CreateGroups from "./components/CreateGroups";
import { Groups } from "@mui/icons-material";
import Profile from "./components/Profile";
import ProfileById from "./components/ProfileById";
import EditProfile from "./components/EditProfile";
import Otp from "./components/Otp";
import ForgotPassword from "./components/ForgotPassword";
import { UserProvider } from "./context/UserContext";
import MemberList from "./components/MemberList";
import SocketProvider from "./context/SocketContext";
import ChatGroup from "./components/ChatGroup";



function App() {
  return (
    <div className="App">
    <UserProvider>
      <SocketProvider>
        <Routes>
            {/* <Route path="/forgotpassword" element={<ForgotPassword/>}/> */}
            {/* <Route path="/" element={<MemberList/>}/> */}
            <Route path="/" element={<Login/>}/>
            <Route path="/login" element={<Login/>}/>    
            <Route path="/register" element={<Register/>}/>
            <Route path="app/:phoneNumber/profile/:phoneNumber" element={<Profile/>}/>
            <Route path="/profileById/:user_id" element={<ProfileById/>}/>
            <Route path="/edit-profile/:phoneNumber" element={<EditProfile/>} />
            <Route path="app/:phoneNumber" element={<MainContainer/>}>
            <Route path="welcom" element={<Welcom/>}/>
            <Route path="chat" element={<ChatArea/>}/>
            <Route path="users/:phoneNumber" element={<Users/>}/>
            <Route path="groups" element={<Groups/>}/>
            <Route path="chatGroup" element={<ChatGroup/>}/>
            <Route path="create-groups" element={<CreateGroups/>}/>  
            </Route>
        </Routes>
      </SocketProvider>
    </UserProvider>
      
    </div>
  )
   
}

export default App;
