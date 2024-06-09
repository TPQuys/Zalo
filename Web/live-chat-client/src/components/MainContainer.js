import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import "../components/myStyles.css"
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import Wellcom from './Welcom'
import Users_Groups from './Groups'
import Users from './Users';
import Profile from './Profile';
import {Outlet } from '@mui/icons-material';
import Groups from './Groups';
import ChatGroup from './ChatGroup';

function MainContainer() {
  const { phoneNumber } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('wellcom');
  
  // const [currentChat, setCurrentChat] = useState(null);

  const handleListFriendClick = (item) => {
    setSelectedItem(item);
    // setCurrentChat(currentChat);
    setActiveTab('chat');
  };

  const handleGoToUser = () => {
    setActiveTab('users');
  };
  const handleGoToGroup = () => {
    setActiveTab('groups');
  };

  const handleGoToChatGroup = (item) => {
    setSelectedItem(item);
    
    setActiveTab('chatGroup');
  };

  const handleGoToProfile = () => {
    setActiveTab('profile');
  };



  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatArea selectedItem={selectedItem} />;
      case 'users':
        return <Users />;
      case 'groups':
        return <Groups/>
      case 'chatGroup':
        return <ChatGroup selectedItem={selectedItem}/>
      case 'profile':
        return <Profile />;
      default:
        return <Wellcom />;
    }
  };
  return (
    <div className='main-container'>
      <Sidebar phoneNumber={phoneNumber} 
                selectedItem={selectedItem} 
                onListFriendClick={handleListFriendClick}
                onGoToUser={handleGoToUser}
                onGoToProfile={handleGoToProfile}
                onGoToGroup={handleGoToGroup}
                onListGroupChatClick={handleGoToChatGroup}
      />
      {renderContent()}
      {/* <Outlet/> */}
      {/* {wellcomVisible && <Wellcom/>} */}
      {/* {selectedConversation && <ChatArea selectedConversation={selectedConversation}/>}
      <Users/> */}
      {/* <Users_Groups/> */}
    </div>
  )
  

}

export default MainContainer
